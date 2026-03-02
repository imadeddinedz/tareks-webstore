'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Menu, X, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useSettingsStore } from '@/store/settings';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const { storeName, logoImage } = useSettingsStore();

  // Fetch categories for dynamic nav
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCategories(data); })
      .catch(() => { });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  if (pathname?.startsWith('/admin')) return null;

  // Build nav links: Accueil + dynamic categories + Contact
  const navLinks = [
    { href: '/', label: 'Accueil' },
    ...categories.slice(0, 5).map(c => ({
      href: `/products?category=${c.slug}`,
      label: c.name,
    })),
    { href: '/contact', label: 'Contact' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* ═══ Announcement Bar ═══ */}
      <div
        className={cn(
          'relative z-50 text-center text-xs font-semibold tracking-wide transition-all duration-500',
          'py-2 px-4 bg-gray-950 text-white/80',
          scrolled ? 'h-0 py-0 overflow-hidden opacity-0' : 'opacity-100'
        )}
      >
        🚚 Livraison vers les 58 wilayas — Paiement à la livraison
      </div>

      {/* ═══ Dynamic Island Header ═══ */}
      <header className="sticky top-0 z-40 w-full flex justify-center pointer-events-none" style={{ paddingTop: scrolled ? 10 : 0 }}>
        <div
          className={cn(
            'pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between',
            scrolled
              ? 'w-[min(94%,860px)] h-[50px] rounded-[25px] px-5 border border-white/60'
              : 'w-full h-[60px] rounded-none px-6 md:px-10 border-b border-gray-100'
          )}
          style={{
            background: scrolled
              ? 'rgba(255, 255, 255, 0.55)'
              : 'rgba(255, 255, 255, 0.97)',
            backdropFilter: scrolled ? 'blur(40px) saturate(2)' : 'blur(12px)',
            WebkitBackdropFilter: scrolled ? 'blur(40px) saturate(2)' : 'blur(12px)',
            boxShadow: scrolled
              ? '0 4px 30px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.7)'
              : 'none',
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            {logoImage ? (
              <div className={cn(
                'relative flex items-center justify-center transition-all duration-500 group-hover:scale-105',
                scrolled ? 'w-8 h-8' : 'w-10 h-10'
              )}>
                <Image src={logoImage} alt={storeName} fill className="object-contain" sizes="40px" />
              </div>
            ) : (
              <div
                className={cn(
                  'flex items-center justify-center rounded-lg transition-all duration-500 bg-amber-500 group-hover:scale-110',
                  scrolled ? 'w-7 h-7' : 'w-8 h-8'
                )}
              >
                <span className={cn(
                  'font-black text-white transition-all duration-500',
                  scrolled ? 'text-xs' : 'text-sm'
                )}>H</span>
              </div>
            )}
            <span
              className={cn(
                'font-bold tracking-tight transition-all duration-500 hidden sm:inline',
                scrolled ? 'text-xs' : 'text-sm'
              )}
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}
            >
              {storeName.split(' ')[0]}{' '}
              <span className="text-amber-500">{storeName.substring(storeName.indexOf(' ') + 1)}</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className={cn(
            'hidden lg:flex items-center transition-all duration-500',
            scrolled ? 'gap-0.5' : 'gap-1'
          )}>
            {navLinks.map((link) => {
              let isActive = pathname === link.href;

              if (link.href !== '/' && link.href !== '/contact' && pathname === '/products') {
                const linkCategory = new URLSearchParams(link.href.split('?')[1]).get('category');
                if (linkCategory && searchParams?.get('category')) {
                  isActive = linkCategory === searchParams.get('category');
                }
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-3 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200',
                    isActive
                      ? 'text-amber-700 bg-amber-50'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={cn(
                'flex items-center justify-center rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200',
                scrolled ? 'w-8 h-8' : 'w-9 h-9'
              )}
              aria-label="Rechercher"
            >
              <Search size={scrolled ? 15 : 16} />
            </button>

            <button
              onClick={toggleCart}
              className={cn(
                'relative flex items-center justify-center rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200',
                scrolled ? 'w-8 h-8' : 'w-9 h-9'
              )}
              aria-label="Panier"
            >
              <ShoppingBag size={scrolled ? 15 : 16} />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 flex items-center justify-center text-[9px] font-bold rounded-full bg-amber-500 text-white"
                  style={{ width: 16, height: 16 }}
                >
                  {itemCount}
                </motion.span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                'lg:hidden flex items-center justify-center rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200',
                scrolled ? 'w-8 h-8' : 'w-9 h-9'
              )}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* ═══ Search Overlay ═══ */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-0 z-50 flex justify-center pt-20 px-4"
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
            <form
              onSubmit={handleSearch}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-2 border border-gray-100"
            >
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm bg-gray-50 border-none outline-none text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Mobile Drawer ═══ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[300px] lg:hidden bg-white flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
                <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4 px-4">
                {navLinks.map((link, i) => {
                  let isActive = pathname === link.href;

                  if (link.href !== '/' && link.href !== '/contact' && pathname === '/products') {
                    const linkCategory = new URLSearchParams(link.href.split('?')[1]).get('category');
                    if (linkCategory && searchParams?.get('category')) {
                      isActive = linkCategory === searchParams.get('category');
                    }
                  }

                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                          isActive ? 'text-amber-600 bg-amber-50' : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        {link.label}
                        <ChevronRight size={14} className="text-gray-300" />
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
              <div className="px-4 pb-6 pt-3 border-t border-gray-100">
                <Link
                  href="/products"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition-colors"
                >
                  Découvrir la boutique
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
