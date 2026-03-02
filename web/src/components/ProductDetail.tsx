'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, ShieldCheck, Truck, RotateCcw, ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/data';
import { useCartStore } from '@/store/cart';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/products';
import { cn } from '@/lib/utils';

export function ProductDetail({ product }: { product: Product }) {
    const [currentImage, setCurrentImage] = useState(0);
    // Extract colors and sizes from variants if they exist
    const colors = product.variants?.find(v => v.name.toLowerCase() === 'couleur')?.options || [];
    const sizes = product.variants?.find(v => v.name.toLowerCase() === 'taille')?.options || [];

    const [selectedColor, setSelectedColor] = useState(colors[0] || '');
    const [selectedSize, setSelectedSize] = useState(sizes[0] || '');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping'>('desc');

    const addItem = useCartStore((s) => s.addItem);
    const openCart = useCartStore((s) => s.openCart);

    const images = product.images.length > 0 ? product.images : ['/images/placeholder.webp'];
    const isSale = product.old_price && product.old_price > product.price;

    const handleAddToCart = () => {
        if (colors.length && !selectedColor) {
            toast.error('Veuillez sélectionner une couleur');
            return;
        }
        if (sizes.length && !selectedSize) {
            toast.error('Veuillez sélectionner une taille');
            return;
        }

        const cartItemData = {
            ...product,
            selectedOptions: {
                ...(selectedColor && { Couleur: selectedColor }),
                ...(selectedSize && { Taille: selectedSize }),
            }
        };

        addItem(cartItemData);

        // Add multiple if quantity > 1
        for (let i = 1; i < quantity; i++) {
            addItem(cartItemData);
        }

        toast.success('Ajouté au panier avec succès !');
        openCart();
    };

    const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

                {/* ===== IMAGE GALLERY ===== */}
                <div className="flex flex-col-reverse md:flex-row gap-4 lg:sticky lg:top-24 h-fit">
                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 hide-scrollbar md:w-24 shrink-0">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImage(idx)}
                                    className={cn(
                                        "relative aspect-square w-20 md:w-full rounded-xl overflow-hidden glass transition-all",
                                        currentImage === idx
                                            ? "ring-2 ring-[var(--brand)] opacity-100 shadow-[0_0_15px_rgba(0,212,170,0.3)]"
                                            : "opacity-60 hover:opacity-100 border-transparent"
                                    )}
                                >
                                    <Image src={img} alt={`${product.name} - Vue ${idx + 1}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Main Image */}
                    <div className="relative aspect-square w-full rounded-3xl overflow-hidden glass bg-[var(--surface)] group">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentImage}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={images[currentImage]}
                                    alt={product.name}
                                    fill
                                    priority
                                    className="object-cover cursor-crosshair transition-transform duration-700 hover:scale-110"
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass border border-[var(--border)] flex items-center justify-center text-[var(--text)] opacity-0 group-hover:opacity-100 hover:bg-[var(--brand)] hover:text-black hover:border-transparent transition-all -translate-x-4 group-hover:translate-x-0"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass border border-[var(--border)] flex items-center justify-center text-[var(--text)] opacity-0 group-hover:opacity-100 hover:bg-[var(--brand)] hover:text-black hover:border-transparent transition-all translate-x-4 group-hover:translate-x-0"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}

                        {/* Badges */}
                        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                            {product.is_featured && (
                                <span className="px-3 py-1 text-xs font-bold rounded-full bg-[rgba(0,212,170,0.15)] text-[var(--brand)] border border-[rgba(0,212,170,0.3)] backdrop-blur-md">
                                    Nouveau
                                </span>
                            )}
                            {isSale && (
                                <span className="px-3 py-1 text-xs font-bold rounded-full bg-[rgba(255,107,53,0.15)] text-[var(--accent)] border border-[rgba(255,107,53,0.3)] backdrop-blur-md">
                                    Promo
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* ===== PRODUCT DETAILS ===== */}
                <div className="flex flex-col animate-slide-up">
                    <div className="mb-2">
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--brand)]">
                            {product.category?.name || 'High Tech Sport'}
                        </span>
                    </div>

                    <h1 className="font-heading font-black text-3xl md:text-5xl text-[var(--text)] mb-4 leading-[1.1] tracking-tight">
                        {product.name}
                    </h1>

                    {/* Pricing */}
                    <div className="flex flex-col mb-8">
                        <div className="flex items-end gap-3">
                            <span className={cn("font-bold text-4xl", isSale ? "text-[var(--accent)]" : "text-[var(--text)]")}>
                                {formatPrice(product.price)}
                            </span>
                            {isSale && (
                                <span className="text-xl text-[var(--text-muted)] line-through decoration-[var(--error)] mb-1">
                                    {formatPrice(product.old_price!)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-[var(--border)] to-transparent my-6" />

                    {/* Variants */}
                    {colors.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-medium text-[var(--text)]">Couleur</span>
                                <span className="text-sm text-[var(--text-muted)]">{selectedColor}</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={cn(
                                            "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border",
                                            selectedColor === color
                                                ? "bg-[var(--brand)] border-[var(--brand)] text-[var(--bg)] shadow-[0_0_15px_rgba(0,212,170,0.3)]"
                                                : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)] hover:text-[var(--text)]"
                                        )}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {sizes.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-medium text-[var(--text)]">Taille</span>
                                <span className="text-sm text-[var(--text-muted)]">{selectedSize}</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={cn(
                                            "min-w-14 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border text-center",
                                            selectedSize === size
                                                ? "bg-[var(--brand)] border-[var(--brand)] text-[var(--bg)] shadow-[0_0_15px_rgba(0,212,170,0.3)]"
                                                : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)] hover:text-[var(--text)]"
                                        )}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity & CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-10 mt-auto">
                        <div className="flex items-center justify-between bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-1.5 w-full sm:w-36 shrink-0 h-[60px]">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text)] transition-colors"
                                disabled={product.stock <= 0}
                            >-</button>
                            <span className="font-bold w-8 text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                className="w-10 h-10 flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text)] transition-colors"
                                disabled={product.stock <= 0}
                            >+</button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0}
                            className={cn(
                                "group relative w-full h-[60px] rounded-2xl font-bold text-lg flex items-center justify-center gap-3 overflow-hidden transition-all shadow-[0_8px_30px_rgba(0,212,170,0.25)] hover:shadow-[0_8px_40px_rgba(0,212,170,0.4)] active:scale-[0.98]",
                                product.stock <= 0
                                    ? "bg-[var(--surface)] text-[var(--text-muted)] cursor-not-allowed shadow-none"
                                    : "bg-white text-black hover:bg-[var(--brand)] hover:text-white"
                            )}
                        >
                            {product.stock > 0 && (
                                <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand)] to-[var(--brand-dark)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <ShoppingCart size={20} className="group-hover:-rotate-12 transition-transform" />
                                {product.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
                            </span>
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 gap-4 mb-12">
                        <div className="flex items-center gap-3 p-4 rounded-2xl glass bg-[rgba(0,212,170,0.03)] border border-[rgba(0,212,170,0.1)]">
                            <div className="w-10 h-10 rounded-full bg-[rgba(0,212,170,0.1)] flex items-center justify-center text-[var(--brand)]">
                                <Truck size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">Livraison Locale</span>
                                <span className="text-xs text-[var(--text-muted)]">Vers 58 wilayas</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-2xl glass bg-[rgba(255,107,53,0.03)] border border-[rgba(255,107,53,0.1)]">
                            <div className="w-10 h-10 rounded-full bg-[rgba(255,107,53,0.1)] flex items-center justify-center text-[var(--accent)]">
                                <ShieldCheck size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">Paiement Sécurisé</span>
                                <span className="text-xs text-[var(--text-muted)]">À la livraison (COD)</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-col">
                        <div className="flex border-b border-[var(--border)] overflow-x-auto hide-scrollbar gap-8">
                            {[
                                { id: 'desc', label: 'Description' },
                                { id: 'specs', label: 'Caractéristiques' },
                                { id: 'shipping', label: 'Livraison' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={cn(
                                        "relative pb-4 text-sm font-bold transition-colors whitespace-nowrap",
                                        activeTab === tab.id ? "text-[var(--text)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                                    )}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="tab-indicator"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand)] rounded-t-full"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="py-6 text-[var(--text-secondary)] min-h-[200px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="prose prose-invert max-w-none"
                                >
                                    {activeTab === 'desc' && (
                                        <p className="whitespace-pre-line leading-relaxed">{product.description}</p>
                                    )}
                                    {activeTab === 'specs' && (
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-2">
                                                <Check size={18} className="text-[var(--brand)] shrink-0 mt-0.5" />
                                                <span>Produit original avec garantie constructeur</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Check size={18} className="text-[var(--brand)] shrink-0 mt-0.5" />
                                                <span>Support client dédié en Algérie</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Check size={18} className="text-[var(--brand)] shrink-0 mt-0.5" />
                                                <span>État: Neuf sous blister</span>
                                            </li>
                                        </ul>
                                    )}
                                    {activeTab === 'shipping' && (
                                        <div className="space-y-4">
                                            <p>
                                                Nous expédions vos commandes vers les 58 wilayas d'Algérie via nos partenaires de livraison (Yalidine, Nord Ouest, etc).
                                            </p>
                                            <ul className="space-y-2">
                                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]" /> Alger et environs : 24h à 48h</li>
                                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]" /> Reste du Nord : 2 à 3 jours</li>
                                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]" /> Grand Sud : 4 à 6 jours</li>
                                            </ul>
                                            <p className="text-sm border-l-2 border-[var(--accent)] pl-3 text-[var(--text-muted)] mt-4">
                                                * Le paiement se fait uniquement en espèces à la réception de votre commande.
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
