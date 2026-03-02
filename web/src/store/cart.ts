'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/lib/data';

export interface CartItem extends Product {
    quantity: number;
    cartItemId: string;
    selectedOptions?: Record<string, string>;
}

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: Omit<CartItem, 'quantity' | 'cartItemId'>) => void;
    removeItem: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    totalItems: () => number;
    subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (item) => {
                const items = get().items;
                // Create a unique cartItemId based on the product ID and selected options
                const optionString = item.selectedOptions
                    ? Object.values(item.selectedOptions).join('-')
                    : 'default';
                const cartItemId = `${item.id}-${optionString}`;

                const existingItem = items.find((i) => i.cartItemId === cartItemId);

                if (existingItem) {
                    set({
                        items: items.map((i) =>
                            i.cartItemId === cartItemId
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                        ),
                        isOpen: true,
                    });
                } else {
                    set({
                        items: [...items, { ...item, quantity: 1, cartItemId }],
                        isOpen: true,
                    });
                }
            },

            removeItem: (cartItemId) => {
                set({
                    items: get().items.filter((i) => i.cartItemId !== cartItemId),
                });
            },

            updateQuantity: (cartItemId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(cartItemId);
                    return;
                }
                set({
                    items: get().items.map((i) =>
                        i.cartItemId === cartItemId
                            ? { ...i, quantity }
                            : i
                    ),
                });
            },

            clearCart: () => set({ items: [] }),
            toggleCart: () => set({ isOpen: !get().isOpen }),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),

            totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

            subtotal: () =>
                get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
        }),
        {
            name: 'hts-cart',
            partialize: (state) => ({ items: state.items }),
        }
    )
);
