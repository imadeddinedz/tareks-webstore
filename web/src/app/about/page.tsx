import Image from 'next/image';
import Link from 'next/link';
import { Target, Users, Gem } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[var(--bg)] pb-24">
            {/* Hero */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity grayscale"
                    style={{ backgroundImage: 'url("/images/hero-watches.png")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/80 to-[rgba(0,212,170,0.1)] z-0" />
                <div className="absolute inset-0 noise opacity-20" />

                <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-[rgba(0,212,170,0.1)] border border-[rgba(0,212,170,0.2)] text-[var(--brand)] text-sm font-bold tracking-widest uppercase mb-6 animate-slide-up">
                        À Propos de Nous
                    </span>
                    <h1 className="font-heading font-black text-5xl md:text-7xl text-white mb-6 tracking-tight animate-slide-up stagger-1">
                        Redéfinir le Sport <br /><span className="gradient-text">en Algérie</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-[var(--text-secondary)] font-body max-w-2xl mx-auto animate-slide-up stagger-2">
                        Notre mission est de fournir aux athlètes algériens les meilleurs équipements du monde.
                    </p>
                </div>
            </section>

            {/* Story */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-20">
                <div className="glass rounded-[2rem] p-8 md:p-16 border border-[var(--border)] shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-6">Notre Histoire</h2>
                            <div className="space-y-6 text-[var(--text-secondary)] leading-relaxed text-lg">
                                <p>
                                    Fondée par des passionnés de cyclisme et de randonnée, <strong>High Tech Sport</strong> est née d'un constat simple : il était souvent difficile de trouver du matériel haut de gamme et original en Algérie.
                                </p>
                                <p>
                                    Basés à Khemis Miliana, nous avons commencé par distribuer des montres intelligentes pour sportifs. Aujourd'hui, nous sommes fiers d'être l'une des destinations privilégiées pour les équipements Garmin ainsi que pour des vélos en fibre de carbone importés directement des meilleurs fabricants asiatiques et européens.
                                </p>
                                <p className="text-white font-medium pl-6 border-l-2 border-[var(--brand)]">
                                    "Excellence, fiabilité, et proximité avec la communauté sportive algérienne."
                                </p>
                            </div>
                        </div>
                        <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-[var(--surface)] group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand)] to-[var(--accent)] opacity-20 group-hover:opacity-40 transition-opacity z-10 mix-blend-overlay" />
                            <Image
                                src="/images/prod-bike.png"
                                alt="Notre boutique"
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-heading font-bold text-3xl md:text-4xl text-white">Nos Valeurs</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Gem,
                            title: "Qualité Premium",
                            desc: "Nous ne proposons que des produits 100% originaux, testés et approuvés par des professionnels."
                        },
                        {
                            icon: Users,
                            title: "Service Client",
                            desc: "Notre équipe vous accompagne avant, pendant et après votre achat. Nous sommes des sportifs qui conseillent des sportifs."
                        },
                        {
                            icon: Target,
                            title: "Transparence",
                            desc: "Paiement à la livraison, garantie constructeur claire, aucun frais caché. Une confiance absolue."
                        }
                    ].map((val, i) => (
                        <div key={i} className="p-10 rounded-3xl glass hover:bg-[var(--surface)] transition-colors border border-[var(--border)] group">
                            <div className="w-14 h-14 rounded-2xl bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[var(--brand)] mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-transform shadow-lg">
                                <val.icon size={28} />
                            </div>
                            <h3 className="font-heading font-bold text-xl text-white mb-4">{val.title}</h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed">{val.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
