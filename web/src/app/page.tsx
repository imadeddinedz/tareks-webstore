import Link from 'next/link';
import { getFeaturedProducts, getCategories } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { HeroSection } from '@/components/HeroSection';
import { Reveal, Stagger, Counter } from '@/components/Animations';
import { Truck, ShieldCheck, Headphones, CreditCard, ChevronRight, Watch, Bike, Wrench, ArrowRight, Star, Package, MapPin } from 'lucide-react';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const categoryIcons: Record<string, React.ElementType> = {
  'montres-intelligentes': Watch,
  'velos': Bike,
  'accessoires': Wrench,
};

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div>
      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <HeroSection />

      {/* ═══════════════════════════ TRUST BAR ═══════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Truck, label: 'Livraison rapide', sub: '58 wilayas' },
              { icon: CreditCard, label: 'Paiement à la livraison', sub: 'Sans risque' },
              { icon: ShieldCheck, label: 'Produits originaux', sub: 'Garantie officielle' },
              { icon: Headphones, label: 'Support 7j/7', sub: 'Via WhatsApp' },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 100} direction="up" distance={20}>
                <div className="flex items-center gap-3.5 px-6 lg:px-8 py-5 lg:py-6 border-r border-b lg:border-b-0 border-gray-100 last:border-r-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900 leading-tight">{item.label}</p>
                    <p className="text-[11px] text-gray-400 font-medium">{item.sub}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ CATEGORIES ═══════════════════════════ */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <Reveal>
            <div className="mb-14 md:mb-16">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600 mb-3">Collections</span>
              <div className="flex items-end justify-between gap-8">
                <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-[2.75rem] text-gray-900 tracking-tight leading-tight">
                  Explorer par catégorie
                </h2>
                <Link href="/products" className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-amber-600 hover:gap-2.5 transition-all duration-300">
                  Tout voir <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </Reveal>

          {(() => {
            const gradients = [
              'from-amber-500 to-orange-600',
              'from-blue-500 to-indigo-600',
              'from-emerald-500 to-teal-600',
              'from-violet-500 to-purple-600',
              'from-rose-500 to-pink-600',
            ];
            const lightBgs = [
              'bg-amber-50',
              'bg-blue-50',
              'bg-emerald-50',
              'bg-violet-50',
              'bg-rose-50',
            ];

            return (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {categories.map((cat, i) => {
                  const Icon = categoryIcons[cat.slug] || Wrench;
                  const spanClass = i === 0 ? 'md:col-span-7' : i === 1 ? 'md:col-span-5' : 'md:col-span-4';
                  const gradient = gradients[i % gradients.length];
                  const lightBg = lightBgs[i % lightBgs.length];
                  const isLarge = i <= 1;

                  return (
                    <Reveal key={cat.id} delay={i * 120} direction="up" className={spanClass}>
                      <Link
                        href={`/products?category=${cat.slug}`}
                        className={`group relative flex flex-col overflow-hidden rounded-3xl bg-white border border-gray-100 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] hover:-translate-y-1 ${isLarge ? 'min-h-[220px] md:min-h-[280px]' : 'min-h-[200px] md:min-h-[240px]'}`}
                      >
                        {/* Category image or gradient background */}
                        <div className={`relative flex-1 overflow-hidden ${cat.image ? '' : lightBg}`}>
                          {cat.image ? (
                            <>
                              <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                                style={{ backgroundImage: `url(${cat.image})` }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                            </>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className={`w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                <Icon size={isLarge ? 48 : 40} className="text-white" strokeWidth={1.5} />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Info bar */}
                        <div className="relative px-7 py-5 border-t border-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-heading font-bold text-lg text-gray-900 tracking-tight group-hover:text-amber-600 transition-colors duration-300">
                                {cat.name}
                              </h3>
                              {cat.description && (
                                <p className="text-gray-400 text-xs mt-0.5 max-w-[200px] truncate">{cat.description}</p>
                              )}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-amber-500 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                              <ArrowRight size={16} className="text-gray-400 group-hover:text-white transition-colors duration-300" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </section>

      {/* ═══════════════════════════ STATS ═══════════════════════════ */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            {[
              { value: 58, suffix: '', label: 'Wilayas livrées' },
              { value: 500, suffix: '+', label: 'Clients satisfaits' },
              { value: 24, suffix: 'h', label: 'Expédition rapide' },
              { value: 100, suffix: '%', label: 'Produits originaux' },
            ].map((stat) => (
              <Reveal key={stat.label} direction="up" distance={20}>
                <div>
                  <p className="font-heading font-black text-3xl md:text-4xl text-gray-900">
                    <Counter target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs md:text-sm text-gray-400 font-medium mt-1">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FEATURED PRODUCTS ═══════════════════════════ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <Reveal>
            <div className="mb-14 md:mb-16">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600 mb-3">Best-sellers</span>
              <div className="flex items-end justify-between gap-8">
                <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-[2.75rem] text-gray-900 tracking-tight leading-tight">
                  Sélection populaire
                </h2>
                <Link href="/products" className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-amber-600 hover:gap-2.5 transition-all duration-300">
                  Tout voir <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </Reveal>

          {products.length > 0 ? (
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6" staggerDelay={100}>
              {products.slice(0, 8).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </Stagger>
          ) : (
            <Reveal>
              <div className="text-center py-24 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-amber-50 flex items-center justify-center">
                  <Package size={28} className="text-amber-500" />
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-1">Produits à venir</p>
                <p className="text-sm text-gray-400 max-w-sm mx-auto">
                  Configurez votre base de données pour afficher vos produits ici.
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ═══════════════════════════ HIGHLIGHT BANNER ═══════════════════════════ */}
      <Reveal direction="none">
        <section className="relative overflow-hidden bg-gray-950 py-20 md:py-28">
          {/* Decorative amber glow */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-amber-600/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <Reveal direction="left" distance={30}>
                  <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400 mb-4">Notre engagement</span>
                  <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white tracking-tight leading-tight mb-5">
                    Paiement à la livraison,{' '}
                    <span className="text-amber-400">sans risque.</span>
                  </h2>
                  <p className="text-base text-white/40 max-w-md leading-relaxed mb-8">
                    Commandez en toute confiance. Vous ne payez que lorsque vous recevez votre colis et vérifiez votre commande.
                  </p>
                  <Link
                    href="/products"
                    className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(245,158,11,0.3)]"
                  >
                    Commander maintenant <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Reveal>
              </div>
              <Reveal direction="right" distance={30} delay={200}>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: CreditCard, title: 'Paiement COD', desc: 'Cash on delivery' },
                    { icon: Truck, title: 'Livraison express', desc: 'Sous 24-48h' },
                    { icon: MapPin, title: '58 Wilayas', desc: 'Couverture nationale' },
                    { icon: ShieldCheck, title: '100% Authentique', desc: 'Garantie constructeur' },
                  ].map((item) => (
                    <div key={item.title} className="p-5 rounded-xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.07] transition-colors duration-300">
                      <item.icon size={20} className="text-amber-400 mb-3" />
                      <p className="text-sm font-semibold text-white mb-0.5">{item.title}</p>
                      <p className="text-[11px] text-white/30">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══════════════════════════ WHY US ═══════════════════════════ */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <Reveal>
            <div className="text-center mb-14 md:mb-16">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600 mb-3">Nos engagements</span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-[2.75rem] text-gray-900 tracking-tight">
                Pourquoi nous choisir
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px rounded-2xl overflow-hidden bg-gray-200/80 shadow-sm">
            {[
              { icon: Truck, title: 'Livraison express', desc: "Expédition sous 24h vers toutes les 58 wilayas d'Algérie avec suivi en temps réel de votre colis du départ à la réception." },
              { icon: CreditCard, title: 'Paiement sécurisé', desc: "Payez en espèces à la livraison. Aucun risque, aucune information bancaire requise. Vérifiez votre commande avant de payer." },
              { icon: ShieldCheck, title: 'Produits 100% originaux', desc: "Tous nos produits sont certifiés authentiques avec garantie officielle constructeur. Nous travaillons directement avec les marques." },
              { icon: Headphones, title: 'Support réactif', desc: "Notre équipe est disponible via WhatsApp 7j/7 pour vous accompagner dans votre choix et après votre achat." },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 100} direction="up" distance={20}>
                <div className="group bg-white p-10 md:p-12 hover:bg-amber-50/40 transition-colors duration-500">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110">
                    <f.icon size={22} className="text-amber-600" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-gray-900 mb-2.5">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-md">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ CTA ═══════════════════════════ */}
      <section className="py-10 pb-28 px-6 sm:px-10 lg:px-16 bg-gray-50">
        <Reveal>
          <div className="max-w-[1400px] mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gray-950 px-8 py-20 md:px-16 md:py-24 text-center">
              {/* Decorative */}
              <div className="absolute top-[-80px] right-[-80px] w-[350px] h-[350px] rounded-full bg-amber-500/[0.06] blur-[80px] pointer-events-none" />
              <div className="absolute bottom-[-60px] left-[-60px] w-[250px] h-[250px] rounded-full bg-amber-600/[0.04] blur-[60px] pointer-events-none" />

              <div className="relative z-10 max-w-lg mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.06] flex items-center justify-center mx-auto mb-8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </div>

                <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-white tracking-tight mb-4">
                  Rejoignez notre communauté
                </h2>
                <p className="text-sm md:text-base text-white/30 mb-10 leading-relaxed">
                  Arrivages en avant-première, promotions exclusives
                  et conseils d'experts sur notre page Facebook.
                </p>
                <a
                  href="https://www.facebook.com/Garmin.pro.dz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(245,158,11,0.3)]"
                >
                  Suivre sur Facebook
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
