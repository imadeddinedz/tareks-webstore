'use client';

import Link from 'next/link';
import { Facebook, Instagram, Mail, MapPin, Phone, ShieldCheck, Truck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '@/store/settings';

export function Footer() {
  const storeName = useSettingsStore((s) => s.storeName);

  return (
    <footer className="relative bg-[var(--bg-elevated)] pt-20 pb-10 border-t border-[var(--border)] overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-[400px] bg-[var(--brand-glow)] blur-[100px] opacity-20 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div
                className="flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:rotate-12"
                style={{
                  width: 48, height: 48,
                  background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))',
                  boxShadow: '0 0 20px var(--brand-glow)',
                }}
              >
                <span className="text-2xl font-black text-[var(--bg)]">H</span>
              </div>
              <span className="text-2xl font-bold font-heading tracking-tight">
                {storeName.split(' ')[0]} <span className="text-[var(--brand)]">{storeName.substring(storeName.indexOf(' ') + 1)}</span>
              </span>
            </Link>

            <p className="text-[var(--text-secondary)] mb-6 max-w-sm text-sm sm:text-base leading-relaxed">
              La référence en Algérie pour les équipements sportifs premium.
              Montres connectées, vélos et accessoires de grandes marques mondiales.
            </p>

            <div className="inline-flex flex-col gap-2 p-4 rounded-2xl glass border-[rgba(255,107,53,0.2)] bg-[rgba(255,107,53,0.02)] w-full max-w-sm">
              <div className="flex items-center gap-3 text-[var(--accent)] font-bold mb-1">
                <Truck size={20} />
                <span>Paiement à la livraison</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Aucun risque. Commandez en ligne et payez uniquement lors de la réception de votre colis. Expédition vers les 58 wilayas.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="font-heading font-bold text-lg mb-6 text-white">Navigation</h3>
            <ul className="flex flex-col gap-4">
              {[
                { label: 'Accueil', href: '/' },
                { label: 'Montres Intelligentes', href: '/products?category=montres-intelligentes' },
                { label: 'Vélos & E-Bikes', href: '/products?category=velos' },
                { label: 'Accessoires', href: '/products?category=accessoires' },
                { label: 'Suivi de commande', href: '/order-tracking' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors text-sm font-medium flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--border)] group-hover:bg-[var(--brand)] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy Links */}
          <div className="lg:col-span-2">
            <h3 className="font-heading font-bold text-lg mb-6 text-white">Informations</h3>
            <ul className="flex flex-col gap-4">
              {[
                { label: 'À propos de nous', href: '/about' },
                { label: 'Questions fréquentes', href: '/faq' },
                { label: 'Politique de retour', href: '/returns' },
                { label: 'Contactez-nous', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors text-sm font-medium flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--border)] group-hover:bg-[var(--brand)] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3 lg:col-start-10">
            <h3 className="font-heading font-bold text-lg mb-6 text-white">Contact</h3>
            <ul className="flex flex-col gap-5">
              <li className="flex items-start gap-4 text-[var(--text-secondary)] group">
                <div className="mt-1 p-2 rounded-lg bg-[var(--surface)] text-[var(--brand)] group-hover:bg-[var(--brand)] group-hover:text-black transition-colors">
                  <MapPin size={18} />
                </div>
                <div className="text-sm">
                  <strong className="block text-[var(--text)] mb-1">Notre Boutique</strong>
                  Centre-ville Khemis Miliana,<br />
                  Aïn Defla, Algérie
                </div>
              </li>
              <li className="flex items-start gap-4 text-[var(--text-secondary)] group">
                <div className="mt-1 p-2 rounded-lg bg-[var(--surface)] text-[var(--brand)] group-hover:bg-[var(--brand)] group-hover:text-black transition-colors">
                  <Phone size={18} />
                </div>
                <div className="text-sm">
                  <strong className="block text-[var(--text)] mb-1">Téléphone & WhatsApp</strong>
                  <a href="tel:0555555555" className="hover:text-[var(--brand)] transition-colors">05 55 55 55 55</a><br />
                  <a href="tel:0666666666" className="hover:text-[var(--brand)] transition-colors">06 66 66 66 66</a>
                </div>
              </li>
              <li className="flex items-start gap-4 text-[var(--text-secondary)] group">
                <div className="mt-1 p-2 rounded-lg bg-[var(--surface)] text-[var(--brand)] group-hover:bg-[var(--brand)] group-hover:text-black transition-colors">
                  <Clock size={18} />
                </div>
                <div className="text-sm">
                  <strong className="block text-[var(--text)] mb-1">Horaires d'ouverture</strong>
                  Samedi - Jeudi : 09h00 - 18h00<br />
                  Vendredi : Fermé
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[var(--border)] gap-6">
          <p className="text-[var(--text-muted)] text-sm font-medium">
            &copy; {new Date().getFullYear()} {storeName}. Tous droits réservés.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com/Garmin.pro.dz"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center glass text-[var(--text-secondary)] hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={18} fill="currentColor" className="border-none" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center glass text-[var(--text-secondary)] hover:text-white hover:bg-[#E4405F] hover:border-[#E4405F] transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
