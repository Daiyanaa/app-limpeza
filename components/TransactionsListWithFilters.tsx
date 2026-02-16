'use client';

import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Clock, Package, Filter, Search } from 'lucide-react';
import type { Transaction } from '@/types';

interface TransactionsListWithFiltersProps {
  transactions: Transaction[];
  type: 'IN' | 'OUT';
  productOptions: { id: string; name: string }[];
  userOptions: { id: string; name: string }[];
  onNewClick: () => void;
  newButtonLabel: string;
  title: string;
  emptyMessage?: string;
}

export default function TransactionsListWithFilters({
  transactions,
  type,
  productOptions,
  userOptions,
  onNewClick,
  newButtonLabel,
  title,
  emptyMessage = 'Nenhuma movimentação registrada.',
}: TransactionsListWithFiltersProps) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [productId, setProductId] = useState('');
  const [userId, setUserId] = useState('');
  const [searchText, setSearchText] = useState('');

  const filtered = useMemo(() => {
    let list = transactions.filter((t) => t.type === type);

    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      list = list.filter((t) => new Date(t.date) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      list = list.filter((t) => new Date(t.date) <= to);
    }
    if (productId) list = list.filter((t) => t.productId === productId);
    if (userId) list = list.filter((t) => t.userId === userId);
    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.productName.toLowerCase().includes(q) || t.userName.toLowerCase().includes(q)
      );
    }

    return list;
  }, [transactions, type, dateFrom, dateTo, productId, userId, searchText]);

  const formatDate = (isoDate: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(isoDate));
  };

  const isEntry = type === 'IN';
  const colorBg = isEntry ? 'bg-emerald-50' : 'bg-rose-50';
  const colorBorder = isEntry ? 'border-emerald-200' : 'border-rose-200';
  const colorIcon = isEntry ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600';
  const colorBadge = isEntry ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700';
  const colorButton = isEntry
    ? 'bg-emerald-600 hover:bg-emerald-700'
    : 'bg-rose-600 hover:bg-rose-700';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        <button
          onClick={onNewClick}
          className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white shadow-md transition-all active:scale-[0.98] ${colorButton}`}
        >
          {isEntry ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
          {newButtonLabel}
        </button>
      </div>

      {/* Filtros */}
      <div className={`rounded-xl border ${colorBorder} ${colorBg} p-4`}>
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-slate-600" />
          <span className="font-semibold text-slate-700">Filtros</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Data de</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg bg-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Data até</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg bg-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Produto</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg bg-white text-sm"
            >
              <option value="">Todos</option>
              {productOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Responsável</label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg bg-white text-sm"
            >
              <option value="">Todos</option>
              {userOptions.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Buscar</label>
            <div className="relative">
              <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Produto ou pessoa..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-9 pr-3 p-2 border border-slate-200 rounded-lg bg-white text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className={`p-4 border-b border-slate-100 flex items-center justify-between ${colorBg}`}>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-slate-800">{title}</h3>
          </div>
          <span className="text-sm text-slate-500">{filtered.length} registro(s)</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="text-slate-400" />
            </div>
            <p className="text-slate-500">{emptyMessage}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorIcon}`}>
                    {isEntry ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{t.productName}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Package size={12} />
                        {t.quantity} un
                      </span>
                      <span>•</span>
                      <span>{t.userName}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${colorBadge}`}>
                    {isEntry ? 'ENTRADA' : 'SAÍDA'}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(t.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
