import Link from 'next/link';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center relative z-10">

                {/* Animated Background Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--brand-glow)] blur-[100px] rounded-full opacity-20 pointer-events-none" />

                <div className="glass rounded-[2rem] p-10 border border-[var(--border)] shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 noise opacity-20 pointer-events-none" />

                    <div className="w-24 h-24 mx-auto rounded-3xl bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[var(--error)] mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
                        <AlertTriangle size={48} />
                    </div>

                    <h1 className="font-heading font-black text-6xl text-white mb-2 tracking-tighter">404</h1>
                    <h2 className="font-heading font-bold text-xl text-[var(--brand)] mb-4">Page Introuvable</h2>

                    <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
                        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
                        Il semble que vous ayez pris un mauvais chemin.
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[var(--brand)] text-[#08080F] font-bold text-lg hover:bg-[var(--brand-dark)] hover:shadow-[0_0_20px_rgba(0,212,170,0.3)] transition-all active:scale-[0.98]"
                    >
                        <Home size={20} />
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
