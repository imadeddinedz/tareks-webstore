import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function PUT(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const adminCookie = cookieStore.get('hts_admin');

        if (!adminCookie || adminCookie.value !== '1' && adminCookie.value !== 'authenticated') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Erreur de configuration serveur' }, { status: 500 });
        }

        const settings = await request.json();

        const dbPayload: Record<string, any> = {
            id: 1,
            updated_at: new Date().toISOString(),
        };

        if (settings.storeName !== undefined) dbPayload.store_name = settings.storeName;
        if (settings.storeEmail !== undefined) dbPayload.store_email = settings.storeEmail;
        if (settings.storePhone !== undefined) dbPayload.store_phone = settings.storePhone;
        if (settings.storeAddress !== undefined) dbPayload.store_address = settings.storeAddress;
        if (settings.yalidineApiId !== undefined) dbPayload.yalidine_api_id = settings.yalidineApiId;
        if (settings.yalidineApiToken !== undefined) dbPayload.yalidine_api_token = settings.yalidineApiToken;
        if (settings.heroImage !== undefined) dbPayload.hero_image = settings.heroImage;

        const { error } = await supabaseAdmin
            .from('store_settings')
            .upsert(dbPayload);

        if (error) {
            console.error('Settings save error:', error);
            return NextResponse.json({ error: 'Erreur lors de la sauvegarde dans la DB' }, { status: 500 });
        }

        if (settings.logoImage !== undefined) {
            await supabaseAdmin.from('cms_content').upsert({
                key: 'logo_image',
                value: { url: settings.logoImage },
                updated_at: new Date().toISOString()
            }, { onConflict: 'key' });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Admin settings error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
