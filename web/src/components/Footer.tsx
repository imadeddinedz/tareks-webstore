'use client';

import Link from 'next/link';
import { Facebook, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import { useSettingsStore } from '@/store/settings';
import { useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function Footer() {
  const storeName = useSettingsStore((s) => s.storeName);
  const storePhone = useSettingsStore((s) => s.storePhone);
  const storeEmail = useSettingsStore((s) => s.storeEmail);
  const storeAddress = useSettingsStore((s) => s.storeAddress);
  const logoImage = useSettingsStore((s) => s.logoImage);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCategories(data); })
      .catch(() => { });
  }, []);

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 py-16">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group">
              {logoImage ? (
                <div className="relative w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                  <img src={logoImage} alt={storeName} className="object-contain w-full h-full" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-sm font-black text-white">H</span>
                </div>
              )}
              <span className="text-base font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                {storeName.split(' ')[0]}{' '}
                <span className="text-amber-500">{storeName.substring(storeName.indexOf(' ') + 1)}</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
              La référence en Algérie pour les équipements sportifs premium.
            </p>
            <div className="flex gap-2">
              <a href="https://facebook.com/Garmin.pro.dz" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-gray-50 hover:bg-[#1877F2] text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-50 hover:bg-[#E4405F] text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200" aria-label="Instagram">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Categories (dynamic) */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 mb-4">Catégories</h4>
            <ul className="space-y-2.5">
              {categories.map(c => (
                <li key={c.id}>
                  <Link href={`/products?category=${c.slug}`} className="text-sm text-gray-400 hover:text-amber-600 transition-colors">{c.name}</Link>
                </li>
              ))}
              <li><Link href="/products" className="text-sm text-gray-400 hover:text-amber-600 transition-colors">Tous les produits</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 mb-4">Informations</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'À propos', href: '/about' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Politique de retour', href: '/returns' },
                { label: 'Suivi de commande', href: '/order-tracking' },
                { label: 'Contact', href: '/contact' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-amber-600 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 mb-4">Contact</h4>
            <ul className="space-y-3.5">
              {storeAddress && (
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <MapPin size={15} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>{storeAddress}</span>
                </li>
              )}
              {storePhone && (
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <Phone size={15} className="text-amber-500 shrink-0 mt-0.5" />
                  <a href={`tel:${storePhone}`} className="hover:text-amber-600 transition-colors">{storePhone}</a>
                </li>
              )}
              {storeEmail && (
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <Mail size={15} className="text-amber-500 shrink-0 mt-0.5" />
                  <a href={`mailto:${storeEmail}`} className="hover:text-amber-600 transition-colors">{storeEmail}</a>
                </li>
              )}
              {!storeAddress && !storePhone && !storeEmail && (
                <li className="text-sm text-gray-300 italic">Configurez les infos dans les paramètres admin.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-5 border-t border-gray-100 gap-3">
          <p className="text-xs text-gray-300">
            © {new Date().getFullYear()} {storeName}. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-gray-300 font-medium">🚚 Livraison 58 wilayas</span>
            <span className="text-[10px] text-gray-300 font-medium">💰 Paiement à la livraison</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
