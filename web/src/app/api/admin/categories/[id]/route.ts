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
    const { name, slug, description, image, position, is_active } = body;

    const { error } = await supabase
        .from('categories')
        .update({
            name: name ?? undefined,
            slug: slug ?? undefined,
            description: description !== undefined ? description : undefined,
            image: image !== undefined ? image : undefined,
            position: position !== undefined ? position : undefined,
            is_active: is_active !== undefined ? is_active : undefined,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = await getAdmin();
    if (!supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
}
