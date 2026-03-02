'use client';

import { useCartStore } from '@/store/cart';
import type { Product } from '@/lib/data';
import { formatPrice } from '@/lib/products';

export function useCart() {
    const store = useCartStore();

    const addProduct = (product: Product, variant?: string) => {
        store.addItem({
            ...product, // addItem expects Omit<CartItem, "quantity" | "cartItemId">, which extends Product
            selectedOptions: variant ? { Variante: variant } : undefined,
        });
    };

    return {
        ...store,
        addProduct,
        formattedSubtotal: formatPrice(store.subtotal()),
        itemCount: store.totalItems(),
    };
}
