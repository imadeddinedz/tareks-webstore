import { NextResponse, NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const adminCookie = cookieStore.get('hts_admin');

        if (!adminCookie || adminCookie.value !== '1' && adminCookie.value !== 'authenticated') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Erreur de configuration serveur' }, { status: 500 });
        }

        const { data, error } = await supabaseAdmin
            .from('shipping_rates')
            .select('*')
            .order('wilaya_code');

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Admin shipping GET error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const adminCookie = cookieStore.get('hts_admin');

        if (!adminCookie || adminCookie.value !== '1' && adminCookie.value !== 'authenticated') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const body = await request.json();
        const { rates } = body;

        if (!rates || !Array.isArray(rates)) {
            return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Erreur de configuration serveur' }, { status: 500 });
        }

        // Upsert all rates
        const { error } = await supabaseAdmin
            .from('shipping_rates')
            .upsert(rates, { onConflict: 'wilaya_code' });

        if (error) {
            console.error('Shipping update error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Admin shipping update error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
