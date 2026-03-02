'use client';

import { useState, useEffect } from 'react';
import { Shield, Wallet, Store, Save, Truck, Eye, EyeOff, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettingsStore } from '@/store/settings';

type TabKey = 'general' | 'shipping' | 'payments' | 'security';

const TABS: { key: TabKey; label: string; icon: any }[] = [
    { key: 'general', label: 'Général', icon: Store },
    { key: 'shipping', label: 'Livraison', icon: Truck },
    { key: 'payments', label: 'Paiements', icon: Wallet },
    { key: 'security', label: 'Sécurité', icon: Shield },
];

export default function AdminSettings() {
    const { storeName, storeEmail, storePhone, storeAddress, yalidineApiId, yalidineApiToken, updateSettings } = useSettingsStore();
    const [activeTab, setActiveTab] = useState<TabKey>('general');
    const [saving, setSaving] = useState(false);

    // General
    const [formState, setFormState] = useState({
        storeName: '', email: '', phone: '', address: '',
        apiId: '', apiToken: '',
    });

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
        });
    }, [storeName, storeEmail, storePhone, storeAddress, yalidineApiId, yalidineApiToken]);

    const handleSaveGeneral = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const success = await updateSettings({
            storeName: formState.storeName, storeEmail: formState.email,
            storePhone: formState.phone, storeAddress: formState.address,
            yalidineApiId: formState.apiId, yalidineApiToken: formState.apiToken,
        });
        setSaving(false);
        success ? toast.success('Paramètres sauvegardés') : toast.error('Erreur lors de la sauvegarde');
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
        <div className="px-6 py-8 md:px-10 md:py-10 lg:px-12 max-w-5xl mx-auto pb-24">
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
                        <form onSubmit={handleSaveGeneral} className="space-y-6">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
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
                                    <p className="text-xs text-gray-400">Obtenez vos identifiants sur <a href="https://yalidine.com" target="_blank" className="text-amber-600 hover:underline">yalidine.com</a></p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <CardHeader icon={Truck} color="bg-blue-100 text-blue-600" title="Tarifs de livraison" desc="Les tarifs par wilaya sont gérés dans la base de données." />
                                <div className="px-5 py-5 sm:px-6 sm:py-6">
                                    <p className="text-sm text-gray-600">Les tarifs de livraison sont configurés automatiquement pour les 58 wilayas algériennes. Vous pouvez les modifier directement depuis le panneau Supabase.</p>
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

                    {/* ==================== PAIEMENTS ==================== */}
                    {activeTab === 'payments' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <CardHeader icon={Wallet} color="bg-blue-100 text-blue-600" title="Méthodes de paiement" desc="Configurez comment vous êtes payé." />
                                <div className="px-5 py-5 sm:px-6 sm:py-6 space-y-3">
                                    <div className={`flex items-center justify-between p-4 rounded-lg border ${codEnabled ? 'border-green-200 bg-green-50/60' : 'border-gray-200 bg-gray-50/60'}`}>
                                        <div>
                                            <div className="flex items-center gap-2.5">
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
                                            className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ml-4 ${codEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
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

                                    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50/60 opacity-50">
                                        <div>
                                            <span className="text-sm font-semibold text-gray-900">CIB / Edahabia</span>
                                            <p className="text-xs text-gray-500 mt-1">Paiement en ligne par carte. <span className="text-amber-600 font-medium">Bientôt disponible</span></p>
                                        </div>
                                        <div className="w-11 h-6 bg-gray-300 rounded-full relative cursor-not-allowed shrink-0 ml-4">
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
