'use client';

import React, { useState } from 'react';
import { useDashboard } from '../DashboardContext';
import { Users, Plus, Shield, UserCircle, Trash2 } from 'lucide-react';
import type { User } from '@/types';

export default function FuncionariosPage() {
  const { users, addUser, deleteUser } = useDashboard();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Admin' | 'Staff'>('Staff');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Informe o nome do funcionário.');
      return;
    }

    try {
      await addUser({ name: trimmedName, role });
      setName('');
      setRole('Staff');
      setIsFormOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
    }
  };

  const openForm = () => {
    setError('');
    setName('');
    setRole('Staff');
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setError('');
  };

  const handleDelete = async (u: User) => {
    if (!window.confirm(`Excluir o funcionário "${u.name}"? Esta ação não pode ser desfeita.`)) return;
    setError('');
    try {
      await deleteUser(u.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir.');
    }
  };

  return (
    <div className="space-y-6">
      {error && !isFormOpen && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
          {error}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Funcionários</h1>
            <p className="text-sm text-slate-500">Cadastro de funcionários do estoque</p>
          </div>
        </div>
        <button
          onClick={openForm}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all active:scale-[0.98]"
        >
          <Plus size={20} />
          Novo funcionário
        </button>
      </div>

      {/* Formulário */}
      {isFormOpen && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Cadastrar funcionário</h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João da Silva"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Função</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'Admin' | 'Staff')}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
              >
                <option value="Staff">Staff (Funcionário)</option>
                <option value="Admin">Admin (Administrador)</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
              >
                Salvar funcionário
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de funcionários */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="font-semibold text-slate-800">Cadastrados</span>
          <span className="text-sm text-slate-500">{users.length} funcionário(s)</span>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Nenhum funcionário cadastrado.</p>
            <p className="text-sm text-slate-400 mt-1">
              Clique em &quot;Novo funcionário&quot; para adicionar.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <UserCircle size={22} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{u.name}</p>
                    <p className="text-sm text-slate-500">
                      {u.role === 'Admin' ? 'Administrador' : 'Funcionário'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                      u.role === 'Admin'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {u.role === 'Admin' ? <Shield size={12} /> : null}
                    {u.role}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(u)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Excluir funcionário"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
