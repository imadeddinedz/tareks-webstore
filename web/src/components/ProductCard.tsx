'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/data';
import { useCartStore } from '@/store/cart';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/products';
import { cn } from '@/lib/utils';

export function ProductCard({ product, index = 0 }: { product: Product, index?: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const isSale = product.old_price && product.old_price > product.price;
  const isOutOfStock = product.stock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product page
    e.stopPropagation();

    if (isOutOfStock) return;

    addItem(product);
    toast.success('Produit ajouté au panier !');
    openCart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group relative flex flex-col h-full rounded-2xl overflow-hidden glass transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,212,170,0.15)] hover:border-[rgba(0,212,170,0.3)]"
        style={{
          background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--surface) 100%)',
        }}
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {product.is_featured && (
            <span className="badge badge-new shadow-lg backdrop-blur-md bg-[rgba(0,212,170,0.15)] border border-[rgba(0,212,170,0.3)]">
              Nouveau
            </span>
          )}
          {isSale && (
            <span className="badge badge-promo shadow-lg backdrop-blur-md bg-[rgba(255,107,53,0.15)] border border-[rgba(255,107,53,0.3)]">
              Promo
            </span>
          )}
          {isOutOfStock && (
            <span className="badge badge-stock shadow-lg backdrop-blur-md bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)]">
              Rupture
            </span>
          )}
        </div>

        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-[var(--surface-hover)]">
          <Image
            src={product.images[0] || '/images/placeholder.webp'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Quick Add Button Overlay */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center px-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className={cn(
                "w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transform active:scale-95 transition-all shadow-lg",
                isOutOfStock
                  ? "bg-[var(--surface)] text-[var(--text-muted)] cursor-not-allowed"
                  : "bg-white text-black hover:bg-[var(--brand)] hover:text-white"
              )}
            >
              <ShoppingCart size={16} />
              {isOutOfStock ? 'Épuisé' : 'Ajout rapide'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 relative z-10">
          <div className="mb-1">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--brand)]">
              {product.category?.name || 'Produit'}
            </span>
          </div>
          <h3 className="font-heading font-semibold text-lg line-clamp-2 mb-2 leading-tight group-hover:text-[var(--brand)] transition-colors">
            {product.name}
          </h3>

          <div className="mt-auto pt-4 flex items-end justify-between border-t border-[var(--border)]">
            <div className="flex flex-col">
              {isSale && (
                <span className="text-sm text-[var(--text-muted)] line-through decoration-[var(--error)] mb-0.5">
                  {formatPrice(product.old_price!)}
                </span>
              )}
              <span className={cn(
                "font-bold text-xl",
                isSale ? "text-[var(--accent)]" : "text-[var(--text)]"
              )}>
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Optional: Add a small decorative element here */}
            <div className="w-8 h-8 rounded-full bg-[var(--surface)] flex items-center justify-center group-hover:bg-[var(--brand-glow)] transition-colors">
              <motion.div
                initial={false}
                className="text-[var(--text-secondary)] group-hover:text-[var(--brand)]"
                whileHover={{ x: 3 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
