import Link from 'next/link';
import { getFeaturedProducts, getCategories } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { Truck, ShieldCheck, Headphones, CreditCard, ChevronRight, Watch, Bike, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const categoryIcons: Record<string, React.ElementType> = {
  'montres-intelligentes': Watch,
  'velos': Bike,
  'accessoires': Wrench,
};

// Next.js Server Components don't support framer-motion directly for complex animations
// We split the hero into a small client component or use CSS animations for the server-rendered parts.
// I will use pure premium CSS and refined layouts here for maximum performance and SEO.

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div className="page-enter bg-[var(--bg)] min-h-screen">
      {/* ===== PREMIUM HERO SECTION ===== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden noise">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-[var(--bg)] z-0" />
        <div className="absolute inset-0 gradient-mesh opacity-80 z-0" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay z-0"
          style={{ backgroundImage: 'url("/images/hero-watches.png")' }}
        />

        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[var(--bg)] to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center pt-20">
          <div className="animate-slide-down inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[var(--border)] mb-8 shadow-lg">
            <span className="flex h-2 w-2 rounded-full bg-[var(--brand)] animate-pulse" />
            <span className="text-sm font-medium tracking-wide text-[var(--text-secondary)]">La référence sportive en Algérie</span>
          </div>

          <h1 className="animate-slide-up stagger-1 font-heading font-black text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-white via-[var(--text)] to-[var(--text-muted)] max-w-5xl mb-6 shadow-sm">
            Dépassez Vos <br className="hidden md:block" />
            <span className="gradient-text drop-shadow-[0_0_30px_rgba(0,212,170,0.3)]">Limites.</span>
          </h1>

          <p className="animate-slide-up stagger-2 text-lg md:text-2xl text-[var(--text-secondary)] font-body max-w-2xl mb-12 sm:leading-relaxed">
            Montres connectées premium, vélos haute performance et accessoires pro.
            Livraison 58 wilayas, paiement à la réception.
          </p>

          <div className="animate-slide-up stagger-3 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <Link
              href="/products"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-bold text-lg rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 w-full sm:w-auto shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand)] to-[var(--brand-dark)] opacity-0 group-hover:opacity-10 transition-opacity" />
              Parcourir le catalogue
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="#categories"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 glass text-[var(--text)] font-semibold text-lg rounded-2xl transition-all hover:bg-[var(--surface)] hover:text-white w-full sm:w-auto"
            >
              Découvrir
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-float flex flex-col items-center gap-2 opacity-60">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-[var(--text-muted)] to-transparent" />
        </div>
      </section>

      {/* ===== CATEGORIES GRID ===== */}
      <section id="categories" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="font-heading font-bold text-3xl md:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-[var(--text-secondary)]">
                Nos Univers
              </h2>
              <p className="text-[var(--text-secondary)] text-lg max-w-xl">
                L'équipement parfait pour chaque discipline, sélectionné par des passionnés.
              </p>
            </div>
            <Link href="/products" className="hidden md:inline-flex items-center gap-2 text-[var(--brand)] hover:text-[var(--brand-light)] font-medium transition-colors">
              Voir tout <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
            {categories.map((cat, i) => {
              const Icon = categoryIcons[cat.slug] || Wrench;
              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={cn(
                    "group relative flex flex-col justify-end p-8 rounded-[2rem] overflow-hidden transition-all duration-500 hover:scale-[1.02]",
                    i === 0 ? "md:col-span-2 md:row-span-2 min-h-[400px]" : "min-h-[300px]"
                  )}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 bg-[var(--surface)]">
                    {cat.image && (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-80"
                        style={{ backgroundImage: `url(${cat.image})` }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg-elevated)]/80 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-[var(--brand)] backdrop-blur-xl border border-[var(--border)] group-hover:bg-[var(--brand)] group-hover:text-black transition-colors duration-300 shadow-[0_0_20px_rgba(0,212,170,0.2)]">
                      <Icon size={28} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-2xl md:text-3xl text-white mb-2 tracking-tight">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="text-[var(--text-secondary)] line-clamp-2 md:text-lg group-hover:text-white/90 transition-colors">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <Link href="/products" className="md:hidden mt-8 inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl glass text-[var(--text)] font-medium">
            Voir tout le catalogue <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-24 bg-[var(--bg-elevated)] relative border-y border-[var(--border)] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--brand-glow)] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-5xl mb-6">Sélection Premium</h2>
            <p className="text-[var(--text-secondary)] text-lg">
              Nos meilleures ventes et nouveautés exclusives, expédiées aujourd'hui.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.slice(0, 4).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRUST / FEATURES GRID ===== */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl">L'Engagement High Tech Sport</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Truck,
                title: 'Livraison express',
                desc: 'Expédition sous 24h vers les 58 wilayas d\'Algérie.',
                color: 'var(--brand)'
              },
              {
                icon: CreditCard,
                title: 'Paiement sécurisé',
                desc: 'Payez en espèces à la livraison (COD), sans risque.',
                color: 'var(--accent)'
              },
              {
                icon: ShieldCheck,
                title: 'Produits originaux',
                desc: 'Garantie officielle constructeur sur tout le catalogue.',
                color: '#3B82F6'
              },
              {
                icon: Headphones,
                title: 'Support dédié',
                desc: 'Service client réactif via WhatsApp 7j/7.',
                color: '#8B5CF6'
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="group relative p-8 rounded-3xl glass transition-all duration-300 hover:-translate-y-2 hover:bg-[var(--surface)]"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg"
                  style={{ background: `color-mix(in srgb, ${feature.color} 15%, transparent)`, color: feature.color, border: `1px solid color-mix(in srgb, ${feature.color} 30%, transparent)` }}
                >
                  <feature.icon size={28} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold font-heading mb-3">{feature.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER CTA ===== */}
      <section className="py-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-[2.5rem] overflow-hidden p-8 md:p-16 text-center shadow-2xl glass border border-[rgba(255,255,255,0.1)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-dark)] to-[var(--bg)] opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 noise opacity-30" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass mb-8 text-white shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </div>

            <h2 className="font-heading font-black text-3xl md:text-5xl mb-6 text-white drop-shadow-md tracking-tight">
              Rejoignez la communauté
            </h2>
            <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto leading-relaxed">
              Suivez-nous sur Facebook pour découvrir en avant-première nos arrivages, promotions secrètes et conseils d'experts.
            </p>
            <a
              href="https://www.facebook.com/Garmin.pro.dz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-[var(--bg)] rounded-2xl font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] w-full sm:w-auto"
            >
              Suivre High Tech Sport
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
