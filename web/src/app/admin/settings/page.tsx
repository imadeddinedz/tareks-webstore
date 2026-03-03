'use client';

import { useState, useEffect, useRef } from 'react';
import { Shield, Wallet, Store, Save, Truck, Eye, EyeOff, Check, Loader2, Image as ImageIcon, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettingsStore } from '@/store/settings';
import Image from 'next/image';

type TabKey = 'general' | 'shipping' | 'payments' | 'security';

const TABS: { key: TabKey; label: string; icon: any }[] = [
    { key: 'general', label: 'Général', icon: Store },
    { key: 'shipping', label: 'Livraison', icon: Truck },
    { key: 'payments', label: 'Paiements', icon: Wallet },
    { key: 'security', label: 'Sécurité', icon: Shield },
];

export default function AdminSettings() {
    const { storeName, storeEmail, storePhone, storeAddress, yalidineApiId, yalidineApiToken, heroImage, updateSettings } = useSettingsStore();
    const [activeTab, setActiveTab] = useState<TabKey>('general');
    const [saving, setSaving] = useState(false);
    const [shippingRates, setShippingRates] = useState<any[]>([]);
    const [loadingShipping, setLoadingShipping] = useState(false);

    const [formState, setFormState] = useState({
        storeName: '', email: '', phone: '', address: '',
        apiId: '', apiToken: '',
        announcementText: '',
    });
    const [announcementActive, setAnnouncementActive] = useState(true);

    // Hero image
    const [heroPreview, setHeroPreview] = useState('');
    const [uploadingHero, setUploadingHero] = useState(false);
    const heroInputRef = useRef<HTMLInputElement>(null);

    // Logo image
    const [logoPreview, setLogoPreview] = useState('');
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const logoInputRef = useRef<HTMLInputElement>(null);

    // Security
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);

    // Payments
    const [codEnabled, setCodEnabled] = useState(true);
    const [codFee, setCodFee] = useState('0');

    useEffect(() => {
        setFormState({
            storeName: storeName || '', email: storeEmail || '',
            phone: storePhone || '', address: storeAddress || '',
            apiId: yalidineApiId || '', apiToken: yalidineApiToken || '',
            announcementText: useSettingsStore.getState().announcementText || 'Livraison disponible vers les 58 wilayas',
        });
        setAnnouncementActive(useSettingsStore.getState().announcementActive ?? true);
        setHeroPreview(heroImage || '/images/hero-bike.jpg');
        setLogoPreview(useSettingsStore.getState().logoImage || '');
    }, [storeName, storeEmail, storePhone, storeAddress, yalidineApiId, yalidineApiToken, heroImage]);

    useEffect(() => {
        if (activeTab === 'shipping' && shippingRates.length === 0) {
            fetchShippingRates();
        }
    }, [activeTab]);

    const fetchShippingRates = async () => {
        setLoadingShipping(true);
        try {
            const res = await fetch('/api/admin/shipping');
            if (res.ok) {
                const data = await res.json();
                setShippingRates(data || []);
            }
        } catch (error) {
            console.error(error);
        }
        setLoadingShipping(false);
    };

    const handleSaveShippingRates = async () => {
        setSaving(true);
        const toastId = toast.loading('Sauvegarde des tarifs...');
        try {
            const res = await fetch('/api/admin/shipping', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rates: shippingRates })
            });
            if (!res.ok) throw new Error();
            toast.success('Tarifs de livraison mis à jour', { id: toastId });
        } catch (err) {
            toast.error('Erreur lors de la sauvegarde des tarifs', { id: toastId });
        }
        setSaving(false);
    };

    const handleSaveGeneral = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const success = await updateSettings({
            storeName: formState.storeName, storeEmail: formState.email,
            storePhone: formState.phone, storeAddress: formState.address,
            yalidineApiId: formState.apiId, yalidineApiToken: formState.apiToken,
            announcementText: formState.announcementText,
            announcementActive: announcementActive
        });
        setSaving(false);
        success ? toast.success('Paramètres sauvegardés') : toast.error('Erreur lors de la sauvegarde');
    };

    const handleHeroUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Veuillez sélectionner une image');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image trop lourde (max 10 MB)');
            return;
        }

        setUploadingHero(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Upload error');

            const url = data.url;
            setHeroPreview(url);
            const success = await updateSettings({ heroImage: url });
            if (success) {
                toast.success('Image hero mise à jour');
            } else {
                toast.success('Image uploadée (sera synchronisée au prochain chargement)');
            }
        } catch (err: any) {
            toast.error(err.message || "Erreur lors de l'upload");
        }
        setUploadingHero(false);
    };

    const handleLogoUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Veuillez sélectionner une image');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image trop lourde (max 5 MB)');
            return;
        }

        setUploadingLogo(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Upload error');

            const url = data.url;
            setLogoPreview(url);
            const success = await updateSettings({ logoImage: url } as any);
            if (success) {
                toast.success('Logo mis à jour');
            } else {
                toast.success('Logo uploadé (sera synchronisé au prochain chargement)');
            }
        } catch (err: any) {
            toast.error(err.message || "Erreur lors de l'upload du logo");
        }
        setUploadingLogo(false);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) { toast.error('Le mot de passe doit contenir au moins 6 caractères'); return; }
        if (newPassword !== confirmPassword) { toast.error('Les mots de passe ne correspondent pas'); return; }
        setSaving(true);
        try {
            const res = await fetch('/api/admin/auth', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erreur');
            toast.success('Mot de passe modifié avec succès');
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        } catch (err: any) {
            toast.error(err.message || 'Erreur');
        }
        setSaving(false);
    };

    const inputClass = "mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all";

    const CardHeader = ({ icon: Icon, color, title, desc }: { icon: any; color: string; title: string; desc: string }) => (
        <div className="px-5 py-4 sm:px-6 border-b border-gray-100 bg-gray-50/80">
            <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}><Icon size={18} /></div>
                <div>
                    <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-10 lg:px-12 max-w-5xl mx-auto pb-24">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Paramètres</h1>
                <p className="text-sm text-gray-500 mt-1">Gérez les préférences de votre boutique.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Sidebar Tabs */}
                <div className="lg:w-52 shrink-0">
                    <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 lg:sticky lg:top-6">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm whitespace-nowrap transition-colors ${activeTab === tab.key
                                    ? 'bg-amber-50 text-amber-700 font-semibold'
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 font-medium'
                                    }`}
                            >
                                <tab.icon size={16} className={activeTab === tab.key ? 'text-amber-500' : 'text-gray-400'} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">

                    {/* ==================== GÉNÉRAL ==================== */}
                    {activeTab === 'general' && (
                        <form onSubmit={handleSaveGeneral} className="space-y-6">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <CardHeader icon={Store} color="bg-amber-100 text-amber-600" title="Informations de la boutique" desc="Détails publics affichés aux clients." />
                                <div className="px-5 py-5 sm:px-6 sm:py-6 space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Nom de la boutique</label>
                                            <input type="text" value={formState.storeName} onChange={(e) => setFormState({ ...formState, storeName: e.target.value })} placeholder="High Tech Sport" className={inputClass} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Email de contact</label>
                                            <input type="email" value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} placeholder="contact@hightechsport.dz" className={inputClass} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Téléphone (WhatsApp)</label>
                                        <input type="tel" value={formState.phone} onChange={(e) => setFormState({ ...formState, phone: e.target.value })} placeholder="+213 555 55 55 55" className={inputClass} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Adresse physique</label>
                                        <textarea value={formState.address} onChange={(e) => setFormState({ ...formState, address: e.target.value })} placeholder="Centre-ville, Khemis Miliana" rows={2} className={inputClass + ' resize-none'} />
                                    </div>
                                    <div className="h-px bg-gray-100 my-2" />
                                    <div>
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                                            <label className="block text-xs font-medium text-gray-700">Message publicitaire (Bandeau haut)</label>
                                            <div className="flex items-center gap-2 self-start sm:self-auto">
                                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">{announcementActive ? 'Visible' : 'Masqué'}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setAnnouncementActive(!announcementActive)}
                                                    className={`w-9 h-5 rounded-full relative transition-colors ${announcementActive ? 'bg-amber-500' : 'bg-gray-300'}`}
                                                >
                                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${announcementActive ? 'right-0.5' : 'left-0.5'}`} />
                                                </button>
                                            </div>
                                        </div>
                                        <input type="text" value={formState.announcementText} onChange={(e) => setFormState({ ...formState, announcementText: e.target.value })} placeholder="ex: 🚚 Livraison 58 wilayas" className={inputClass} disabled={!announcementActive} />
                                    </div>
                                </div>
                            </div>

                            {/* Hero Image */}
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <CardHeader icon={ImageIcon} color="bg-purple-100 text-purple-600" title="Image Hero & Logo" desc="Gérez l'apparence visuelle principale de votre boutique." />
                                <div className="px-5 py-5 sm:px-6 sm:py-6 space-y-8">

                                    {/* Logo Section */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-3">Logo de la boutique</label>
                                        <div className="flex items-start gap-6">
                                            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200 shrink-0 group">
                                                {logoPreview ? (
                                                    <Image src={logoPreview} alt="Logo" fill className="object-contain p-2" sizes="96px" />
                                                ) : (
                                                    <Store size={32} className="text-gray-300" />
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center cursor-pointer" onClick={() => logoInputRef.current?.click()}>
                                                    {uploadingLogo && <Loader2 size={24} className="animate-spin text-amber-500" />}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleLogoUpload(e.target.files[0]); }} />
                                                <button type="button" onClick={() => logoInputRef.current?.click()} disabled={uploadingLogo} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                                                    <Upload size={16} /> Changer le logo
                                                </button>
                                                <p className="text-xs text-gray-500 mt-2">Format carré recommandé. Fond transparent de préférence (PNG, SVG). Max 5 MB.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px bg-gray-100 w-full" />

                                    {/* Hero Banner Section */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-3">Bannière Hero (Page d'accueil)</label>
                                        <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                                            {heroPreview && (
                                                <Image src={heroPreview} alt="Hero preview" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 800px" />
                                            )}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => heroInputRef.current?.click()}
                                                    disabled={uploadingHero}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg text-sm font-semibold text-gray-900 shadow-lg hover:bg-gray-50 disabled:opacity-50"
                                                >
                                                    {uploadingHero ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                                    {uploadingHero ? 'Upload en cours...' : 'Changer l\'image'}
                                                </button>
                                            </div>
                                        </div>
                                        <input
                                            ref={heroInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => { if (e.target.files?.[0]) handleHeroUpload(e.target.files[0]); }}
                                        />
                                        <p className="text-xs text-gray-500 mt-2.5">Recommandé : 1920×1080 ou plus. JPG, PNG, WebP. Max 10 MB.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 disabled:opacity-50 transition-colors">
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Sauvegarder
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ==================== LIVRAISON ==================== */}
                    {activeTab === 'shipping' && (
                        <div className="space-y-6">
                            <form onSubmit={handleSaveGeneral} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <CardHeader icon={Truck} color="bg-amber-100 text-amber-600" title="Intégration Yalidine" desc="Configurez l'API de livraison Yalidine." />
                                <div className="px-5 py-5 sm:px-6 sm:py-6 space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">API ID</label>
                                            <input type="text" value={formState.apiId} onChange={(e) => setFormState({ ...formState, apiId: e.target.value })} placeholder="Votre API ID" className={inputClass} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">API Token</label>
                                            <input type="password" value={formState.apiToken} onChange={(e) => setFormState({ ...formState, apiToken: e.target.value })} placeholder="Votre API Token" className={inputClass} />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-gray-400">Obtenez vos identifiants sur <a href="https://yalidine.com" target="_blank" className="text-amber-600 hover:underline">yalidine.com</a></p>
                                        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 disabled:opacity-50">
                                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                            Sauvegarder l'API
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col max-h-[600px]">
                                <CardHeader icon={Truck} color="bg-blue-100 text-blue-600" title="Tarifs de livraison" desc="Modifiez les tarifs de livraison par wilaya. (DA)" />

                                <div className="p-0 overflow-auto flex-1 bg-gray-50/30">
                                    {loadingShipping ? (
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <Loader2 size={32} className="animate-spin text-amber-500 mb-3" />
                                            <p className="text-sm text-gray-500">Chargement des tarifs...</p>
                                        </div>
                                    ) : (
                                        <table className="w-full text-left text-sm whitespace-nowrap">
                                            <thead className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
                                                <tr>
                                                    <th className="px-4 py-3 font-semibold text-gray-700">Wilaya</th>
                                                    <th className="px-4 py-3 font-semibold text-gray-700 text-right w-32">À domicile (DA)</th>
                                                    <th className="px-4 py-3 font-semibold text-gray-700 text-right w-32">En point relais (DA)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {shippingRates.map((rate, index) => (
                                                    <tr key={rate.wilaya_code} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-4 py-2.5 font-medium text-gray-900">
                                                            <span className="text-gray-400 font-mono text-xs mr-2">{rate.wilaya_code.toString().padStart(2, '0')}</span>
                                                            {rate.wilaya_name}
                                                        </td>
                                                        <td className="px-4 py-2.5 text-right">
                                                            <input
                                                                type="number"
                                                                value={rate.home_price}
                                                                onChange={(e) => {
                                                                    const newRates = [...shippingRates];
                                                                    newRates[index].home_price = parseInt(e.target.value) || 0;
                                                                    setShippingRates(newRates);
                                                                }}
                                                                className="w-24 text-right px-2 py-1 rounded border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-sm"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2.5 text-right">
                                                            <input
                                                                type="number"
                                                                value={rate.desk_price}
                                                                onChange={(e) => {
                                                                    const newRates = [...shippingRates];
                                                                    newRates[index].desk_price = parseInt(e.target.value) || 0;
                                                                    setShippingRates(newRates);
                                                                }}
                                                                className="w-24 text-right px-2 py-1 rounded border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-sm"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>

                                <div className="px-5 py-4 border-t border-gray-100 bg-white flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleSaveShippingRates}
                                        disabled={saving || loadingShipping}
                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                        Sauvegarder les tarifs
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ==================== PAIEMENTS ==================== */}
                    {activeTab === 'payments' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <CardHeader icon={Wallet} color="bg-blue-100 text-blue-600" title="Méthodes de paiement" desc="Configurez comment vous êtes payé." />
                                <div className="px-5 py-5 sm:px-6 sm:py-6 space-y-3">
                                    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg border ${codEnabled ? 'border-green-200 bg-green-50/60' : 'border-gray-200 bg-gray-50/60'}`}>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2.5">
                                                <span className="text-sm font-semibold text-gray-900">Paiement à la livraison (COD)</span>
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold border ${codEnabled ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                                    {codEnabled ? 'Actif' : 'Inactif'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Les clients paient en espèces à la réception.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setCodEnabled(!codEnabled)}
                                            className={`w-11 h-6 rounded-full relative transition-colors shrink-0 sm:ml-4 self-start sm:self-auto ${codEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
                                        >
                                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${codEnabled ? 'right-0.5' : 'left-0.5'}`} />
                                        </button>
                                    </div>

                                    {codEnabled && (
                                        <div className="pl-4 border-l-2 border-green-200 ml-2">
                                            <label className="block text-xs font-medium text-gray-700">Frais COD supplémentaires (DA)</label>
                                            <input type="number" value={codFee} onChange={(e) => setCodFee(e.target.value)} min={0} placeholder="0" className={inputClass + ' max-w-[200px]'} />
                                            <p className="text-xs text-gray-400 mt-1">Laissez 0 pour aucun frais supplémentaire.</p>
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50/60 opacity-50">
                                        <div>
                                            <span className="text-sm font-semibold text-gray-900">CIB / Edahabia</span>
                                            <p className="text-xs text-gray-500 mt-1">Paiement en ligne par carte. <span className="text-amber-600 font-medium whitespace-nowrap">Bientôt disponible</span></p>
                                        </div>
                                        <div className="w-11 h-6 bg-gray-300 rounded-full relative cursor-not-allowed shrink-0 sm:ml-4 self-start sm:self-auto">
                                            <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ==================== SÉCURITÉ ==================== */}
                    {activeTab === 'security' && (
                        <form onSubmit={handleChangePassword} className="space-y-6">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <CardHeader icon={Shield} color="bg-purple-100 text-purple-600" title="Mot de passe administrateur" desc="Changez le mot de passe d'accès au tableau de bord." />
                                <div className="px-5 py-5 sm:px-6 sm:py-6 space-y-5">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Mot de passe actuel</label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords ? 'text' : 'password'}
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                required
                                                className={inputClass + ' pr-10'}
                                            />
                                            <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 mt-0.5">
                                                {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Nouveau mot de passe</label>
                                            <input type={showPasswords ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} className={inputClass} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Confirmer</label>
                                            <input type={showPasswords ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} className={inputClass} />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400">Minimum 6 caractères.</p>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 disabled:opacity-50 transition-colors">
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                    Modifier le mot de passe
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
