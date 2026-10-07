'use client';

import { useState } from 'react';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const payload = await response.json().catch(() => ({ message: 'Unable to sign in.' }));

    if (!response.ok) {
      setError(payload.message || 'Invalid credentials.');
      setLoading(false);
      return;
    }

    window.location.href = '/admin/dishes';
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cream via-paper to-gold/30 px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] border-[3px] border-leaf-deep/80 bg-cream p-7 shadow-card">
        <div className="mb-6 text-center">
          <p className="inline-block rounded-full border-2 border-leaf-deep/20 bg-leaf/10 px-4 py-1.5 text-[0.7rem] font-extrabold uppercase tracking-[0.28em] text-leaf-deep">
            Admin access
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold text-leaf-deep">Attil Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-extrabold uppercase tracking-[0.14em] text-leaf-deep/70">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border-2 border-leaf-deep/20 bg-white px-4 py-3 text-base font-semibold text-leaf-deep outline-none transition focus:border-leaf focus:ring-4 focus:ring-gold/30"
              placeholder="you@attil.com"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-extrabold uppercase tracking-[0.14em] text-leaf-deep/70">Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border-2 border-leaf-deep/20 bg-white px-4 py-3 text-base font-semibold text-leaf-deep outline-none transition focus:border-leaf focus:ring-4 focus:ring-gold/30"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <div className="rounded-2xl border-2 border-red-500/70 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full border-[2.5px] border-leaf-deep bg-gold px-5 py-3 text-base font-extrabold uppercase tracking-[0.14em] text-leaf-deep shadow-[0_4px_0_rgba(31,61,15,0.9)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  );
}
