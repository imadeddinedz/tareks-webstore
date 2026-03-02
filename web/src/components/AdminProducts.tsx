'use client';

import Link from 'next/link';
import type { Product } from '@/lib/data';
import { formatPrice } from '@/lib/products';

interface Props {
  products: Product[];
}

export function AdminProducts({ products }: Props) {
  return (
    <div className="space-y-4">
      {products.length === 0 ? (
        <p className="text-amber-50/60">Aucun produit. Ajoutez-en un.</p>
      ) : (
        <div className="space-y-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between rounded-lg border border-amber-900/20 bg-slate-800/50 p-4"
            >
              <div>
                <h3 className="font-semibold text-amber-50">{product.name}</h3>
                <p className="text-sm text-amber-50/60">{formatPrice(product.price)}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/products/${product.slug}/edit`}
                  className="rounded bg-slate-600 px-3 py-1 text-sm text-amber-50 hover:bg-slate-500"
                >
                  Modifier
                </Link>
                <form action={`/api/admin/products/${product.id}/delete`} method="POST">
                  <button
                    type="submit"
                    className="rounded bg-red-900/50 px-3 py-1 text-sm text-red-400 hover:bg-red-900/70"
                    onClick={(e) => {
                      if (!confirm('Supprimer ce produit ?')) e.preventDefault();
                    }}
                  >
                    Supprimer
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
