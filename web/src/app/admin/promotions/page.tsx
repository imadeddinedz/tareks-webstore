'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag, Percent, DollarSign, Truck, Package, Search, X, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/products';

interface Promotion {
    id: string;
    name?: string;
    description?: string;
    code?: string;
    type: 'percentage' | 'fixed' | 'free_shipping';
    value: number;
    discount_type?: string;
    applies_to?: string;
    min_order: number;
    max_uses: number | null;
    used_count: number;
    starts_at?: string;
    ends_at?: string;
    is_active: boolean;
    created_at: string;
}

interface Bundle {
    id: string;
    name: string;
    slug: string;
    description?: string;
    bundle_price: number;
    images: string[];
    is_active: boolean;
    items?: { id: string; quantity: number; product: { id: string; name: string; price: number; images: string[] } }[];
}

interface SimpleProduct {
    id: string;
    name: string;
    price: number;
    images: string[];
}

type Tab = 'promotions' | 'bundles';

export default function AdminPromotionsPage() {
    const [tab, setTab] = useState<Tab>('promotions');
    const [promos, setPromos] = useState<Promotion[]>([]);
    const [bundles, setBundles] = useState<Bundle[]>([]);
    const [products, setProducts] = useState<SimpleProduct[]>([]);
    const [loading, setLoading] = useState(true);

    // Promo form state
    const [promoModalOpen, setPromoModalOpen] = useState(false);
    const [editPromo, setEditPromo] = useState<Promotion | null>(null);
    const [promoForm, setPromoForm] = useState({
        name: '', description: '', code: '', type: 'percentage' as string,
        value: '', applies_to: 'all', min_order: '0', max_uses: '',
        starts_at: '', ends_at: '', is_active: true,
    });
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [productSearch, setProductSearch] = useState('');
    const [saving, setSaving] = useState(false);

    // Bundle form state
    const [bundleModalOpen, setBundleModalOpen] = useState(false);
    const [editBundle, setEditBundle] = useState<Bundle | null>(null);
    const [bundleForm, setBundleForm] = useState({
        name: '', description: '', bundle_price: '', is_active: true,
    });
    const [bundleItems, setBundleItems] = useState<{ product_id: string; quantity: number }[]>([]);

    useEffect(() => { fetchAll(); }, []);

    async function fetchAll() {
        setLoading(true);
        try {
            const [promosRes, bundlesRes, prodsRes] = await Promise.all([
                fetch('/api/admin/promotions'),
                fetch('/api/admin/bundles'),
                fetch('/api/admin/categories').then(() =>
                    fetch('/api/admin/products-list').catch(() => null)
                ),
            ]);
            if (promosRes.ok) setPromos(await promosRes.json());
            if (bundlesRes.ok) setBundles(await bundlesRes.json());
        } catch { }

        // Fetch products list for picker
        try {
            const { supabase } = await import('@/lib/supabase');
            if (supabase) {
                const { data } = await supabase.from('products').select('id, name, price, images').order('name');
                if (data) setProducts(data as SimpleProduct[]);
            }
        } catch { }
        setLoading(false);
    }

    // ==================== PROMO HANDLERS ====================
    function openCreatePromo() {
        setEditPromo(null);
        setPromoForm({ name: '', description: '', code: '', type: 'percentage', value: '', applies_to: 'all', min_order: '0', max_uses: '', starts_at: '', ends_at: '', is_active: true });
        setSelectedProductIds([]);
        setPromoModalOpen(true);
    }

    function openEditPromo(p: Promotion) {
        setEditPromo(p);
        setPromoForm({
            name: p.name || '', description: p.description || '', code: p.code || '',
            type: p.type, value: p.value.toString(), applies_to: p.applies_to || 'all',
            min_order: p.min_order.toString(), max_uses: p.max_uses?.toString() || '',
            starts_at: p.starts_at ? p.starts_at.split('T')[0] : '',
            ends_at: p.ends_at ? p.ends_at.split('T')[0] : '',
            is_active: p.is_active,
        });
        setSelectedProductIds([]);
        setPromoModalOpen(true);
    }

    async function handleSavePromo(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editPromo ? `/api/admin/promotions/${editPromo.id}` : '/api/admin/promotions';
            const res = await fetch(url, {
                method: editPromo ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...promoForm,
                    product_ids: promoForm.applies_to === 'specific_products' ? selectedProductIds : [],
                }),
            });
            if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Erreur'); }
            toast.success(editPromo ? 'Promotion modifiée' : 'Promotion créée');
            setPromoModalOpen(false);
            fetchAll();
        } catch (err: any) { toast.error(err.message); }
        setSaving(false);
    }

    async function deletePromo(id: string) {
        if (!confirm('Supprimer cette promotion ?')) return;
        const t = toast.loading('Suppression...');
        try {
            const res = await fetch(`/api/admin/promotions/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
            toast.success('Supprimée', { id: t });
            fetchAll();
        } catch { toast.error('Erreur', { id: t }); }
    }

    async function togglePromo(p: Promotion) {
        try {
            await fetch(`/api/admin/promotions/${p.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !p.is_active }),
            });
            setPromos(prev => prev.map(x => x.id === p.id ? { ...x, is_active: !x.is_active } : x));
            toast.success(p.is_active ? 'Désactivée' : 'Activée');
        } catch { toast.error('Erreur'); }
    }

    // ==================== BUNDLE HANDLERS ====================
    function openCreateBundle() {
        setEditBundle(null);
        setBundleForm({ name: '', description: '', bundle_price: '', is_active: true });
        setBundleItems([]);
        setBundleModalOpen(true);
    }

    function openEditBundle(b: Bundle) {
        setEditBundle(b);
        setBundleForm({ name: b.name, description: b.description || '', bundle_price: b.bundle_price.toString(), is_active: b.is_active });
        setBundleItems(b.items?.map(i => ({ product_id: i.product.id, quantity: i.quantity })) || []);
        setBundleModalOpen(true);
    }

    async function handleSaveBundle(e: React.FormEvent) {
        e.preventDefault();
        if (bundleItems.length < 2) { toast.error('Un pack doit contenir au moins 2 produits'); return; }
        setSaving(true);
        const slug = bundleForm.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        try {
            const url = editBundle ? `/api/admin/bundles/${editBundle.id}` : '/api/admin/bundles';
            const res = await fetch(url, {
                method: editBundle ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...bundleForm, slug, items: bundleItems }),
            });
            if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Erreur'); }
            toast.success(editBundle ? 'Pack modifié' : 'Pack créé');
            setBundleModalOpen(false);
            fetchAll();
        } catch (err: any) { toast.error(err.message); }
        setSaving(false);
    }

    async function deleteBundle(id: string) {
        if (!confirm('Supprimer ce pack ?')) return;
        const t = toast.loading('Suppression...');
        try {
            const res = await fetch(`/api/admin/bundles/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
            toast.success('Supprimé', { id: t });
            fetchAll();
        } catch { toast.error('Erreur', { id: t }); }
    }

    function addBundleItem(productId: string) {
        if (bundleItems.some(i => i.product_id === productId)) return;
        setBundleItems(prev => [...prev, { product_id: productId, quantity: 1 }]);
    }

    function removeBundleItem(productId: string) {
        setBundleItems(prev => prev.filter(i => i.product_id !== productId));
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(productSearch.toLowerCase())
    );

    const typeIcons: Record<string, any> = { percentage: Percent, fixed: DollarSign, free_shipping: Truck };
    const typeLabels: Record<string, string> = { percentage: 'Pourcentage', fixed: 'Montant fixe', free_shipping: 'Livraison gratuite' };

    const inputClass = "block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all";

    const totalBundleValue = bundleItems.reduce((sum, item) => {
        const prod = products.find(p => p.id === item.product_id);
        return sum + (prod?.price || 0) * item.quantity;
    }, 0);

    return (
        <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10 lg:px-12 max-w-[1400px] mx-auto pb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Promotions & Packs</h1>
                    <p className="text-sm text-gray-500 mt-1">Gérez remises, codes promo et packs de produits.</p>
                </div>
                <button
                    onClick={tab === 'promotions' ? openCreatePromo : openCreateBundle}
                    className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 transition-colors"
                >
                    <Plus size={16} />
                    {tab === 'promotions' ? 'Nouvelle promotion' : 'Nouveau pack'}
                </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
                <button onClick={() => setTab('promotions')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${tab === 'promotions' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    <Tag size={14} className="inline mr-1.5 -mt-0.5" /> Promotions
                </button>
                <button onClick={() => setTab('bundles')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${tab === 'bundles' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    <Package size={14} className="inline mr-1.5 -mt-0.5" /> Packs
                </button>
            </div>

            {/* Content */}
            <div className="relative min-h-[300px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <div className="w-8 h-8 border-[3px] border-gray-200 border-t-amber-500 rounded-full animate-spin mb-3" />
                        <p className="text-sm text-gray-500 font-medium">Chargement...</p>
                    </div>
                ) : tab === 'promotions' ? (
                    /* ==================== PROMOTIONS LIST ==================== */
                    <div className="space-y-3">
                        {promos.length === 0 ? (
                            <div className="bg-white rounded-lg border border-gray-200 flex flex-col items-center justify-center p-12 text-center shadow-sm">
                                <Tag size={40} className="text-gray-300 mb-3" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Aucune promotion</h3>
                                <p className="text-sm text-gray-500 max-w-sm">Créez des promotions pour attirer plus de clients.</p>
                                <button onClick={openCreatePromo} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-amber-500 hover:text-amber-600 shadow-sm transition-all">
                                    <Plus size={16} /> Créer une promotion
                                </button>
                            </div>
                        ) : promos.map((promo) => {
                            const TypeIcon = typeIcons[promo.type] || Tag;
                            return (
                                <div key={promo.id} className={`bg-white rounded-lg border border-gray-200 p-5 shadow-sm transition-opacity ${promo.is_active ? '' : 'opacity-60'}`}>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${promo.type === 'percentage' ? 'bg-blue-100 text-blue-600' : promo.type === 'fixed' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                                                <TypeIcon size={18} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-semibold text-gray-900">{promo.name || 'Sans nom'}</span>
                                                    {promo.code && (
                                                        <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 border-dashed font-mono text-xs text-amber-600 font-bold">{promo.code}</span>
                                                    )}
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-500">{typeLabels[promo.type]}</span>
                                                </div>
                                                <p className="text-lg font-black text-gray-900 mt-1">
                                                    {promo.type === 'percentage' ? `-${promo.value}%` : promo.type === 'fixed' ? `-${formatPrice(promo.value)}` : 'Livraison gratuite'}
                                                </p>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mt-1 font-medium">
                                                    <span>Min. {formatPrice(promo.min_order)}</span>
                                                    <span>{promo.used_count}/{promo.max_uses || '∞'} utilisations</span>
                                                    {promo.ends_at && <span>Expire: {new Date(promo.ends_at).toLocaleDateString('fr-FR')}</span>}
                                                    {promo.applies_to && promo.applies_to !== 'all' && <span className="text-amber-600">Produits spécifiques</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <button onClick={() => togglePromo(promo)} className={`p-2 rounded-lg transition-colors ${promo.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`} title={promo.is_active ? 'Désactiver' : 'Activer'}>
                                                {promo.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                            </button>
                                            <button onClick={() => openEditPromo(promo)} className="p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 shadow-sm transition-all"><Edit2 size={14} /></button>
                                            <button onClick={() => deletePromo(promo.id)} className="p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 shadow-sm transition-all"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* ==================== BUNDLES LIST ==================== */
                    <div className="space-y-3">
                        {bundles.length === 0 ? (
                            <div className="bg-white rounded-lg border border-gray-200 flex flex-col items-center justify-center p-12 text-center shadow-sm">
                                <Package size={40} className="text-gray-300 mb-3" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Aucun pack</h3>
                                <p className="text-sm text-gray-500 max-w-sm">Créez des packs de produits pour offrir un meilleur prix groupé.</p>
                                <button onClick={openCreateBundle} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-amber-500 hover:text-amber-600 shadow-sm transition-all">
                                    <Plus size={16} /> Créer un pack
                                </button>
                            </div>
                        ) : bundles.map((bundle) => (
                            <div key={bundle.id} className={`bg-white rounded-lg border border-gray-200 p-5 shadow-sm ${bundle.is_active ? '' : 'opacity-60'}`}>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900">{bundle.name}</span>
                                            {!bundle.is_active && <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-500 font-bold uppercase">Inactif</span>}
                                        </div>
                                        {bundle.description && <p className="text-xs text-gray-500 mt-1">{bundle.description}</p>}
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-lg font-black text-amber-600">{formatPrice(bundle.bundle_price)}</span>
                                            {bundle.items && bundle.items.length > 0 && (
                                                <span className="text-xs text-gray-400 font-medium">{bundle.items.length} produits</span>
                                            )}
                                        </div>
                                        {bundle.items && bundle.items.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {bundle.items.map(item => (
                                                    <span key={item.id} className="px-2 py-0.5 rounded bg-gray-50 border border-gray-200 text-xs text-gray-600 font-medium">
                                                        {item.product.name} ×{item.quantity}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button onClick={() => openEditBundle(bundle)} className="p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 shadow-sm transition-all"><Edit2 size={14} /></button>
                                        <button onClick={() => deleteBundle(bundle.id)} className="p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 shadow-sm transition-all"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ==================== PROMO MODAL ==================== */}
            <AnimatePresence>
                {promoModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPromoModalOpen(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col z-10 overflow-hidden ring-1 ring-gray-200"
                        >
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80 shrink-0">
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">{editPromo ? 'Modifier la promotion' : 'Nouvelle promotion'}</h2>
                                    <p className="text-xs text-gray-500 mt-0.5">Configurez les détails de la remise.</p>
                                </div>
                                <button onClick={() => setPromoModalOpen(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"><X size={16} /></button>
                            </div>
                            <form onSubmit={handleSavePromo} className="p-5 space-y-4 overflow-y-auto">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Nom de la promotion</label>
                                    <input type="text" value={promoForm.name} onChange={(e) => setPromoForm({ ...promoForm, name: e.target.value })} placeholder="Ex: Soldes été" className={inputClass} />
                                </div>

                                {/* Type selector */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Type de remise</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { key: 'percentage', label: 'Pourcentage', icon: Percent, color: 'blue' },
                                            { key: 'fixed', label: 'Montant fixe', icon: DollarSign, color: 'green' },
                                            { key: 'free_shipping', label: 'Livraison gratuite', icon: Truck, color: 'purple' },
                                        ].map(opt => (
                                            <button
                                                key={opt.key}
                                                type="button"
                                                onClick={() => setPromoForm({ ...promoForm, type: opt.key })}
                                                className={`p-3 rounded-lg border text-center text-xs font-medium transition-all ${promoForm.type === opt.key ? `border-${opt.color}-300 bg-${opt.color}-50 text-${opt.color}-700` : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}
                                            >
                                                <opt.icon size={16} className="mx-auto mb-1" />
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Value + Code */}
                                {promoForm.type !== 'free_shipping' && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                                {promoForm.type === 'percentage' ? 'Pourcentage (%)' : 'Montant (DA)'}
                                            </label>
                                            <input type="number" value={promoForm.value} onChange={(e) => setPromoForm({ ...promoForm, value: e.target.value })} min={0} max={promoForm.type === 'percentage' ? 100 : undefined} required className={inputClass} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Code promo (optionnel)</label>
                                            <input type="text" value={promoForm.code} onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })} placeholder="SUMMER20" className={inputClass + ' uppercase font-mono'} />
                                        </div>
                                    </div>
                                )}

                                {promoForm.type === 'free_shipping' && (
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Code promo (optionnel)</label>
                                        <input type="text" value={promoForm.code} onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })} placeholder="FREESHIP" className={inputClass + ' uppercase font-mono'} />
                                    </div>
                                )}

                                {/* Applies to */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">S'applique à</label>
                                    <select value={promoForm.applies_to} onChange={(e) => setPromoForm({ ...promoForm, applies_to: e.target.value })} className={inputClass + ' appearance-none cursor-pointer'}>
                                        <option value="all">Tous les produits</option>
                                        <option value="specific_products">Produits spécifiques</option>
                                    </select>
                                </div>

                                {/* Product picker */}
                                {promoForm.applies_to === 'specific_products' && (
                                    <div className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50/50">
                                        <div className="relative">
                                            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type="text" value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Rechercher un produit..." className="block w-full rounded-md border border-gray-300 bg-white pl-8 pr-3 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:outline-none" />
                                        </div>
                                        <div className="max-h-32 overflow-y-auto space-y-1">
                                            {filteredProducts.slice(0, 10).map(p => {
                                                const selected = selectedProductIds.includes(p.id);
                                                return (
                                                    <button key={p.id} type="button" onClick={() => {
                                                        setSelectedProductIds(prev => selected ? prev.filter(id => id !== p.id) : [...prev, p.id]);
                                                    }} className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${selected ? 'bg-amber-50 text-amber-700 font-medium' : 'hover:bg-gray-100 text-gray-600'}`}>
                                                        <span className="truncate">{p.name}</span>
                                                        {selected && <span className="text-amber-500 text-[10px] font-bold">✓</span>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {selectedProductIds.length > 0 && (
                                            <p className="text-[10px] text-amber-600 font-medium">{selectedProductIds.length} produit(s) sélectionné(s)</p>
                                        )}
                                    </div>
                                )}

                                {/* Min order + Max uses */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Commande min. (DA)</label>
                                        <input type="number" value={promoForm.min_order} onChange={(e) => setPromoForm({ ...promoForm, min_order: e.target.value })} min={0} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Max utilisations</label>
                                        <input type="number" value={promoForm.max_uses} onChange={(e) => setPromoForm({ ...promoForm, max_uses: e.target.value })} min={0} placeholder="∞" className={inputClass} />
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Date de début</label>
                                        <input type="date" value={promoForm.starts_at} onChange={(e) => setPromoForm({ ...promoForm, starts_at: e.target.value })} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Date de fin</label>
                                        <input type="date" value={promoForm.ends_at} onChange={(e) => setPromoForm({ ...promoForm, ends_at: e.target.value })} className={inputClass} />
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-end gap-3">
                                    <button type="button" onClick={() => setPromoModalOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">Annuler</button>
                                    <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 disabled:opacity-50 transition-colors">
                                        {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                                        {editPromo ? 'Sauvegarder' : 'Créer'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ==================== BUNDLE MODAL ==================== */}
            <AnimatePresence>
                {bundleModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setBundleModalOpen(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col z-10 overflow-hidden ring-1 ring-gray-200"
                        >
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80 shrink-0">
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">{editBundle ? 'Modifier le pack' : 'Nouveau pack'}</h2>
                                    <p className="text-xs text-gray-500 mt-0.5">Combinez des produits à un prix avantageux.</p>
                                </div>
                                <button onClick={() => setBundleModalOpen(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"><X size={16} /></button>
                            </div>
                            <form onSubmit={handleSaveBundle} className="p-5 space-y-4 overflow-y-auto">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Nom du pack</label>
                                    <input type="text" value={bundleForm.name} onChange={(e) => setBundleForm({ ...bundleForm, name: e.target.value })} required placeholder="Ex: Pack Sport Complet" className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
                                    <textarea value={bundleForm.description} onChange={(e) => setBundleForm({ ...bundleForm, description: e.target.value })} rows={2} placeholder="Description du pack..." className={inputClass + ' resize-none'} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Prix du pack (DA)</label>
                                    <input type="number" value={bundleForm.bundle_price} onChange={(e) => setBundleForm({ ...bundleForm, bundle_price: e.target.value })} required min={0} className={inputClass} />
                                    {totalBundleValue > 0 && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            Valeur séparée : {formatPrice(totalBundleValue)}
                                            {bundleForm.bundle_price && parseInt(bundleForm.bundle_price) < totalBundleValue && (
                                                <span className="text-green-600 font-medium"> • Économie: {formatPrice(totalBundleValue - parseInt(bundleForm.bundle_price))}</span>
                                            )}
                                        </p>
                                    )}
                                </div>

                                {/* Product picker */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Produits dans le pack</label>
                                    <div className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50/50">
                                        <div className="relative">
                                            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type="text" value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Rechercher un produit..." className="block w-full rounded-md border border-gray-300 bg-white pl-8 pr-3 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:outline-none" />
                                        </div>
                                        <div className="max-h-32 overflow-y-auto space-y-1">
                                            {filteredProducts.slice(0, 10).map(p => {
                                                const inBundle = bundleItems.some(i => i.product_id === p.id);
                                                return (
                                                    <button key={p.id} type="button" onClick={() => inBundle ? removeBundleItem(p.id) : addBundleItem(p.id)} className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${inBundle ? 'bg-amber-50 text-amber-700 font-medium' : 'hover:bg-gray-100 text-gray-600'}`}>
                                                        <span className="truncate">{p.name} — {formatPrice(p.price)}</span>
                                                        {inBundle ? <span className="text-red-400 text-[10px] font-bold">✕</span> : <span className="text-green-500 text-[10px] font-bold">+</span>}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {bundleItems.length > 0 && (
                                            <div className="pt-2 border-t border-gray-200 space-y-1.5">
                                                {bundleItems.map(item => {
                                                    const prod = products.find(p => p.id === item.product_id);
                                                    return (
                                                        <div key={item.product_id} className="flex items-center justify-between text-xs">
                                                            <span className="text-gray-700 font-medium truncate">{prod?.name}</span>
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <span className="text-gray-400">×</span>
                                                                <input type="number" value={item.quantity} min={1} onChange={(e) => {
                                                                    setBundleItems(prev => prev.map(i => i.product_id === item.product_id ? { ...i, quantity: parseInt(e.target.value) || 1 } : i));
                                                                }} className="w-12 rounded border border-gray-300 px-1.5 py-0.5 text-center text-xs" />
                                                                <button type="button" onClick={() => removeBundleItem(item.product_id)} className="text-red-400 hover:text-red-600"><X size={12} /></button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-end gap-3">
                                    <button type="button" onClick={() => setBundleModalOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">Annuler</button>
                                    <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 disabled:opacity-50 transition-colors">
                                        {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                                        {editBundle ? 'Sauvegarder' : 'Créer'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
