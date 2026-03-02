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

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = await getAdmin();
    if (!supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, slug, description, bundle_price, images, is_active, items } = body;

    const updateData: any = { updated_at: new Date().toISOString() };
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (bundle_price !== undefined) updateData.bundle_price = parseInt(bundle_price, 10);
    if (images !== undefined) updateData.images = images;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { error } = await supabase.from('product_bundles').update(updateData).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (items !== undefined) {
        await supabase.from('bundle_items').delete().eq('bundle_id', id);
        if (items.length > 0) {
            const rows = items.map((item: { product_id: string; quantity?: number }) => ({
                bundle_id: id,
                product_id: item.product_id,
                quantity: item.quantity || 1,
            }));
            await supabase.from('bundle_items').insert(rows);
        }
    }

    return NextResponse.json({ ok: true });
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = await getAdmin();
    if (!supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await supabase.from('bundle_items').delete().eq('bundle_id', id);
    const { error } = await supabase.from('product_bundles').delete().eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
}
