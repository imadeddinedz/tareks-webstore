import { ShieldCheck, ArrowRightLeft, Clock, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ReturnsPage() {
    return (
        <div className="min-h-screen bg-[var(--bg)] pt-12 pb-24 noise relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--brand-glow)] rounded-full blur-[100px] opacity-20 pointer-events-none translate-x-1/2 -translate-y-1/2" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl glass bg-[rgba(255,107,53,0.1)] text-[var(--accent)] mb-6 shadow-[0_0_30px_rgba(255,107,53,0.2)] rotate-12">
                        <ArrowRightLeft size={36} />
                    </div>
                    <h1 className="font-heading font-black text-4xl md:text-5xl text-white mb-4 tracking-tight">Retours & Garantie</h1>
                    <p className="text-xl text-[var(--text-secondary)]">Achetez en toute sérénité. Votre satisfaction est notre priorité absolue.</p>
                </div>

                {/* Content */}
                <div className="glass rounded-[2rem] p-8 md:p-12 border border-[var(--border)] shadow-2xl space-y-12">

                    <section>
                        <h2 className="font-heading font-bold text-2xl text-white flex items-center gap-3 mb-4">
                            <ShieldCheck className="text-[var(--brand)]" />
                            Garantie Constructeur Officielle
                        </h2>
                        <p className="text-[var(--text-secondary)] leading-relaxed">
                            Tous nos produits high-tech (montres connectées, GPS, etc.) sont garantis <strong className="text-white font-medium">12 mois</strong> contre tout défaut de fabrication. La garantie entre en vigueur dès la date de réception de votre commande. En cas de dysfonctionnement technique non lié à une mauvaise utilisation, nous nous chargeons de la réparation ou du remplacement via le service après-vente agréé.
                        </p>
                    </section>

                    <div className="h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

                    <section>
                        <h2 className="font-heading font-bold text-2xl text-white flex items-center gap-3 mb-4">
                            <Clock className="text-[var(--accent)]" />
                            Politique de Retour
                        </h2>
                        <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                            Vous avez changé d'avis ? Vous disposez d'un délai de <strong className="text-[var(--accent)] font-bold">3 jours</strong> après la réception pour demander un retour ou un échange.
                        </p>
                        <div className="p-6 rounded-2xl bg-[var(--surface)]/50 border border-[var(--border)] mt-6">
                            <h3 className="font-bold text-white mb-3">Conditions d'éligibilité au retour :</h3>
                            <ul className="space-y-3 text-[var(--text-secondary)]">
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] mt-2 shrink-0" />
                                    <span>Le produit doit être <strong>rigoureusement neuf</strong>, jamais utilisé.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] mt-2 shrink-0" />
                                    <span>Le blister et l'emballage d'origine doivent être <strong>intacts et non ouverts</strong>.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] mt-2 shrink-0" />
                                    <span>Tous les accessoires, notices et étiquettes doivent être présents.</span>
                                </li>
                            </ul>
                        </div>
                        <p className="text-sm text-[var(--text-muted)] mt-4 italic">
                            * Les frais de retour via la société de livraison sont à la charge du client (sauf erreur de notre part).
                        </p>
                    </section>

                    <div className="h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

                    <section className="text-center pt-4">
                        <h2 className="font-heading font-bold text-2xl text-white mb-4">Comment initier un retour ?</h2>
                        <p className="text-[var(--text-secondary)] mb-8">
                            Contactez directement notre service client via WhatsApp en envoyant votre numéro de commande et le motif du retour.
                        </p>
                        <a
                            href="https://wa.me/213555555555"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-bold rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)]"
                        >
                            <Smartphone size={20} />
                            Assistance WhatsApp
                        </a>
                    </section>

                </div>
            </div>
        </div>
    );
}
