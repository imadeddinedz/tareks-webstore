import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
function generateOrderNumber(): string {
    const date = new Date();
    const y = date.getFullYear().toString().slice(-2);
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `HTS-${y}${m}${d}-${rand}`;
}

function validateAlgerianPhone(phone: string): boolean {
    const cleaned = phone.replace(/\s+/g, '').replace(/-/g, '');
    return /^(?:0)?(5|6|7)\d{8}$/.test(cleaned);
}

// Rate limiting: simple in-memory store
const orderAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(phone: string): boolean {
    const now = Date.now();
    const entry = orderAttempts.get(phone);
    if (!entry || now > entry.resetAt) {
        orderAttempts.set(phone, { count: 1, resetAt: now + 3600000 }); // 1 hour window
        return true;
    }
    if (entry.count >= 5) return false; // Max 5 orders per hour
    entry.count++;
    return true;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, phone, wilaya, commune, address, notes, items, subtotal, shipping_cost, total, promo_code } = body;

        // Validation
        if (!name?.trim()) {
            return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 });
        }
        if (!phone || !validateAlgerianPhone(phone)) {
            return NextResponse.json({ error: 'Numéro de téléphone invalide' }, { status: 400 });
        }
        if (!wilaya) {
            return NextResponse.json({ error: 'La wilaya est requise' }, { status: 400 });
        }
        if (!address?.trim()) {
            return NextResponse.json({ error: 'L\'adresse est requise' }, { status: 400 });
        }
        if (!items?.length) {
            return NextResponse.json({ error: 'Le panier est vide' }, { status: 400 });
        }

        // Rate limiting
        if (!checkRateLimit(phone)) {
            return NextResponse.json(
                { error: 'Trop de commandes. Veuillez réessayer plus tard.' },
                { status: 429 }
            );
        }

        // Check blacklist
        if (supabase) {
            const { data: customer } = await supabase
                .from('customers')
                .select('is_blacklisted')
                .eq('phone', phone.replace(/\s+/g, ''))
                .single();

            if (customer?.is_blacklisted) {
                return NextResponse.json(
                    { error: 'Votre commande n\'a pas pu être traitée. Veuillez nous contacter.' },
                    { status: 403 }
                );
            }
        }

        const orderNumber = generateOrderNumber();

        if (supabase) {
            // Create order in database
            const { error: orderError } = await supabase.from('orders').insert({
                order_number: orderNumber,
                customer_name: name.trim(),
                customer_phone: phone.replace(/\s+/g, ''),
                customer_wilaya: wilaya,
                customer_commune: commune?.trim() || null,
                customer_address: address.trim(),
                delivery_notes: notes?.trim() || null,
                items,
                subtotal,
                shipping_cost,
                discount: 0,
                total,
                promo_code: promo_code || null,
                status: 'new',
            });

            if (orderError) {
                console.error('Order creation error:', orderError);
                return NextResponse.json({ error: 'Erreur lors de la création de la commande' }, { status: 500 });
            }

            // Upsert customer
            const cleanPhone = phone.replace(/\s+/g, '');
            const { data: existingCustomer } = await supabase
                .from('customers')
                .select('*')
                .eq('phone', cleanPhone)
                .single();

            if (existingCustomer) {
                await supabase
                    .from('customers')
                    .update({
                        name: name.trim(),
                        wilaya,
                        commune: commune?.trim(),
                        address: address.trim(),
                        order_count: existingCustomer.order_count + 1,
                        total_spent: existingCustomer.total_spent + total,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('phone', cleanPhone);
            } else {
                await supabase.from('customers').insert({
                    name: name.trim(),
                    phone: cleanPhone,
                    wilaya,
                    commune: commune?.trim(),
                    address: address.trim(),
                    order_count: 1,
                    total_spent: total,
                });
            }
        }

        return NextResponse.json({
            success: true,
            order_number: orderNumber,
            message: 'Commande créée avec succès',
        });
    } catch (error) {
        console.error('Order API error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const orderNumber = searchParams.get('order_number');

    if (!phone && !orderNumber) {
        return NextResponse.json({ error: 'Numéro de téléphone ou numéro de commande requis' }, { status: 400 });
    }

    if (supabase) {
        let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

        if (orderNumber) {
            query = query.eq('order_number', orderNumber);
        } else if (phone) {
            query = query.eq('customer_phone', phone.replace(/\s+/g, ''));
        }

        const { data, error } = await query;
        if (error) {
            return NextResponse.json({ error: 'Erreur de recherche' }, { status: 500 });
        }
        return NextResponse.json({ orders: data || [] });
    }

    // No database — return empty
    return NextResponse.json({ orders: [] });
}
