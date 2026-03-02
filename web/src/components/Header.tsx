'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Menu, X, Sun, Moon, ChevronRight } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useCartStore } from '@/store/cart';
import { useSettingsStore } from '@/store/settings';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/products?category=montres-intelligentes', label: 'Montres' },
  { href: '/products?category=velos', label: 'Vélos' },
  { href: '/products?category=accessoires', label: 'Accessoires' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const items = useCartStore((s) => s.items);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const storeName = useSettingsStore((s) => s.storeName);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Hide on admin
  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      {/* Announcement Bar */}
      <div
        className={cn(
          'relative z-50 text-center text-sm font-medium tracking-wide transition-all duration-300',
          'py-2.5 px-4',
          scrolled ? 'h-0 py-0 overflow-hidden opacity-0' : 'opacity-100'
        )}
        style={{
          background: 'linear-gradient(90deg, var(--brand-dark), var(--brand), var(--brand-dark))',
          backgroundSize: '200% 100%',
          animation: 'gradient-shift 8s ease infinite',
          color: 'var(--text-inverse)',
        }}
      >
        🚚 Livraison vers les 58 wilayas — Paiement à la livraison uniquement
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'sticky top-0 z-40 transition-all',
          scrolled
            ? 'glass shadow-md'
            : 'bg-transparent'
        )}
        style={{ transitionDuration: '300ms' }}
      >
        <div className="mx-auto flex items-center justify-between px-4 md:px-8" style={{ maxWidth: 1280, height: 64 }}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 relative z-10 group">
            <div className="w-9 h-9 flex items-center justify-center shrink-0">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform duration-300">
                <rect width="36" height="36" rx="10" fill="var(--brand)" />
                <path d="M12 24L18 12L24 24" stroke="var(--bg-elevated)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 20L26 20" stroke="var(--bg-elevated)" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                {storeName.split(' ')[0]} <span style={{ color: 'var(--brand)' }}>{storeName.substring(storeName.indexOf(' ') + 1)}</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href.split('?')[0]));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                    isActive ? 'text-[var(--text)]' : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand)] rounded-t-full shadow-[0_-2px_10px_rgba(0,212,170,0.5)]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-[var(--surface)]"
              style={{ width: 40, height: 40, color: 'var(--text-secondary)' }}
              aria-label="Rechercher"
            >
              <Search size={18} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-[var(--surface)]"
              style={{ width: 40, height: 40, color: 'var(--text-secondary)' }}
              aria-label="Changer le thème"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-[var(--surface)]"
              style={{ width: 40, height: 40, color: 'var(--text-secondary)' }}
              aria-label="Panier"
            >
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 flex items-center justify-center text-[10px] font-bold rounded-full"
                  style={{
                    width: 18, height: 18,
                    background: 'var(--accent)',
                    color: '#fff',
                  }}
                >
                  {itemCount}
                </motion.span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-[var(--surface)]"
              style={{ width: 40, height: 40, color: 'var(--text-secondary)' }}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 top-full glass"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <div className="mx-auto px-4 md:px-8 py-4" style={{ maxWidth: 1280 }}>
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un produit..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--brand)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header >

      {/* Mobile Drawer */}
      <AnimatePresence>
        {
          mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 lg:hidden"
                style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
                onClick={() => setMobileOpen(false)}
              />
              <motion.nav
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 bottom-0 z-50 w-[280px] lg:hidden flex flex-col"
                style={{
                  background: 'var(--bg-elevated)',
                  borderLeft: '1px solid var(--border)',
                }}
              >
                <div className="flex items-center justify-between px-5 h-16" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="font-bold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>Menu</span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center rounded-lg hover:bg-[var(--surface)]"
                    style={{ width: 36, height: 36, color: 'var(--text-secondary)' }}
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto py-4 px-3">
                  {NAV_LINKS.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-colors duration-150 hover:bg-[var(--surface)]"
                        style={{
                          color: pathname === link.href ? 'var(--brand)' : 'var(--text)',
                        }}
                      >
                        {link.label}
                        <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div className="px-4 pb-6 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <Link
                    href="/products"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={{
                      background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))',
                      color: 'var(--text-inverse)',
                    }}
                  >
                    Découvrir la boutique
                  </Link>
                </div>
              </motion.nav>
            </>
          )
        }
      </AnimatePresence >
    </>
  );
}
