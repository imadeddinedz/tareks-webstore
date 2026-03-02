import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
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

  if (!name || !slug) {
    return NextResponse.json({ error: 'Name and slug required' }, { status: 400 });
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from('products')
    .insert({
      name,
      slug,
      description: description || null,
      price: parseInt(price, 10) || 0,
      old_price: old_price ? parseInt(old_price, 10) : null,
      stock: parseInt(stock, 10) || 0,
      sku: sku || null,
      status: status || 'published',
      is_featured: is_featured ?? false,
      tags: tags || [],
      images: images || [],
      category_id: category_id || null,
    })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: data?.id });
}
