import { getOrders } from '@/lib/supabase';
import { ShoppingCart, TrendingUp, Users, Package, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatPrice } from '@/lib/products';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default async function AdminDashboard() {
  const orders = await getOrders();

  // Calculate stats
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const todayOrders = orders.filter(o => {
    const today = new Date();
    const orderDate = new Date(o.created_at);
    return orderDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(o => o.status === 'new' || o.status === 'preparing');

  const STATS = [
    {
      label: "Chiffre d'Affaires",
      value: totalRevenue > 0 ? formatPrice(totalRevenue) : "0 DA",
      icon: TrendingUp,
      color: "var(--brand-dark)"
    },
    {
      label: "Commandes du Jour",
      value: todayOrders.length.toString(),
      icon: ShoppingCart,
      color: "#2563EB"
    },
    {
      label: "En Attente",
      value: pendingOrders.length.toString(),
      icon: Clock,
      color: "#F59E0B"
    },
    {
      label: "Total Commandes",
      value: orders.length.toString(),
      icon: Package,
      color: "#8B5CF6"
    },
  ];

  const STATUS_CONFIG: Record<string, { label: string, className: string }> = {
    'new': { label: 'Nouvelle', className: 'status-new border-[#F59E0B]/30' },
    'confirmed': { label: 'Confirmée', className: 'status-confirmed border-[#3B82F6]/30' },
    'preparing': { label: 'Préparation', className: 'status-preparing border-[#FF6B35]/30' },
    'shipped': { label: 'Expédiée', className: 'status-shipped border-[#8B5CF6]/30' },
    'delivered': { label: 'Livrée', className: 'status-delivered border-[#22C55E]/30' },
    'cancelled': { label: 'Annulée', className: 'status-cancelled border-[#EF4444]/30' },
    'returned': { label: 'Retournée', className: 'status-returned border-[#9494B0]/30' },
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10 lg:px-12 max-w-[1600px] mx-auto pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Vue d'ensemble</h1>
          <p className="text-sm text-gray-500 mt-1">Suivez l'activité de votre boutique en temps réel.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 shadow-sm text-xs font-medium text-gray-600 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> En ligne
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {STATS.map((stat, i) => (
          <div
            key={i}
            className="relative p-6 rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `color-mix(in srgb, ${stat.color} 10%, transparent)`, color: stat.color, border: `1px solid color-mix(in srgb, ${stat.color} 20%, transparent)` }}
              >
                <stat.icon size={18} />
              </div>
              <h3 className="text-gray-500 text-xs font-medium">{stat.label}</h3>
            </div>

            <div className="relative z-10">
              <p className="font-bold text-2xl text-gray-900 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
          <h2 className="text-sm font-semibold text-gray-900">Commandes Récentes</h2>
          <Link href="/admin/orders" className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1">
            Voir tout <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          {/* Mobile Card List */}
          <div className="sm:hidden flex flex-col divide-y divide-gray-100">
            {orders.slice(0, 10).map((order) => {
              const status = STATUS_CONFIG[order.status] || STATUS_CONFIG['new'];
              return (
                <div key={order.id} className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-gray-900 group-hover:text-[var(--brand-dark)] transition-colors">
                      #{order.order_number || order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className={cn(
                      "inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold border",
                      status.className
                    )}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="min-w-0 pr-3">
                      <div className="font-bold text-gray-900 text-sm truncate">{order.customer_name}</div>
                      <div className="text-xs text-gray-500 truncate">{order.customer_wilaya}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-gray-900">{formatPrice(order.total)}</div>
                      <div className="text-xs text-gray-500 font-medium">
                        {formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: fr })}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Desktop Table View */}
          <table className="hidden sm:table w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider bg-gray-50">
                <th className="px-4 sm:px-6 py-3.5 font-medium">Commande</th>
                <th className="px-4 sm:px-6 py-3.5 font-medium">Client</th>
                <th className="px-4 sm:px-6 py-3.5 font-medium">Date</th>
                <th className="px-4 sm:px-6 py-3.5 font-medium text-right">Montant</th>
                <th className="px-4 sm:px-6 py-3.5 font-medium text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.slice(0, 10).map((order) => {
                const status = STATUS_CONFIG[order.status] || STATUS_CONFIG['new'];
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 sm:px-6 py-4">
                      <span className="font-mono font-bold text-gray-900 group-hover:text-[var(--brand-dark)] transition-colors">
                        #{order.order_number || order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <div className="text-sm text-gray-500 font-medium mt-1">{order.items?.length || 0} article(s)</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-bold text-gray-900 truncate max-w-[150px]">{order.customer_name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-[150px]">{order.customer_wilaya}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 font-medium">
                      {formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: fr })}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right font-bold text-gray-900">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <span className={cn(
                        "inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold border",
                        status.className
                      )}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="p-16 text-center text-gray-400 flex flex-col items-center">
              <Package size={48} className="mb-4 text-gray-300" />
              <p className="text-lg font-bold text-gray-500">Aucune commande pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
