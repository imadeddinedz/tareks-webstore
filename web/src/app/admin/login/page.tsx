'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push('/admin');
                router.refresh();
            } else {
                setError('Mot de passe incorrect');
            }
        } catch {
            setError('Erreur de connexion');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
                        <Lock size={24} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Administration</h1>
                    <p className="text-sm text-gray-400 mt-1">Connectez-vous pour accéder au tableau de bord</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <div className="mb-5">
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Mot de passe</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                placeholder="Entrez le mot de passe admin"
                                autoFocus
                                required
                                className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !password}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-300 mt-6">
                    High Tech Sport · Admin Panel
                </p>
            </div>
        </div>
    );
}
