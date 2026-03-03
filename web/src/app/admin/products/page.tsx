'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getProducts, getCategories, deleteProduct } from '@/lib/products';
import type { Product } from '@/lib/data';
import { formatPrice } from '@/lib/products';
import { ProductForm } from '@/components/ProductForm';
import toast from 'react-hot-toast';
import { Package, Plus, Search, Edit2, Trash2, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
    setProducts(prods);
    setCategories(cats);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.')) return;

    const toastId = toast.loading('Suppression en cours...');
    const result = await deleteProduct(id);

    if (result) {
      toast.success('Produit supprimé', { id: toastId });
      fetchData();
    } else {
      toast.error('Erreur lors de la suppression', { id: toastId });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10 lg:px-12 w-full min-w-0 max-w-[1600px] mx-auto pb-24 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Catalogue Produits</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez votre inventaire, les prix et les variantes de vos articles.</p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 transition-colors"
        >
          <Plus size={16} />
          Nouveau Produit
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
          />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-9 pr-8 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm appearance-none cursor-pointer focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm relative min-h-[400px] w-full min-w-0 max-w-full">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 rounded-lg">
            <div className="w-8 h-8 border-[3px] border-gray-200 border-t-amber-500 rounded-full animate-spin mb-3" />
            <p className="text-sm text-gray-500 font-medium">Chargement du catalogue...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-center px-6">
            <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-6 shadow-inner border border-gray-100">
              <Package size={40} />
            </div>
            <h3 className="font-heading font-bold text-2xl text-gray-900 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-500 font-medium mb-6">Ajoutez votre premier produit au catalogue ou modifiez vos critères de recherche.</p>
            <button onClick={handleAdd} className="px-6 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm text-gray-700 font-bold hover:bg-gray-50 transition-colors">
              Créer un produit
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-sm font-bold uppercase tracking-wider bg-gray-50">
                  <th className="px-4 sm:px-6 py-5 first:pl-6 sm:first:pl-8">Produit</th>
                  <th className="px-4 sm:px-6 py-5 hidden md:table-cell">Catégorie</th>
                  <th className="px-4 sm:px-6 py-5 text-right">Prix</th>
                  <th className="px-4 sm:px-6 py-5 text-center hidden sm:table-cell">Stock</th>
                  <th className="px-4 sm:px-6 py-5 text-center">Statut</th>
                  <th className="px-4 sm:px-6 py-5 text-right last:pr-6 sm:last:pr-8">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 sm:px-6 py-4 first:pl-4 sm:first:pl-8 flex items-center gap-3 sm:gap-5">
                      <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden shrink-0 shadow-sm hidden sm:block">
                        <Image src={product.images[0] || '/images/placeholder.webp'} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900 truncate max-w-[120px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-[250px] xl:max-w-[300px] group-hover:text-amber-600 transition-colors" title={product.name ?? undefined}>{product.name}</div>
                        <div className="text-xs font-medium text-gray-500 mt-1 truncate max-w-[120px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-[250px] xl:max-w-[300px]" title={product.description ?? undefined}>{product.description}</div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                      <span className="px-3 sm:px-4 py-1.5 rounded-full bg-gray-50 text-gray-600 text-[10px] sm:text-xs font-bold border border-gray-200">
                        {product.category?.name || 'Non défini'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="font-black text-gray-900 text-sm sm:text-lg">{formatPrice(product.price)}</div>
                      {product.old_price && <div className="text-[10px] sm:text-xs font-bold text-gray-400 line-through mt-0.5">{formatPrice(product.old_price)}</div>}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center hidden sm:table-cell">
                      <span className={cn("font-bold text-lg", product.stock > 10 ? "text-green-600" : product.stock > 0 ? "text-amber-500" : "text-red-500")}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      {product.stock > 0 ? (
                        <span className="inline-flex px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-wider bg-green-50 text-green-700 border border-green-200">En ligne</span>
                      ) : (
                        <span className="inline-flex px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-200">Rupture</span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right last:pr-4 sm:last:pr-8">
                      <div className="flex items-center justify-end gap-1 sm:gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 shadow-sm transition-all"
                          aria-label="Modifier"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 shadow-sm transition-all"
                          aria-label="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col z-10 overflow-hidden ring-1 ring-gray-200"
            >
              <div className="px-5 py-4 sm:px-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/80">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {editingProduct ? 'Mettez à jour les informations du produit.' : 'Ajoutez un nouvel article au catalogue.'}
                  </p>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors shrink-0 ml-4"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 sm:p-6 overflow-y-auto" style={{ scrollbarGutter: 'stable' }}>
                <ProductForm
                  product={editingProduct}
                  categories={categories}
                  onClose={() => setIsFormOpen(false)}
                  onSuccess={() => {
                    setIsFormOpen(false);
                    fetchData();
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
