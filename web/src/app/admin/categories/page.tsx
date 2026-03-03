'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, FolderOpen, GripVertical, Loader2, X, Upload, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    position: number;
    is_active: boolean;
    product_count?: number;
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const [saving, setSaving] = useState(false);

    // Form
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [imagePreview, setImagePreview] = useState('');

    // Image Upload
    const [uploadingImage, setUploadingImage] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { fetchCategories(); }, []);

    async function fetchCategories() {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch { }
        setLoading(false);
    }

    function openCreate() {
        setEditing(null);
        setName(''); setSlug(''); setDescription(''); setIsActive(true); setImagePreview('');
        setIsModalOpen(true);
    }

    function openEdit(cat: Category) {
        setEditing(cat);
        setName(cat.name); setSlug(cat.slug);
        setDescription(cat.description || ''); setIsActive(cat.is_active);
        setImagePreview(cat.image || '');
        setIsModalOpen(true);
    }

    async function handleImageUpload(file: File) {
        if (!file.type.startsWith('image/')) { toast.error('Veuillez sélectionner une image'); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error('Image trop lourde (max 5 MB)'); return; }

        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erreur upload');

            setImagePreview(data.url);
            toast.success('Image importée');
        } catch (err: any) {
            toast.error(err.message || 'Erreur');
        }
        setUploadingImage(false);
    }

    function autoSlug(val: string) {
        setName(val);
        if (!editing) {
            setSlug(val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name || !slug) return;
        setSaving(true);

        try {
            const url = editing ? `/api/admin/categories/${editing.id}` : '/api/admin/categories';
            const res = await fetch(url, {
                method: editing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, slug, description: description || null, is_active: isActive, image: imagePreview || null }),
            });
            if (!res.ok) {
                const d = await res.json().catch(() => ({}));
                throw new Error(d.error || 'Erreur');
            }
            toast.success(editing ? 'Catégorie modifiée' : 'Catégorie créée');
            setIsModalOpen(false);
            fetchCategories();
        } catch (err: any) {
            toast.error(err.message);
        }
        setSaving(false);
    }

    async function handleDelete(id: string) {
        if (!window.confirm('Supprimer cette catégorie ? Les produits associés ne seront pas supprimés.')) return;
        const tid = toast.loading('Suppression...');
        try {
            const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
            toast.success('Catégorie supprimée', { id: tid });
            fetchCategories();
        } catch {
            toast.error('Erreur', { id: tid });
        }
    }

    const inputClass = "mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all";

    return (
        <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-10 lg:px-12 max-w-5xl mx-auto pb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Catégories</h1>
                    <p className="text-sm text-gray-500 mt-1">Organisez vos produits par catégorie.</p>
                </div>
                <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 transition-colors">
                    <Plus size={16} /> Nouvelle catégorie
                </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden relative min-h-[200px]">
                {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                        <div className="w-8 h-8 border-[3px] border-gray-200 border-t-amber-500 rounded-full animate-spin mb-3" />
                        <p className="text-sm text-gray-500 font-medium">Chargement...</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                        <FolderOpen size={40} className="text-gray-300 mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Aucune catégorie</h3>
                        <p className="text-sm text-gray-500 max-w-sm">Créez votre première catégorie pour organiser vos produits.</p>
                        <button onClick={openCreate} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-amber-500 hover:text-amber-600 shadow-sm transition-all">
                            <Plus size={16} /> Créer une catégorie
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {categories.map((cat) => (
                            <div key={cat.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors group">
                                <div className="hidden sm:flex self-start sm:self-auto">
                                    <GripVertical size={16} className="text-gray-300 cursor-grab shrink-0" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3">
                                        {cat.image && (
                                            <div className="relative w-8 h-8 rounded-md overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                                                <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="32px" />
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2.5">
                                            <span className="font-semibold text-sm text-gray-900">{cat.name}</span>
                                            {!cat.is_active && (
                                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-500 font-bold uppercase">Masquée</span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-0.5">/{cat.slug} • {cat.product_count || 0} produit(s)</p>
                                </div>
                                <div className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity self-end sm:self-auto w-full sm:w-auto justify-end sm:justify-start">
                                    <button onClick={() => openEdit(cat)} className="flex-1 sm:flex-none p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 shadow-sm transition-all flex items-center justify-center" title="Modifier">
                                        <Edit2 size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(cat.id)} className="flex-1 sm:flex-none p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 shadow-sm transition-all flex items-center justify-center" title="Supprimer">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-xl shadow-2xl w-full max-w-md z-10 overflow-hidden ring-1 ring-gray-200"
                        >
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">{editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h2>
                                    <p className="text-xs text-gray-500 mt-0.5">{editing ? 'Modifiez les informations.' : 'Ajoutez une catégorie pour vos produits.'}</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"><X size={16} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-5 space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">Nom</label>
                                    <input type="text" value={name} onChange={(e) => autoSlug(e.target.value)} required placeholder="Ex: Montres Connectées" className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">Slug (URL)</label>
                                    <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="montres-connectees" className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">Description</label>
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Description optionnelle..." className={inputClass + ' resize-none'} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-2">Image de la catégorie</label>
                                    <div className="flex items-start gap-4">
                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200 shrink-0 group">
                                            {imagePreview ? (
                                                <Image src={imagePreview} alt="Preview" fill className="object-cover" sizes="64px" />
                                            ) : (
                                                <ImageIcon size={20} className="text-gray-300" />
                                            )}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center cursor-pointer" onClick={() => imageInputRef.current?.click()}>
                                                {uploadingImage && <Loader2 size={16} className="animate-spin text-amber-500" />}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); }} />
                                            <button type="button" onClick={() => imageInputRef.current?.click()} disabled={uploadingImage} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                                                <Upload size={14} /> Importer une image
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button type="button" onClick={() => setIsActive(!isActive)} className={`w-10 h-5.5 rounded-full relative transition-colors ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                                        <div className={`w-4.5 h-4.5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${isActive ? 'right-0.5' : 'left-0.5'}`} />
                                    </button>
                                    <span className="text-sm text-gray-700 font-medium">Catégorie visible</span>
                                </div>
                                <div className="pt-2 flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">Annuler</button>
                                    <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 disabled:opacity-50 transition-colors">
                                        {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                                        {editing ? 'Sauvegarder' : 'Créer'}
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
