'use client';

import Link from 'next/link';
import { HelpCircle, ChevronRight, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
    {
        question: "Comment fonctionne le paiement à la livraison (COD) ?",
        answer: "C'est très simple et 100% sécurisé. Vous passez votre commande sur le site sans rien payer. Notre équipe vous appelle pour confirmer, puis nous expédions le colis. Vous payez en espèces directement au livreur uniquement lorsque vous recevez votre commande entre vos mains."
    },
    {
        question: "Quels sont les délais et tarifs de livraison ?",
        answer: "Nous expédions vers les 58 wilayas d'Algérie. La livraison prend généralement 24h à 48h pour Alger et ses environs, 2 à 3 jours pour les villes du Nord, et 4 à 6 jours pour le Grand Sud. Les tarifs varient de 400 DA à 1200 DA selon la wilaya. Le tarif exact est calculé lors de la commande."
    },
    {
        question: "Les produits sont-ils originaux et garantis ?",
        answer: "Absolument. Tous nos produits (montres Garmin, Apple, vélos, etc.) sont 100% originaux, neufs sous blister, et bénéficient d'une garantie constructeur. Nous sommes une boutique sérieuse basée à Khemis Miliana."
    },
    {
        question: "Puis-je annuler ou modifier ma commande ?",
        answer: "Oui, vous pouvez annuler ou modifier votre commande tant qu'elle n'a pas été expédiée. Il suffit de nous contacter rapidement via WhatsApp au 05 55 55 55 55 en mentionnant votre numéro de commande."
    },
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number>(0);

    return (
        <div className="min-h-screen bg-[var(--bg)] pt-12 pb-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16 relative">
                    <div className="w-20 h-20 mx-auto rounded-full bg-[rgba(0,212,170,0.1)] flex items-center justify-center text-[var(--brand)] mb-6 shadow-[0_0_30px_rgba(0,212,170,0.2)]">
                        <HelpCircle size={40} />
                    </div>
                    <h1 className="font-heading font-black text-4xl md:text-5xl text-[var(--text)] mb-4 tracking-tight">Questions Fréquentes</h1>
                    <p className="text-xl text-[var(--text-secondary)]">Tout ce que vous devez savoir sur nos services.</p>
                </div>

                {/* Accordion */}
                <div className="space-y-4 mb-16">
                    {FAQS.map((faq, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "glass rounded-2xl overflow-hidden transition-all duration-300 border",
                                openIndex === idx ? "border-[var(--brand)] bg-[rgba(0,212,170,0.02)]" : "border-[var(--border)] hover:border-[var(--text-muted)]"
                            )}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className={cn("font-bold text-lg", openIndex === idx ? "text-[var(--brand)]" : "text-[var(--text)]")}>
                                    {faq.question}
                                </span>
                                <ChevronRight
                                    size={20}
                                    className={cn(
                                        "text-[var(--text-muted)] transition-transform duration-300",
                                        openIndex === idx ? "rotate-90 text-[var(--brand)]" : ""
                                    )}
                                />
                            </button>

                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-6 pt-0 text-[var(--text-secondary)] leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center p-10 glass rounded-3xl border border-[var(--border)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-elevated)] to-transparent opacity-50" />
                    <div className="relative z-10">
                        <MessageCircle size={32} className="mx-auto text-[var(--accent)] mb-4" />
                        <h2 className="font-heading font-bold text-2xl text-[var(--text)] mb-2">Encore une question ?</h2>
                        <p className="text-[var(--text-secondary)] mb-6">Notre équipe est disponible sur WhatsApp pour vous aider.</p>
                        <a
                            href="https://wa.me/213555555555"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--brand)] text-[#08080F] font-bold rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,212,170,0.3)] hover:shadow-[0_0_30px_rgba(0,212,170,0.5)] active:scale-95"
                        >
                            Contacter le support <ChevronRight size={18} />
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}
