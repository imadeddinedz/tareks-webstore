'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cart';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatPrice } from '@/lib/products';
import { cn } from '@/lib/utils';

export function CartPanel() {
    const { isOpen, closeCart, items, removeItem, updateQuantity } = useCartStore();

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Close cart on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeCart();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [closeCart]);

    // Prevent background scrolling when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={closeCart}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0.5 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 z-[110] w-full max-w-md shadow-2xl flex flex-col glass"
                        style={{ borderLeft: '1px solid var(--border)' }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-[var(--bg-elevated)]/50">
                            <div className="flex items-center gap-3 text-[var(--text)]">
                                <ShoppingBag size={24} className="text-[var(--brand)]" />
                                <h2 className="font-heading font-bold text-xl">Mon Panier</h2>
                            </div>
                            <button
                                onClick={closeCart}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-white transition-colors"
                                aria-label="Fermer le panier"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                                    <div className="w-24 h-24 rounded-full glass border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] animate-float">
                                        <ShoppingBag size={40} className="opacity-50" />
                                    </div>
                                    <div>
                                        <p className="font-heading font-semibold text-xl mb-2">Votre panier est vide</p>
                                        <p className="text-[var(--text-secondary)] max-w-[250px] mx-auto">
                                            Découvrez notre catalogue et trouvez l'équipement qui vous correspond.
                                        </p>
                                    </div>
                                    <button
                                        onClick={closeCart}
                                        className="mt-4 px-8 py-3 rounded-2xl glass font-semibold text-[var(--brand)] hover:bg-[var(--brand)] hover:text-black transition-colors"
                                    >
                                        Continuer mes achats
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <AnimatePresence>
                                        {items.map((item) => (
                                            <motion.div
                                                key={item.cartItemId}
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95, x: 20 }}
                                                className="flex gap-4 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] group relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-glow)] blur-[40px] rounded-full opacity-0 group-hover:opacity-50 transition-opacity pointer-events-none" />

                                                {/* Image */}
                                                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[var(--bg)] shrink-0 border border-[var(--border)]">
                                                    <Image
                                                        src={item.images[0] || '/images/placeholder.webp'}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>

                                                {/* Details */}
                                                <div className="flex flex-1 flex-col justify-between py-0.5 relative z-10">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div>
                                                            <h3 className="font-semibold text-sm line-clamp-2 leading-tight pr-4">
                                                                {item.name}
                                                            </h3>
                                                            {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                                                <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">
                                                                    {Object.entries(item.selectedOptions)
                                                                        .map(([k, v]) => `${k}: ${v}`)
                                                                        .join(' | ')}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => removeItem(item.cartItemId)}
                                                            className="text-[var(--text-muted)] hover:text-[var(--error)] transition-colors p-1"
                                                            aria-label="Supprimer"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-3">
                                                        {/* Quantity Control */}
                                                        <div className="flex items-center bg-[var(--bg-elevated)] rounded-lg border border-[var(--border)]">
                                                            <button
                                                                onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                                                                className="w-8 h-8 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                                                className="w-8 h-8 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
                                                            >
                                                                +
                                                            </button>
                                                        </div>

                                                        <span className="font-bold text-[var(--brand)]">
                                                            {formatPrice(item.price)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 bg-[var(--bg-elevated)]/80 backdrop-blur-xl border-t border-[var(--border)]">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[var(--text-secondary)] font-medium">Sous-total</span>
                                    <span className="font-heading font-black text-2xl">{formatPrice(total)}</span>
                                </div>

                                <p className="text-xs text-[var(--text-muted)] text-center mb-4">
                                    Les frais de livraison seront calculés à l'étape suivante.
                                </p>

                                <Link
                                    href="/checkout"
                                    onClick={closeCart}
                                    className="group relative flex items-center justify-center w-full py-4 rounded-xl font-bold text-black border-none overflow-hidden transition-transform active:scale-[0.98] shadow-[0_0_20px_rgba(0,212,170,0.3)] bg-[var(--brand)]"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
                                    <span className="relative z-10 flex items-center gap-2">
                                        Commander maintenant
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>

                                <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-[var(--success)]">
                                    <ShieldCheck size={14} /> Paiement 100% sécurisé à la livraison
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
