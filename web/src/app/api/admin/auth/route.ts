import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!key || !url) return null;
    return createClient(url, key);
}

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        // Check against DB first, fallback to env var
        const supabase = getSupabase();
        let adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        if (supabase) {
            const { data } = await supabase
                .from('store_settings')
                .select('admin_password')
                .eq('id', 1)
                .single();
            if (data?.admin_password) {
                adminPassword = data.admin_password;
            }
        }

        if (password === adminPassword) {
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
    } catch {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        if (cookieStore.get('hts_admin')?.value !== '1') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { currentPassword, newPassword } = await request.json();

        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 6 caractères' }, { status: 400 });
        }

        const supabase = getSupabase();
        if (!supabase) {
            return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
        }

        // Verify current password
        const { data } = await supabase
            .from('store_settings')
            .select('admin_password')
            .eq('id', 1)
            .single();

        const storedPassword = data?.admin_password || process.env.ADMIN_PASSWORD || 'admin123';

        if (currentPassword !== storedPassword) {
            return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 401 });
        }

        // Update password
        const { error } = await supabase
            .from('store_settings')
            .update({ admin_password: newPassword, updated_at: new Date().toISOString() })
            .eq('id', 1);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
