'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

export interface StoreSettings {
    storeName: string;
    storeEmail: string;
    storePhone: string;
    storeAddress: string;
    yalidineApiId: string;
    yalidineApiToken: string;
    heroImage: string;
    logoImage: string;
    announcementText: string;
    announcementActive: boolean;
}

interface SettingsStore extends StoreSettings {
    isHydrated: boolean;
    setHydrated: () => void;
    fetchSettings: () => Promise<void>;
    updateSettings: (settings: Partial<StoreSettings>) => Promise<boolean>;
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set, get) => ({
            storeName: 'High Tech Sport',
            storeEmail: '',
            storePhone: '',
            storeAddress: '',
            yalidineApiId: '',
            yalidineApiToken: '',
            heroImage: '/images/hero-bike.jpg',
            logoImage: '',
            announcementText: '🚚 Livraison disponible vers les 58 wilayas — Paiement à la livraison',
            announcementActive: true,
            isHydrated: false,

            setHydrated: () => set({ isHydrated: true }),

            fetchSettings: async () => {
                if (!supabase) return;
                try {
                    const [settingsRes, cmsRes] = await Promise.all([
                        supabase.from('store_settings').select('*').single(),
                        supabase.from('cms_content').select('*').in('key', ['logo_image', 'announcement_bar'])
                    ]);

                    const data = settingsRes.data;
                    const cmsData = cmsRes.data || [];

                    const logoItem = cmsData.find((item: any) => item.key === 'logo_image');
                    const announcementItem = cmsData.find((item: any) => item.key === 'announcement_bar');

                    const logoUrl = logoItem?.value?.url || '';
                    const announcementText = announcementItem?.value?.text || '🚚 Livraison disponible vers les 58 wilayas — Paiement à la livraison';
                    const announcementActive = announcementItem?.value?.is_active ?? true;

                    if (data && !settingsRes.error) {
                        set({
                            storeName: data.store_name || 'High Tech Sport',
                            storeEmail: data.store_email || '',
                            storePhone: data.store_phone || '',
                            storeAddress: data.store_address || '',
                            yalidineApiId: data.yalidine_api_id || '',
                            yalidineApiToken: data.yalidine_api_token || '',
                            heroImage: data.hero_image || '/images/hero-bike.jpg',
                            logoImage: logoUrl,
                            announcementText,
                            announcementActive,
                        });
                    }
                } catch (err) {
                    console.error('Failed to fetch store settings', err);
                }
            },

            updateSettings: async (settings) => {
                set({ ...settings });

                if (!supabase) return false;
                try {
                    const response = await fetch('/api/admin/settings', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(settings),
                    });

                    if (!response.ok) {
                        const err = await response.json();
                        throw new Error(err.error || 'API Error');
                    }

                    return true;
                } catch (err) {
                    console.error('Failed to update store settings', err);
                    return false;
                }
            }
        }),
        {
            name: 'hts-settings',
            onRehydrateStorage: () => (state) => {
                state?.setHydrated();
                state?.fetchSettings();
            }
        }
    )
);
