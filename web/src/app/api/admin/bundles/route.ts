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
        .from('product_bundles')
        .select('*, items:bundle_items(*, product:products(id, name, price, images))')
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
}

export async function POST(request: Request) {
    const supabase = await getAdmin();
    if (!supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, slug, description, bundle_price, images, is_active, items } = body;

    if (!name || !slug || !bundle_price) {
        return NextResponse.json({ error: 'Name, slug, and price required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('product_bundles')
        .insert({
            name,
            slug,
            description: description || null,
            bundle_price: parseInt(bundle_price, 10),
            images: images || [],
            is_active: is_active ?? true,
        })
        .select('id')
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (items?.length && data?.id) {
        const rows = items.map((item: { product_id: string; quantity?: number }) => ({
            bundle_id: data.id,
            product_id: item.product_id,
            quantity: item.quantity || 1,
        }));
        await supabase.from('bundle_items').insert(rows);
    }

    return NextResponse.json({ ok: true, id: data?.id });
}
