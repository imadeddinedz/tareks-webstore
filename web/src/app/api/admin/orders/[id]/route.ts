import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const adminCookie = cookieStore.get('hts_admin');

        if (!adminCookie || adminCookie.value !== 'authenticated' && adminCookie.value !== '1') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { id } = await context.params;
        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ error: 'Statut manquant' }, { status: 400 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Erreur de configuration serveur' }, { status: 500 });
        }

        const { error } = await supabaseAdmin
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            console.error('Order update error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Admin order update error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
