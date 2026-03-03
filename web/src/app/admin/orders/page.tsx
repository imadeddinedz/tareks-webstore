'use client';

import { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '@/lib/supabase';
import { formatPrice } from '@/lib/products';
import toast from 'react-hot-toast';
import { ShoppingCart, Search, Filter, ChevronDown, PackageCheck, Truck, XCircle, RotateCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_OPTIONS = [
    { value: 'new', label: 'Nouvelle', className: 'status-new border-[#F59E0B]/30', icon: ShoppingCart },
    { value: 'confirmed', label: 'Confirmée', className: 'status-confirmed border-[#3B82F6]/30', icon: PackageCheck },
    { value: 'delivered', label: 'Livrée', className: 'status-delivered border-[#22C55E]/30', icon: PackageCheck },
    { value: 'returned', label: 'Retournée', className: 'status-returned border-[#9494B0]/30', icon: RotateCcw },
    { value: 'cancelled', label: 'Annulée', className: 'status-cancelled border-[#EF4444]/30', icon: XCircle },
];

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        setLoading(true);
        const data = await getOrders();
        setOrders(data);
        setLoading(false);
    }

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        setOpenDropdown(null);
        const toastId = toast.loading('Mise à jour du statut...');

        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Erreur API');

            toast.success('Statut mis à jour', { id: toastId });

            // Auto-send to Yalidine if confirmed
            if (newStatus === 'confirmed') {
                const order = orders.find(o => o.id === orderId);
                if (order) {
                    await handleYalidineSend(order);
                }
            } else {
                fetchOrders();
            }
        } catch (error: any) {
            toast.error(error.message || 'Erreur lors de la mise à jour', { id: toastId });
        }
    };

    const handleYalidineSend = async (order: any) => {
        const toastId = toast.loading('Création du colis Yalidine...');
        try {
            const parcelData = {
                order_id: order.order_number || order.id.slice(0, 8).toUpperCase(),
                firstname: order.customer_name.split(' ')[0] || '',
                familyname: order.customer_name.split(' ').slice(1).join(' ') || 'Client',
                contact_phone: order.customer_phone,
                address: order.customer_address,
                to_commune_name: order.customer_commune,
                to_wilaya_name: order.customer_wilaya,
                product_list: order.items?.map((i: any) => `${i.name} (x${i.quantity})`).join(', ') || 'Produits',
                price: order.total,
                freeshipping: false,
                is_stopdesk: false,
                has_exchange: false
            };

            const res = await fetch('/api/yalidine/create-parcel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parcelData)
            });

            const json = await res.json();

            if (!res.ok || !json.success) throw new Error(json.error || 'Erreur API Yalidine');

            toast.success(`Colis créé avec succès! Tracking: ${json.data?.tracking || 'OK'}`, { id: toastId });

            // Update status internally to shipped or just refresh
            fetchOrders();
        } catch (error: any) {
            toast.error(`Erreur: ${error.message}`, { id: toastId, duration: 5000 });
        }
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch =
            o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
            o.id.toLowerCase().includes(search.toLowerCase()) ||
            o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
            o.customer_phone?.includes(search);

        const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10 lg:px-12 w-full min-w-0 max-w-[1600px] mx-auto pb-24 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestion des Commandes</h1>
                    <p className="text-sm text-gray-500 mt-1">Gérez, filtrez et mettez à jour le statut de toutes vos commandes.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher (ID, Client, Téléphone)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
                    />
                </div>

                <div className="relative">
                    <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="pl-9 pr-8 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm appearance-none cursor-pointer focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
                    >
                        <option value="all">Tous les statuts</option>
                        {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-visible shadow-sm relative min-h-[400px] w-full min-w-0 max-w-full">
                {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 rounded-lg">
                        <div className="w-8 h-8 border-[3px] border-gray-200 border-t-amber-500 rounded-full animate-spin mb-3" />
                        <p className="text-sm text-gray-500 font-medium">Chargement des commandes...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center px-6">
                        <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-6 shadow-inner border border-gray-100">
                            <ShoppingCart size={40} />
                        </div>
                        <h3 className="font-heading font-bold text-2xl text-gray-900 mb-2">Aucune commande trouvée</h3>
                        <p className="text-gray-500 font-medium">Ajustez vos filtres ou attendez de nouvelles commandes.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto pb-48">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-500 text-sm font-bold uppercase tracking-wider bg-gray-50">
                                    <th className="px-4 sm:px-6 py-5 first:pl-6 sm:first:pl-8">Commande</th>
                                    <th className="px-4 sm:px-6 py-5 hidden md:table-cell">Date</th>
                                    <th className="px-4 sm:px-6 py-5">Client</th>
                                    <th className="px-4 sm:px-6 py-5 hidden sm:table-cell">Contact</th>
                                    <th className="px-4 sm:px-6 py-5 text-right">Total</th>
                                    <th className="px-4 sm:px-6 py-5 text-center">Statut</th>
                                    <th className="px-4 sm:px-6 py-5 text-right last:pr-6 sm:last:pr-8">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map((order) => {
                                    const currentStatus = STATUS_OPTIONS.find(s => s.value === order.status) || STATUS_OPTIONS[0];

                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-4 sm:px-6 py-5 first:pl-6 sm:first:pl-8">
                                                <span className="font-mono font-bold text-gray-900 group-hover:text-[var(--brand-dark)] transition-colors">
                                                    #{order.order_number || order.id.slice(0, 8).toUpperCase()}
                                                </span>
                                                <div className="text-sm font-medium text-gray-500 mt-1">{order.items?.length || 0} article(s)</div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-5 text-sm font-bold text-gray-500 hidden md:table-cell">
                                                {formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: fr })}
                                            </td>
                                            <td className="px-4 sm:px-6 py-5">
                                                <div className="font-bold text-gray-900 truncate max-w-[120px] sm:max-w-xs">{order.customer_name}</div>
                                                <div className="text-sm text-gray-500 font-medium mt-1 truncate max-w-[120px] sm:max-w-xs">{order.customer_address}, {order.customer_wilaya}</div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-5 hidden sm:table-cell">
                                                <div className="font-mono font-bold text-sm text-gray-600 truncate max-w-[100px]">{order.customer_phone}</div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-5 text-right">
                                                <span className="font-black text-gray-900 text-sm sm:text-lg">{formatPrice(order.total)}</span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-5 text-center">
                                                <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold border", currentStatus.className)}>
                                                    <currentStatus.icon size={14} className="hidden sm:block" /> {currentStatus.label}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-5 text-right last:pr-6 sm:last:pr-8 relative">
                                                {/* Actions */}
                                                <div className="flex flex-row items-center justify-end gap-2 w-full">
                                                    <button
                                                        onClick={() => handleYalidineSend(order)}
                                                        className="rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white border border-amber-200 hover:border-amber-500 px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                                                        title="Envoyer à Yalidine"
                                                    >
                                                        <Truck size={14} /> Yalidine
                                                    </button>

                                                    {/* Status Dropdown */}
                                                    <div className="inline-block relative">
                                                        <button
                                                            onClick={() => setOpenDropdown(openDropdown === order.id ? null : order.id)}
                                                            className="rounded-lg bg-white hover:bg-gray-50 border border-gray-300 px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5 text-gray-700 shadow-sm"
                                                        >
                                                            Modifier <ChevronDown size={12} />
                                                        </button>

                                                        <AnimatePresence>
                                                            {openDropdown === order.id && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                                    transition={{ duration: 0.15 }}
                                                                    className="absolute right-0 top-full mt-1 w-48 rounded-lg bg-white border border-gray-200 shadow-2xl z-50 overflow-hidden py-1"
                                                                >
                                                                    {STATUS_OPTIONS.map(opt => {
                                                                        if (opt.value === 'new') return null; // Don't show 'new' as a manual target usually, keep it simple
                                                                        return (
                                                                            <button
                                                                                key={opt.value}
                                                                                onClick={() => handleStatusUpdate(order.id, opt.value)}
                                                                                className={cn(
                                                                                    "w-full flex items-center gap-3 px-5 py-3.5 text-sm font-bold transition-colors text-left",
                                                                                    order.status === opt.value
                                                                                        ? "bg-amber-50 text-[var(--brand-dark)]"
                                                                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                                                )}
                                                                            >
                                                                                <opt.icon size={16} className={order.status === opt.value ? "text-[var(--brand-dark)]" : "text-gray-400"} />
                                                                                {opt.label}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
