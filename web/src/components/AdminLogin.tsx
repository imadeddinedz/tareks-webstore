'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.ok) {
      router.push('/admin/products');
      router.refresh();
    } else {
      setError('Mot de passe incorrect');
    }
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-amber-900/20 bg-slate-800/50 p-8">
      <h1 className="mb-6 text-xl font-bold text-amber-50">Connexion admin</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          className="w-full rounded-lg border border-amber-900/30 bg-slate-900 px-4 py-2 text-amber-50 placeholder:text-amber-50/40"
          required
        />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-500"
        >
          Connexion
        </button>
      </form>
    </div>
  );
}
