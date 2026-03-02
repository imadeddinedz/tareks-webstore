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
            storeName: 'MA BOUTIQUE',
            storeEmail: '',
            storePhone: '',
            storeAddress: '',
            yalidineApiId: '',
            yalidineApiToken: '',
            isHydrated: false,

            setHydrated: () => set({ isHydrated: true }),

            fetchSettings: async () => {
                if (!supabase) return;
                try {
                    const { data, error } = await supabase
                        .from('store_settings')
                        .select('*')
                        .single();

                    if (data && !error) {
                        set({
                            storeName: data.store_name || 'MA BOUTIQUE',
                            storeEmail: data.store_email || '',
                            storePhone: data.store_phone || '',
                            storeAddress: data.store_address || '',
                            yalidineApiId: data.yalidine_api_id || '',
                            yalidineApiToken: data.yalidine_api_token || '',
                        });
                    }
                } catch (err) {
                    console.error('Failed to fetch store settings', err);
                }
            },

            updateSettings: async (settings) => {
                // Optimistic UI update
                set({ ...settings });

                if (!supabase) return false;
                try {
                    const { error } = await supabase
                        .from('store_settings')
                        .upsert({
                            id: 1, // Single row assumption
                            store_name: settings.storeName ?? get().storeName,
                            store_email: settings.storeEmail ?? get().storeEmail,
                            store_phone: settings.storePhone ?? get().storePhone,
                            store_address: settings.storeAddress ?? get().storeAddress,
                            yalidine_api_id: settings.yalidineApiId ?? get().yalidineApiId,
                            yalidine_api_token: settings.yalidineApiToken ?? get().yalidineApiToken,
                            updated_at: new Date().toISOString()
                        });

                    return !error;
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
