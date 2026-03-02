import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  if (cookieStore.get('hts_admin')?.value !== '1') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!key || !url) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const body = await request.json();
  const { name, slug, description, price, old_price, stock, sku, status, is_featured, tags, images, category_id } = body;

  const updateData: any = { updated_at: new Date().toISOString() };
  if (name !== undefined) updateData.name = name;
  if (slug !== undefined) updateData.slug = slug;
  if (description !== undefined) updateData.description = description;
  if (price !== undefined) updateData.price = parseInt(price, 10) || 0;
  if (old_price !== undefined) updateData.old_price = old_price ? parseInt(old_price, 10) : null;
  if (stock !== undefined) updateData.stock = parseInt(stock, 10) || 0;
  if (sku !== undefined) updateData.sku = sku || null;
  if (status !== undefined) updateData.status = status;
  if (is_featured !== undefined) updateData.is_featured = is_featured;
  if (tags !== undefined) updateData.tags = tags;
  if (images !== undefined) updateData.images = images;
  if (category_id !== undefined) updateData.category_id = category_id || null;

  const supabase = createClient(url, key);
  const { error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
