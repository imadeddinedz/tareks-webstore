import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

async function getAdmin() {
    const cookieStore = await cookies();
    if (cookieStore.get('hts_admin')?.value !== '1') return null;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!key || !url) return null;
    return createClient(url, key);
}

export async function GET() {
    const supabase = await getAdmin();
    if (!supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
}

export async function POST(request: Request) {
    const supabase = await getAdmin();
    if (!supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const {
        name, description, code, type, value, discount_type,
        applies_to, min_order, max_uses, starts_at, ends_at,
        is_active, product_ids
    } = body;

    if (!type || value === undefined) {
        return NextResponse.json({ error: 'Type and value required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('promotions')
        .insert({
            name: name || null,
            description: description || null,
            code: code || null,
            type,
            value: parseInt(value, 10) || 0,
            discount_type: discount_type || type,
            applies_to: applies_to || 'all',
            min_order: parseInt(min_order, 10) || 0,
            max_uses: max_uses ? parseInt(max_uses, 10) : null,
            starts_at: starts_at || null,
            ends_at: ends_at || null,
            is_active: is_active ?? true,
        })
        .select('id')
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Insert product associations if applies_to === 'specific_products'
    if (applies_to === 'specific_products' && product_ids?.length && data?.id) {
        const rows = product_ids.map((pid: string) => ({
            promotion_id: data.id,
            product_id: pid,
        }));
        await supabase.from('promotion_products').insert(rows);
    }

    return NextResponse.json({ ok: true, id: data?.id });
}
