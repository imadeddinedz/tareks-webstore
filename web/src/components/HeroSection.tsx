'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/store/settings';

export function HeroSection() {
    const [loaded, setLoaded] = useState(false);
    const heroImage = useSettingsStore((s) => s.heroImage);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <section className="relative min-h-[85vh] md:min-h-[90vh] overflow-hidden bg-[#0a0a0a]">
            {/* Hero image — full cover, slight zoom on load */}
            <div
                className="absolute inset-0 transition-transform duration-[2000ms] ease-out"
                style={{ transform: loaded ? 'scale(1)' : 'scale(1.05)' }}
            >
                <Image
                    src={heroImage || '/images/hero-bike.jpg'}
                    alt="High Tech Sport — Équipement premium"
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                    quality={85}
                />
            </div>

            {/* Gradient overlays for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
                <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
                    <div className="max-w-xl">
                        {/* Badge */}
                        <div
                            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md mb-8 transition-all duration-700"
                            style={{
                                opacity: loaded ? 1 : 0,
                                transform: loaded ? 'translateY(0)' : 'translateY(20px)',
                                transitionDelay: '300ms',
                            }}
                        >
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            <span className="text-xs font-semibold text-white/90 tracking-wide">Collection 2026</span>
                        </div>

                        {/* Headline */}
                        <h1 className="font-heading font-black text-white leading-[1.05] tracking-[-0.03em] mb-6">
                            <span
                                className="block text-[clamp(2.5rem,7vw,4.5rem)] transition-all duration-700 ease-out"
                                style={{
                                    opacity: loaded ? 1 : 0,
                                    transform: loaded ? 'translateY(0)' : 'translateY(40px)',
                                    transitionDelay: '500ms',
                                }}
                            >
                                Équipement
                            </span>
                            <span
                                className="block text-[clamp(2.5rem,7vw,4.5rem)] text-amber-400 transition-all duration-700 ease-out"
                                style={{
                                    opacity: loaded ? 1 : 0,
                                    transform: loaded ? 'translateY(0)' : 'translateY(40px)',
                                    transitionDelay: '650ms',
                                }}
                            >
                                haute performance.
                            </span>
                        </h1>

                        {/* Paragraph */}
                        <p
                            className="text-base md:text-lg text-white/60 max-w-md mb-10 leading-relaxed transition-all duration-700 ease-out"
                            style={{
                                opacity: loaded ? 1 : 0,
                                transform: loaded ? 'translateY(0)' : 'translateY(30px)',
                                transitionDelay: '800ms',
                            }}
                        >
                            Vélos de route, montres connectées et accessoires premium.
                            Livraison 58 wilayas · Paiement à la livraison.
                        </p>

                        {/* CTAs */}
                        <div
                            className="flex flex-wrap gap-3 transition-all duration-700 ease-out"
                            style={{
                                opacity: loaded ? 1 : 0,
                                transform: loaded ? 'translateY(0)' : 'translateY(30px)',
                                transitionDelay: '950ms',
                            }}
                        >
                            <Link
                                href="/products"
                                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-full transition-all duration-300 hover:shadow-[0_0_50px_rgba(245,158,11,0.4)] active:scale-95"
                            >
                                Voir la collection
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white/15 text-white font-semibold text-sm hover:bg-white/25 backdrop-blur-md transition-all duration-300 border border-white/20"
                            >
                                <MessageCircle size={16} />
                                Nous contacter
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center transition-all duration-700"
                style={{ opacity: loaded ? 0.4 : 0, transitionDelay: '1400ms' }}
            >
                <div className="w-[22px] h-[34px] rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
                    <div className="w-[3px] h-[6px] bg-white/60 rounded-full animate-bounce" style={{ animationDuration: '1.5s' }} />
                </div>
            </div>
        </section>
    );
}
