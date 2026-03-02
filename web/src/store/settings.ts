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
            isHydrated: false,

            setHydrated: () => set({ isHydrated: true }),

            fetchSettings: async () => {
                if (!supabase) return;
                try {
                    const [settingsRes, logoRes] = await Promise.all([
                        supabase.from('store_settings').select('*').single(),
                        supabase.from('cms_content').select('*').eq('key', 'logo_image').single()
                    ]);

                    const data = settingsRes.data;
                    const logoUrl = logoRes.data?.value?.url || '';

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
