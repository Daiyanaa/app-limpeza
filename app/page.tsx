'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, LogIn } from 'lucide-react';
import { api } from '@/lib/api';
import type { User } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.getUsers().then(setUsers).catch(() => setUsers([]));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!userId) {
      setError('Selecione um usuário.');
      return;
    }
    if (!password.trim()) {
      setError('Digite a senha.');
      return;
    }
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('logged', 'true');
      sessionStorage.setItem('userId', user.id);
      sessionStorage.setItem('userName', user.name);
      sessionStorage.setItem('userRole', user.role);
    }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 font-sans text-slate-900">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-indigo-600 p-3 rounded-xl">
            <LayoutDashboard className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-500">
            CleanStock
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <LogIn size={20} className="text-indigo-600" />
            Entrar
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="user" className="block text-sm font-medium text-slate-700 mb-1.5">
                Usuário
              </label>
              <select
                id="user"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              >
                <option value="">Selecione...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>

            {error && (
              <p className="text-sm text-rose-600 bg-rose-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            >
              Entrar
            </button>
          </form>

          <p className="mt-4 text-xs text-slate-400 text-center">
            Demo: selecione um usuário e digite qualquer senha.
          </p>
        </div>
      </div>
    </div>
  );
}
