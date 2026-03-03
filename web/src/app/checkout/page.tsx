'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getWilayas, Wilaya } from '@/lib/wilayas';
import { COMMUNES_BY_WILAYA } from '@/lib/communes';
import { useCartStore } from '@/store/cart';
import { ArrowLeft, ArrowRight, ShieldCheck, Truck, Check, MapPin, User, Phone, PackageCheck, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/products';
import { cn } from '@/lib/utils';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, clearCart } = useCartStore();
    const [wilayas, setWilayas] = useState<Wilaya[]>([]);
    const [selectedWilaya, setSelectedWilaya] = useState<Wilaya | null>(null);

    // Checkout state
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderComplete, setOrderComplete] = useState<{ id: string, total: number } | null>(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        wilaya: '',
        commune: '',
        address: '',
        notes: '',
    });

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = selectedWilaya?.homePrice || 0;
    const total = subtotal + shippingCost;

    useEffect(() => {
        async function fetchWilayas() {
            const data = await getWilayas();
            setWilayas(data);
        }
        fetchWilayas();
    }, []);

    useEffect(() => {
        if (items.length === 0 && !orderComplete) {
            router.push('/products');
        }
    }, [items, router, orderComplete]);

    const handleWilayaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const w = wilayas.find(w => w.name === e.target.value);
        setSelectedWilaya(w || null);
        setFormData({ ...formData, wilaya: e.target.value, commune: '' }); // Reset commune when wilaya changes
    };

    const formatPhoneNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '').slice(0, 9);
        const match = cleaned.match(/^(\d{0,3})(\d{0,2})(\d{0,2})(\d{0,2})$/);
        if (!match) return cleaned;
        return [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ');
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1) {
            if (!formData.firstName || !formData.lastName || !formData.phone) {
                toast.error('Veuillez remplir vos informations personnelles');
                return;
            }
            const cleanPhone = formData.phone.replace(/\s+/g, '');
            if (cleanPhone.length < 9) {
                toast.error('Numéro de téléphone invalide');
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!formData.wilaya || !formData.commune || !formData.address) {
                toast.error('Veuillez remplir votre adresse complète');
                return;
            }
            handleOrderSubmit();
        }
    };

    const handleOrderSubmit = async () => {
        if (items.length === 0) return;
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`.trim(),
                    phone: formData.phone,
                    wilaya: formData.wilaya,
                    commune: formData.commune,
                    address: formData.address,
                    notes: formData.notes,
                    items: items.map(item => ({
                        product_id: item.id,
                        product_name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        options: item.selectedOptions || {},
                    })),
                    subtotal: subtotal,
                    shipping_cost: shippingCost,
                    total: total,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Erreur lors de la création de la commande');

            clearCart();
            setOrderComplete({ id: data.order_number, total });
            setStep(3);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!orderComplete && items.length === 0) return null;

    return (
        <div className="min-h-screen bg-[var(--bg)] pt-8 pb-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                {!orderComplete && (
                    <div className="mb-8 flex items-center justify-between">
                        <Link href="/cart" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors font-medium">
                            <ArrowLeft size={18} /> Retour au panier
                        </Link>

                        {/* Stepper */}
                        <div className="hidden sm:flex items-center gap-4">
                            {[
                                { num: 1, label: 'Informations', icon: User },
                                { num: 2, label: 'Livraison', icon: MapPin },
                                { num: 3, label: 'Confirmation', icon: Check }
                            ].map((s, i) => (
                                <div key={s.num} className="flex items-center">
                                    <div className={cn(
                                        "flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all duration-300",
                                        step === s.num
                                            ? "bg-[var(--brand)] text-[var(--bg)] border-[var(--brand)] shadow-[0_0_15px_rgba(0,212,170,0.3)]"
                                            : step > s.num
                                                ? "bg-[var(--surface)] text-[var(--brand)] border-[var(--brand)]"
                                                : "glass text-[var(--text-muted)] border-[var(--border)]"
                                    )}>
                                        <s.icon size={16} />
                                        {s.label}
                                    </div>
                                    {i < 2 && <div className={cn("w-8 h-px mx-2", step > s.num ? "bg-[var(--brand)]" : "bg-[var(--border)]")} />}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className={cn("grid gap-12 items-start", !orderComplete ? "lg:grid-cols-12" : "grid-cols-1 max-w-2xl mx-auto")}>

                    {/* Main Content Area */}
                    <div className={cn("order-2 lg:order-1", !orderComplete ? "lg:col-span-7" : "")}>
                        <AnimatePresence mode="wait">
                            {/* STEP 1: PERSONAL INFO */}
                            {step === 1 && !orderComplete && (
                                <motion.form
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleNextStep}
                                    className="space-y-6"
                                >
                                    <div className="glass p-8 rounded-3xl border border-[var(--border)] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--brand-glow)] rounded-full blur-[80px] opacity-20 pointer-events-none" />

                                        <h2 className="font-heading font-bold text-2xl mb-6 flex items-center gap-3">
                                            <User className="text-[var(--brand)]" />
                                            Vos informations
                                        </h2>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-[var(--text-secondary)]">Prénom *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                    className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none transition-all"
                                                    placeholder="Ex: Amine"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-[var(--text-secondary)]">Nom *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none transition-all"
                                                    placeholder="Ex: Benali"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-8">
                                            <label className="text-sm font-medium text-[var(--text-secondary)]">Téléphone *</label>
                                            <div className="relative">
                                                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                                <span className="absolute left-10 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] font-medium border-r border-[var(--border)] pr-3 py-1">+213</span>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })}
                                                    className="w-full pl-[5.5rem] pr-4 py-3.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none transition-all"
                                                    placeholder="555 12 34 56"
                                                    maxLength={12}
                                                />
                                            </div>
                                        </div>

                                        <button type="submit" className="w-full py-4 rounded-xl bg-[var(--brand)] text-[#08080F] font-bold text-lg hover:bg-[var(--brand-dark)] hover:shadow-[0_0_20px_rgba(0,212,170,0.3)] transition-all flex items-center justify-center gap-2">
                                            Continuer vers la livraison <ArrowRight size={20} />
                                        </button>
                                    </div>
                                </motion.form>
                            )}

                            {/* STEP 2: SHIPPING INFO */}
                            {step === 2 && !orderComplete && (
                                <motion.form
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleNextStep}
                                    className="space-y-6"
                                >
                                    <div className="glass p-8 rounded-3xl border border-[var(--border)] relative overflow-hidden">
                                        <h2 className="font-heading font-bold text-2xl mb-6 flex items-center gap-3">
                                            <MapPin className="text-[var(--brand)]" />
                                            Adresse de livraison
                                        </h2>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-[var(--text-secondary)]">Wilaya *</label>
                                                <select
                                                    required
                                                    value={formData.wilaya}
                                                    onChange={handleWilayaChange}
                                                    className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none transition-all appearance-none"
                                                >
                                                    <option value="">Sélectionnez une wilaya</option>
                                                    {wilayas.map(w => (
                                                        <option key={w.code} value={w.name}>{w.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-[var(--text-secondary)]">Commune *</label>
                                                <select
                                                    required
                                                    value={formData.commune}
                                                    onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                                                    disabled={!selectedWilaya}
                                                    className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <option value="">Sélectionnez une commune</option>
                                                    {selectedWilaya && COMMUNES_BY_WILAYA[Number(selectedWilaya.code)]?.filter((c): c is string => !!c).sort().map((c) => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-6">
                                            <label className="text-sm font-medium text-[var(--text-secondary)]">Adresse complète *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none transition-all"
                                                placeholder="Numéro de rue, bâtiment, quartier..."
                                            />
                                        </div>

                                        <div className="space-y-2 mb-8">
                                            <label className="text-sm font-medium text-[var(--text-secondary)]">Notes (Optionnel)</label>
                                            <textarea
                                                value={formData.notes}
                                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                                rows={2}
                                                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] outline-none transition-all resize-none"
                                                placeholder="Instructions spéciales pour le livreur..."
                                            />
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="py-4 px-6 rounded-xl glass text-[var(--text)] font-bold hover:bg-[var(--surface)] transition-all flex items-center justify-center"
                                            >
                                                <ArrowLeft size={20} />
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting || !selectedWilaya}
                                                className={cn(
                                                    "flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all relative overflow-hidden",
                                                    isSubmitting || !selectedWilaya
                                                        ? "bg-[var(--surface)] text-[var(--text-muted)] cursor-not-allowed"
                                                        : "bg-[var(--brand)] text-[#08080F] hover:bg-[var(--brand-dark)] shadow-[0_0_20px_rgba(0,212,170,0.3)] hover:shadow-[0_0_30px_rgba(0,212,170,0.5)] active:scale-[0.98]"
                                                )}
                                            >
                                                {isSubmitting ? (
                                                    <div className="w-6 h-6 border-2 border-[#08080F]/30 border-t-[#08080F] rounded-full animate-spin" />
                                                ) : (
                                                    <>Confirmer & Commander <PackageCheck size={20} /></>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </motion.form>
                            )}

                            {/* STEP 3: SUCCESS */}
                            {step === 3 && orderComplete && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="glass p-10 md:p-16 rounded-[2.5rem] border border-[var(--border)] text-center relative overflow-hidden shadow-2xl"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-glow)] via-transparent to-transparent opacity-50" />
                                    <div className="absolute inset-0 noise opacity-20" />

                                    <div className="relative z-10">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", duration: 1, delay: 0.2 }}
                                            className="w-24 h-24 mx-auto bg-gradient-to-br from-[var(--brand)] to-[var(--brand-dark)] rounded-full flex items-center justify-center text-[#08080F] shadow-[0_0_40px_rgba(0,212,170,0.4)] mb-8"
                                        >
                                            <Check size={48} strokeWidth={3} />
                                        </motion.div>

                                        <h1 className="font-heading font-black text-4xl mb-4 text-gray-900 tracking-tight">
                                            Merci pour votre commande !
                                        </h1>
                                        <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-lg mx-auto leading-relaxed">
                                            Votre commande <strong className="text-gray-900">#{orderComplete.id.substring(0, 8).toUpperCase()}</strong> a été enregistrée avec succès. Notre équipe vous contactera très prochainement pour la confirmation.
                                        </p>

                                        <div className="inline-block glass bg-[rgba(255,107,53,0.05)] border-[rgba(255,107,53,0.2)] rounded-3xl p-8 mb-10 w-full max-w-md">
                                            <p className="font-bold text-2xl text-[var(--accent)] mb-2">Total à payer</p>
                                            <p className="font-heading font-black text-4xl text-gray-900 tracking-tight">{formatPrice(orderComplete.total)}</p>
                                            <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-[var(--text-muted)]">
                                                <Truck size={16} /> Paiement à la livraison
                                            </div>
                                        </div>

                                        <div>
                                            <Link
                                                href="/products"
                                                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gray-900 !text-white font-bold hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-xl"
                                            >
                                                Retour à la boutique
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar / Order Summary */}
                    {!orderComplete && (
                        <div className="order-1 lg:order-2 lg:col-span-5 lg:sticky lg:top-24">
                            <div className="glass rounded-[2rem] border border-[var(--border)] p-6 md:p-8 relative overflow-hidden shadow-xl">
                                <div className="absolute top-0 right-0 p-6 pointer-events-none">
                                    <ShieldCheck size={120} className="text-[var(--brand)] opacity-[0.03] -rotate-12" />
                                </div>

                                <h3 className="font-heading font-bold text-xl mb-6 flex items-center gap-3">
                                    <ShoppingCart size={20} className="text-[var(--text-muted)]" />
                                    Récapitulatif
                                </h3>

                                {/* Items */}
                                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 hide-scrollbar mb-6">
                                    {items.map((item) => (
                                        <div key={item.cartItemId} className="flex gap-4">
                                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[var(--surface)] border border-[var(--border)] shrink-0">
                                                <Image src={item.images[0] || '/images/placeholder.webp'} alt={item.name} fill className="object-cover" />
                                                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[10px] font-bold z-10">
                                                    {item.quantity}
                                                </div>
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <span className="font-medium text-sm line-clamp-2 leading-tight text-[var(--text)] mb-1">{item.name}</span>
                                                <span className="font-bold text-sm text-[var(--brand)]">{formatPrice(item.price * item.quantity)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--border)] to-transparent my-6" />

                                {/* Totals */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-[var(--text-secondary)]">Sous-total</span>
                                        <span className="font-semibold text-white">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-[var(--text-secondary)]">Livraison {selectedWilaya ? `(${selectedWilaya.name})` : ''}</span>
                                        {selectedWilaya ? (
                                            <span className="font-semibold text-[var(--accent)]">+{formatPrice(selectedWilaya.homePrice)}</span>
                                        ) : (
                                            <span className="text-[var(--text-muted)] italic">À calculer</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center py-4 border-t border-[var(--border)]">
                                    <span className="font-heading font-bold text-lg text-white">Total</span>
                                    <span className="font-heading font-black text-2xl text-[var(--brand)]">{formatPrice(total)}</span>
                                </div>

                                {/* COD Alert */}
                                <div className="mt-4 p-4 rounded-2xl bg-[rgba(255,107,53,0.1)] border border-[rgba(255,107,53,0.2)] flex items-start gap-3">
                                    <div className="p-1 rounded-full bg-[var(--accent)] text-[#08080F] shrink-0 mt-0.5">
                                        <Check size={12} strokeWidth={4} />
                                    </div>
                                    <p className="text-sm font-medium text-[var(--text)] leading-snug">
                                        Paiement à la livraison <span className="text-[var(--text-secondary)] font-normal block mt-1">Payez en espèces directement au livreur lors de la réception.</span>
                                    </p>
                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
