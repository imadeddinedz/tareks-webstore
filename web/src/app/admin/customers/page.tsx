'use client';

import { useState, useEffect } from 'react';
import { Search, UserX, User, Phone, MapPin } from 'lucide-react';
import { getCustomers, updateCustomerBlacklist, type Customer } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showBlacklisted, setShowBlacklisted] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    async function fetchCustomers() {
        setLoading(true);
        const data = await getCustomers();
        setCustomers(data);
        setLoading(false);
    }

    const handleToggleBlacklist = async (customer: Customer) => {
        const newStatus = !customer.is_blacklisted;
        const toastId = toast.loading(newStatus ? 'Blocage en cours...' : 'Déblocage en cours...');

        const success = await updateCustomerBlacklist(customer.id, newStatus);

        if (success) {
            toast.success(newStatus ? 'Client bloqué' : 'Client débloqué', { id: toastId });
            setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, is_blacklisted: newStatus } : c));
        } else {
            toast.error('Erreur lors de la mise à jour', { id: toastId });
        }
    };

    const filtered = customers.filter((c) => {
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
        const matchBlacklist = showBlacklisted ? c.is_blacklisted : true;
        return matchSearch && matchBlacklist;
    });

    return (
        <div className="px-6 py-8 md:px-10 md:py-10 lg:px-12 max-w-5xl mx-auto pb-24">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Clients ({filtered.length})
                </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou téléphone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
                    />
                </div>
                <button
                    className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium shadow-sm transition-all border ${showBlacklisted
                        ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    onClick={() => setShowBlacklisted(!showBlacklisted)}
                >
                    <UserX size={14} /> Liste noire
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm relative min-h-[300px]">
                {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 rounded-2xl">
                        <div className="w-10 h-10 border-4 border-gray-100 border-t-[#F59E0B] rounded-full animate-spin mb-4" />
                        <p className="text-gray-500 font-bold">Chargement des clients...</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filtered.map((customer) => (
                            <div key={customer.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-5 hover:bg-gray-50 transition-colors group">
                                <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${customer.is_blacklisted ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'
                                    }`}>
                                    {customer.is_blacklisted ? <UserX size={20} /> : <User size={20} />}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3">
                                        <p className="font-bold text-gray-900 text-lg">{customer.name}</p>
                                        {customer.is_blacklisted && (
                                            <span className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-600 font-bold border border-red-100">
                                                Bloqué
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-4 mt-2 text-sm font-medium text-gray-500 flex-wrap">
                                        <span className="flex items-center gap-1.5"><Phone size={14} className="text-gray-400" /> {customer.phone}</span>
                                        {customer.wilaya && <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-400" /> {customer.wilaya}</span>}
                                        <span className="text-gray-400 p-0 hidden sm:block">•</span>
                                        <span>{customer.order_count} commande{customer.order_count > 1 ? 's' : ''}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleToggleBlacklist(customer)}
                                    className={`flex-shrink-0 rounded-md px-4 py-2 text-xs font-semibold transition-all border shadow-sm ${customer.is_blacklisted
                                        ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                        : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-500 hover:text-white hover:border-red-500'
                                        }`}>
                                    {customer.is_blacklisted ? 'Débloquer' : 'Bloquer'}
                                </button>
                            </div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="p-16 text-center text-gray-400 flex flex-col items-center">
                                <User size={48} className="mb-4 text-gray-300" />
                                <p className="text-lg font-bold text-gray-500">Aucun client trouvé.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
