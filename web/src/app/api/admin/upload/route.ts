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

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF, AVIF' }, { status: 400 });
        }

        // Max 5MB
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 400 });
        }

        const supabase = createClient(url, key);
        const ext = file.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const filePath = `products/${fileName}`;

        const buffer = Buffer.from(await file.arrayBuffer());

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        return NextResponse.json({
            ok: true,
            url: urlData.publicUrl,
            fileName,
        });
    } catch (err: any) {
        console.error('Upload handler error:', err);
        return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
    }
}
