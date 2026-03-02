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
    const {
        name, description, code, type, value, discount_type,
        applies_to, min_order, max_uses, starts_at, ends_at,
        is_active, product_ids
    } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (code !== undefined) updateData.code = code || null;
    if (type !== undefined) updateData.type = type;
    if (value !== undefined) updateData.value = parseInt(value, 10) || 0;
    if (discount_type !== undefined) updateData.discount_type = discount_type;
    if (applies_to !== undefined) updateData.applies_to = applies_to;
    if (min_order !== undefined) updateData.min_order = parseInt(min_order, 10) || 0;
    if (max_uses !== undefined) updateData.max_uses = max_uses ? parseInt(max_uses, 10) : null;
    if (starts_at !== undefined) updateData.starts_at = starts_at || null;
    if (ends_at !== undefined) updateData.ends_at = ends_at || null;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { error } = await supabase.from('promotions').update(updateData).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Update product associations
    if (product_ids !== undefined) {
        await supabase.from('promotion_products').delete().eq('promotion_id', id);
        if (product_ids.length > 0) {
            const rows = product_ids.map((pid: string) => ({
                promotion_id: id,
                product_id: pid,
            }));
            await supabase.from('promotion_products').insert(rows);
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

    await supabase.from('promotion_products').delete().eq('promotion_id', id);
    const { error } = await supabase.from('promotions').delete().eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
}
