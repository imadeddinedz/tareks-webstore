'use client';

import { useState } from 'react';
import { WILAYAS } from '@/lib/wilayas';
import { formatPrice } from '@/lib/products';
import { Search, Save, Truck } from 'lucide-react';

export default function AdminShippingPage() {
    const [search, setSearch] = useState('');
    const [rates, setRates] = useState(WILAYAS.map((w) => ({ ...w })));

    const filtered = rates.filter((w) =>
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.code.toString().includes(search)
    );

    return (
        <div className="p-6 md:p-10 max-w-[1200px] mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="font-heading font-black text-3xl md:text-4xl text-gray-900 mb-2 tracking-tight flex items-center gap-3">
                        <Truck size={32} className="text-[#F59E0B]" />
                        Tarifs de livraison
                    </h1>
                    <p className="text-gray-500 font-medium">Modifiez les tarifs de livraison pour chaque wilaya (en DA).</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-[#F59E0B] text-white rounded-xl font-bold hover:bg-[#D97706] shadow-sm transition-all active:scale-[0.98]">
                    <Save size={20} /> Sauvegarder
                </button>
            </div>

            <div className="relative mb-6 max-w-md">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Rechercher une wilaya..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-gray-200 focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] outline-none transition-all text-sm text-gray-900 shadow-sm font-medium placeholder:text-gray-400"
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                {/* Header */}
                <div className="grid grid-cols-[60px_1fr_120px_120px_80px] gap-4 px-6 py-5 border-b border-gray-100 uppercase tracking-wider text-xs font-bold text-gray-500 bg-gray-50">
                    <span>Code</span>
                    <span>Wilaya</span>
                    <span>Bureau (DA)</span>
                    <span>Domicile (DA)</span>
                    <span>Délai</span>
                </div>

                <div className="divide-y divide-gray-100">
                    {filtered.map((w, i) => (
                        <div key={w.code} className="grid grid-cols-[60px_1fr_120px_120px_80px] gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                            <span className="text-gray-400 font-bold">
                                {w.code.toString().padStart(2, '0')}
                            </span>
                            <span className="font-bold text-gray-900">{w.name}</span>
                            <input
                                type="number"
                                value={w.deskPrice}
                                onChange={(e) => {
                                    const updated = [...rates];
                                    const idx = updated.findIndex((r) => r.code === w.code);
                                    updated[idx] = { ...updated[idx], deskPrice: parseInt(e.target.value) || 0 };
                                    setRates(updated);
                                }}
                                className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] outline-none transition-all text-gray-900 text-sm font-medium shadow-sm"
                            />
                            <input
                                type="number"
                                value={w.homePrice}
                                onChange={(e) => {
                                    const updated = [...rates];
                                    const idx = updated.findIndex((r) => r.code === w.code);
                                    updated[idx] = { ...updated[idx], homePrice: parseInt(e.target.value) || 0 };
                                    setRates(updated);
                                }}
                                className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] outline-none transition-all text-gray-900 text-sm font-medium shadow-sm"
                            />
                            <span className="text-gray-500 font-medium text-sm">
                                {w.estimatedDays}j
                            </span>
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div className="p-16 text-center text-gray-500 font-bold">
                            Aucune wilaya trouvée.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
