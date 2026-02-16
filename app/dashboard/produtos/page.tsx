'use client';

import React, { useState } from 'react';
import { useDashboard } from '../DashboardContext';
import { Package, Plus, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { Product } from '@/types';

const CATEGORIAS_SUGERIDAS = ['Químicos', 'Descartáveis', 'EPI', 'Higiene', 'Outros'];
const UNIDADES_COMUNS = ['unidades', 'litros', 'galões', 'fardos', 'caixas', 'refis', 'kg'];

export default function ProdutosPage() {
  const { products, addProduct } = useDashboard();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [minThreshold, setMinThreshold] = useState(1);
  const [unit, setUnit] = useState('unidades');
  const [category, setCategory] = useState('');
  const [customUnit, setCustomUnit] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Informe o nome do produto.');
      return;
    }
    if (quantity < 0) {
      setError('A quantidade não pode ser negativa.');
      return;
    }
    if (minThreshold < 0) {
      setError('O estoque mínimo não pode ser negativo.');
      return;
    }
    const trimmedUnit = (unit === 'outro' ? customUnit : unit).trim();
    if (!trimmedUnit) {
      setError('Informe a unidade.');
      return;
    }
    const trimmedCategory = category.trim();
    if (!trimmedCategory) {
      setError('Informe a categoria.');
      return;
    }

    try {
      await addProduct({
        name: trimmedName,
        quantity,
        minThreshold,
        unit: trimmedUnit,
        category: trimmedCategory,
      });
      setName('');
      setQuantity(0);
      setMinThreshold(1);
      setUnit('unidades');
      setCategory('');
      setCustomUnit('');
      setIsFormOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
    }
  };

  const openForm = () => {
    setError('');
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50">
            <Package className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Produtos</h1>
            <p className="text-sm text-slate-500">Gerencie os itens do seu estoque</p>
          </div>
        </div>
        <button
          onClick={openForm}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all active:scale-[0.98]"
        >
          <Plus size={20} />
          Novo produto
        </button>
      </div>

      {/* Formulário (modal ou painel) */}
      {isFormOpen && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Inserir produto</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Detergente Neutro 5L"
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Quantidade inicial</label>
                <input
                  type="number"
                  min="0"
                  value={quantity === 0 ? '' : quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estoque mínimo (alerta)</label>
                <input
                  type="number"
                  min="0"
                  value={minThreshold}
                  onChange={(e) => setMinThreshold(Number(e.target.value) || 0)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Unidade</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                >
                  {UNIDADES_COMUNS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                  <option value="outro">Outra</option>
                </select>
                {unit === 'outro' && (
                  <input
                    type="text"
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value)}
                    placeholder="Digite a unidade"
                    className="w-full mt-2 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  list="categorias-list"
                  placeholder="Ex: Químicos"
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
                <datalist id="categorias-list">
                  {CATEGORIAS_SUGERIDAS.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
              >
                Salvar produto
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

      {/* Lista de produtos */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="font-semibold text-slate-800">Itens no estoque</span>
          <span className="text-sm text-slate-500">{products.length} produto(s)</span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Nenhum produto cadastrado.</p>
            <p className="text-sm text-slate-400 mt-1">
              Clique em &quot;Novo produto&quot; para adicionar itens ao estoque.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {products.map((p) => {
              const isCritical = p.quantity <= p.minThreshold;
              return (
                <div
                  key={p.id}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                    isCritical ? 'bg-rose-50/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isCritical ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Package size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">{p.name}</p>
                      <p className="text-sm text-slate-500">{p.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right sm:text-center">
                      <p className="text-lg font-bold text-slate-900">{p.quantity}</p>
                      <p className="text-xs text-slate-500">{p.unit}</p>
                    </div>
                    <div className="text-sm text-slate-500">
                      Mín: {p.minThreshold}
                    </div>
                    {isCritical ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                        <AlertTriangle size={12} />
                        Crítico
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        <CheckCircle2 size={12} />
                        Normal
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
