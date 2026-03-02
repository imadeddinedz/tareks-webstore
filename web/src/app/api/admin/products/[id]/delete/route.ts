import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  if (cookieStore.get('hts_admin')?.value !== '1') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (id.startsWith('sample-')) {
    return NextResponse.redirect(new URL('/admin/products', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  }

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!key || !url) {
    return NextResponse.redirect(new URL('/admin/products', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  }

  const supabase = createClient(url, key);
  await supabase.from('products').delete().eq('id', id);

  return NextResponse.redirect(new URL('/admin/products', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
}
