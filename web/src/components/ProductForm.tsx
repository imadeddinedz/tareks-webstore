'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X, ImagePlus, Loader2, Star, StarOff } from 'lucide-react';

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    old_price?: number | null;
    stock?: number;
    sku?: string;
    status?: string;
    is_featured?: boolean;
    tags?: string[];
    images: string[];
    category_id?: string | null;
  };
  categories?: { id: string; name: string }[];
  onClose?: () => void;
  onSuccess?: () => void;
}

export function ProductForm({ product, categories, onClose, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product?.price?.toString() ?? '');
  const [oldPrice, setOldPrice] = useState(product?.old_price?.toString() ?? '');
  const [stock, setStock] = useState(product?.stock?.toString() ?? '0');
  const [sku, setSku] = useState(product?.sku ?? '');
  const [status, setStatus] = useState(product?.status ?? 'published');
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [tagsStr, setTagsStr] = useState(product?.tags?.join(', ') ?? '');
  const [categoryId, setCategoryId] = useState(product?.category_id ?? '');
  const [imageUrls, setImageUrls] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const slug =
    product?.slug ||
    name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      return data.url;
    } catch (err: any) {
      setError(err.message || 'Erreur lors du téléchargement');
      return null;
    }
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;
    setUploading(true);
    setError('');
    const results = await Promise.all(fileArray.map(uploadFile));
    const successfulUrls = results.filter((url): url is string => url !== null);
    if (successfulUrls.length > 0) setImageUrls(prev => [...prev, ...successfulUrls]);
    setUploading(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeImage = (index: number) => setImageUrls(prev => prev.filter((_, i) => i !== index));
  const moveImage = (from: number, to: number) => {
    setImageUrls(prev => {
      const next = [...prev]; const [item] = next.splice(from, 1); next.splice(to, 0, item); return next;
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

    const res = await fetch(
      product ? `/api/admin/products/${product.id}` : '/api/admin/products',
      {
        method: product ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug: slug || name,
          description: description || null,
          price: parseInt(price, 10) || 0,
          old_price: oldPrice ? parseInt(oldPrice, 10) : null,
          stock: parseInt(stock, 10) || 0,
          sku: sku || null,
          status,
          is_featured: isFeatured,
          tags,
          images: imageUrls,
          category_id: categoryId || null,
        }),
      }
    );
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Erreur');
      setLoading(false);
      return;
    }
    if (onSuccess) { onSuccess(); } else { router.push('/admin/products'); router.refresh(); }
  }

  const inputClass = "block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Nom du produit</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ex: Montre Sport Pro X200" className={inputClass} />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Décrivez les caractéristiques..." className={inputClass + ' resize-none'} />
      </div>

      {/* Price + Old Price + Stock */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Prix (DA)</label>
          <div className="relative">
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min={0} placeholder="0" className={inputClass + ' pr-10'} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">DA</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Ancien prix</label>
          <div className="relative">
            <input type="number" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} min={0} placeholder="—" className={inputClass + ' pr-10'} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">DA</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Stock</label>
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} min={0} placeholder="0" className={inputClass} />
        </div>
      </div>

      {/* Category + Status */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Catégorie</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputClass + ' appearance-none cursor-pointer'}>
            <option value="">Aucune</option>
            {categories?.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Statut</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass + ' appearance-none cursor-pointer'}>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
            <option value="hidden">Masqué</option>
          </select>
        </div>
      </div>

      {/* SKU + Tags */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">SKU (référence)</label>
          <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="HTS-001" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Tags (séparés par virgules)</label>
          <input type="text" value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} placeholder="sport, montre, promo" className={inputClass} />
        </div>
      </div>

      {/* Featured toggle */}
      <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50/50">
        <button
          type="button"
          onClick={() => setIsFeatured(!isFeatured)}
          className={`p-1.5 rounded-lg transition-colors ${isFeatured ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}
        >
          {isFeatured ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
        </button>
        <div>
          <p className="text-sm font-medium text-gray-900">Produit vedette</p>
          <p className="text-xs text-gray-400">Affiché en priorité sur la page d'accueil.</p>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
          Images {imageUrls.length > 0 && <span className="text-gray-400">({imageUrls.length})</span>}
        </label>
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-3">
            {imageUrls.map((url, index) => (
              <div key={url + index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <Image src={url} alt={`Image ${index + 1}`} fill className="object-cover" sizes="120px" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  {index > 0 && (
                    <button type="button" onClick={() => moveImage(index, index - 1)} className="w-7 h-7 rounded-md bg-white/90 text-gray-700 flex items-center justify-center hover:bg-white text-xs font-bold shadow-sm">←</button>
                  )}
                  <button type="button" onClick={() => removeImage(index)} className="w-7 h-7 rounded-md bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow-sm"><X size={14} /></button>
                  {index < imageUrls.length - 1 && (
                    <button type="button" onClick={() => moveImage(index, index + 1)} className="w-7 h-7 rounded-md bg-white/90 text-gray-700 flex items-center justify-center hover:bg-white text-xs font-bold shadow-sm">→</button>
                  )}
                </div>
                {index === 0 && (
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-white shadow-sm">PRINCIPALE</div>
                )}
              </div>
            ))}
          </div>
        )}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-lg border-2 border-dashed transition-all cursor-pointer ${dragOver ? 'border-amber-500 bg-amber-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'} ${uploading ? 'pointer-events-none opacity-60' : ''}`}
        >
          <div className="flex flex-col items-center justify-center py-6 px-4">
            {uploading ? (
              <>
                <Loader2 size={24} className="text-amber-500 animate-spin mb-2" />
                <p className="text-sm font-medium text-gray-600">Téléchargement...</p>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center mb-2 shadow-sm">
                  <ImagePlus size={20} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-700">Glissez vos images ici</p>
                <p className="text-xs text-gray-400 mt-1">ou <span className="text-amber-600 font-medium">cliquez pour choisir</span> • Max 5MB</p>
              </>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = ''; }} />
        </div>
      </div>

      {error && <p className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

      <div className="pt-2 flex items-center justify-end gap-3">
        {onClose && (
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">Annuler</button>
        )}
        <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 disabled:opacity-50 transition-colors">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Enregistrement...</> : product ? 'Sauvegarder' : 'Ajouter le produit'}
        </button>
      </div>
    </form>
  );
}
