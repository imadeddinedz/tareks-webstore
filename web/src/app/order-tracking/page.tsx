'use client';

import { useState } from 'react';
import { Search, Package, CheckCircle, Truck, Clock, XCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/products';

interface Order {
    order_number: string;
    customer_name: string;
    customer_wilaya: string;
    status: string;
    total: number;
    created_at: string;
    items: Array<{ name: string; quantity: number; price: number }>;
}

const STATUS_MAP: Record<string, { label: string; icon: React.ElementType; color: string; cssClass: string }> = {
    new: { label: 'Nouvelle', icon: Clock, color: '#FFAA00', cssClass: 'status-new' },
    confirmed: { label: 'Confirmée', icon: CheckCircle, color: '#0088FF', cssClass: 'status-confirmed' },
    preparing: { label: 'En préparation', icon: Package, color: '#FF6B35', cssClass: 'status-preparing' },
    shipped: { label: 'Expédiée', icon: Truck, color: '#7D5FFF', cssClass: 'status-shipped' },
    delivered: { label: 'Livrée', icon: CheckCircle, color: '#00D68F', cssClass: 'status-delivered' },
    cancelled: { label: 'Annulée', icon: XCircle, color: '#FF3D71', cssClass: 'status-cancelled' },
    returned: { label: 'Retournée', icon: RotateCcw, color: '#A0A0C0', cssClass: 'status-returned' },
};

const STATUS_ORDER = ['new', 'confirmed', 'preparing', 'shipped', 'delivered'];

export default function OrderTrackingPage() {
    const [searchValue, setSearchValue] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue.trim()) return;
        setLoading(true);
        setSearched(true);

        try {
            const isOrderNumber = searchValue.toUpperCase().startsWith('HTS');
            const param = isOrderNumber
                ? `order_number=${encodeURIComponent(searchValue.trim())}`
                : `phone=${encodeURIComponent(searchValue.trim())}`;

            const res = await fetch(`/api/orders?${param}`);
            const data = await res.json();
            setOrders(data.orders || []);
        } catch {
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-enter" style={{ maxWidth: 700, margin: '0 auto', padding: '40px 16px 80px' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, marginBottom: 12, textAlign: 'center' }}>
                Suivi de commande
            </h1>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 32, fontSize: '0.9rem' }}>
                Entrez votre numéro de téléphone ou numéro de commande
            </p>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 40 }}>
                <input
                    type="text"
                    className="input"
                    placeholder="05XXXXXXXX ou HTS-XXXXXX-XXXX"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    <Search size={18} />
                    {loading ? '...' : 'Rechercher'}
                </button>
            </form>

            {searched && orders.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    <Package size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                    <p style={{ fontWeight: 600 }}>Aucune commande trouvée</p>
                    <p style={{ fontSize: '0.85rem', marginTop: 8 }}>
                        Vérifiez votre numéro de téléphone ou numéro de commande
                    </p>
                </div>
            )}

            {orders.map((order) => {
                const status = STATUS_MAP[order.status] || STATUS_MAP.new;
                const StatusIcon = status.icon;
                const currentIndex = STATUS_ORDER.indexOf(order.status);

                return (
                    <div
                        key={order.order_number}
                        style={{
                            background: 'var(--bg-card)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--border)',
                            padding: 24,
                            marginBottom: 20,
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                            <div>
                                <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem' }}>
                                    {order.order_number}
                                </p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
                                    {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <span className={status.cssClass} style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <StatusIcon size={14} />
                                {status.label}
                            </span>
                        </div>

                        {/* Progress */}
                        {order.status !== 'cancelled' && order.status !== 'returned' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 24, overflowX: 'auto', padding: '4px 0' }}>
                                {STATUS_ORDER.map((s, i) => {
                                    const isActive = i <= currentIndex;
                                    const st = STATUS_MAP[s];
                                    return (
                                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4, flex: i < STATUS_ORDER.length - 1 ? 1 : 0 }}>
                                            <div style={{
                                                width: 28, height: 28, borderRadius: 'var(--radius-full)',
                                                background: isActive ? st.color : 'var(--surface)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                flexShrink: 0,
                                            }}>
                                                {isActive ? <CheckCircle size={14} color="white" /> : <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border)' }} />}
                                            </div>
                                            {i < STATUS_ORDER.length - 1 && (
                                                <div style={{ flex: 1, height: 2, background: isActive && i < currentIndex ? st.color : 'var(--border)', borderRadius: 2, minWidth: 20 }} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                {order.items?.length || 0} article{(order.items?.length || 0) > 1 ? 's' : ''}
                            </p>
                            <p style={{ fontWeight: 700, color: 'var(--brand)', fontFamily: 'var(--font-heading)' }}>
                                {formatPrice(order.total)}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
