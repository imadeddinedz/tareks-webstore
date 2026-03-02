'use client';

import Link from 'next/link';
import { Home, Grid3X3, ShoppingCart, MessageCircle } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { usePathname } from 'next/navigation';

export function MobileNav() {
    const pathname = usePathname();
    const totalItems = useCartStore((s) => s.totalItems());
    const openCart = useCartStore((s) => s.openCart);

    if (pathname?.startsWith('/admin')) return null;

    const links = [
        { href: '/', label: 'Accueil', icon: Home },
        { href: '/products', label: 'Catalogue', icon: Grid3X3 },
    ];

    return (
        <nav
            className="md:hidden"
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'var(--color-bg-elevated)',
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                height: 64,
                zIndex: 90,
                paddingBottom: 'env(safe-area-inset-bottom)',
            }}
        >
            {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 4,
                            textDecoration: 'none',
                            color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            flex: 1,
                            padding: '8px 0',
                            transition: 'color 0.2s',
                        }}
                    >
                        <link.icon size={22} />
                        {link.label}
                    </Link>
                );
            })}

            <button
                onClick={openCart}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    flex: 1,
                    padding: '8px 0',
                    cursor: 'pointer',
                    position: 'relative',
                }}
            >
                <div style={{ position: 'relative' }}>
                    <ShoppingCart size={22} />
                    {totalItems > 0 && (
                        <span
                            style={{
                                position: 'absolute',
                                top: -6,
                                right: -8,
                                background: 'var(--color-accent)',
                                color: 'white',
                                borderRadius: 'var(--radius-full)',
                                width: 16,
                                height: 16,
                                fontSize: '0.6rem',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {totalItems}
                        </span>
                    )}
                </div>
                Panier
            </button>

            <a
                href="https://wa.me/213550000000"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    textDecoration: 'none',
                    color: '#25D366',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    flex: 1,
                    padding: '8px 0',
                }}
            >
                <MessageCircle size={22} />
                WhatsApp
            </a>
        </nav>
    );
}
