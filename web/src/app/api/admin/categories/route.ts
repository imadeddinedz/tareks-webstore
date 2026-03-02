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
        .from('categories')
        .select('*, products:products(count)')
        .order('position', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const categories = (data || []).map((cat: any) => ({
        ...cat,
        product_count: cat.products?.[0]?.count || 0,
    }));

    return NextResponse.json(categories);
}

export async function POST(request: Request) {
    const supabase = await getAdmin();
    if (!supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, slug, description, image, position, is_active } = body;

    if (!name || !slug) {
        return NextResponse.json({ error: 'Name and slug required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('categories')
        .insert({ name, slug, description: description || null, image: image || null, position: position || 0, is_active: is_active ?? true })
        .select('id')
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, id: data?.id });
}
