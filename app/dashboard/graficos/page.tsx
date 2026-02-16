'use client';

import React, { useMemo, useState, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useDashboard } from '../DashboardContext';
import { BarChart3, Calendar, RotateCcw } from 'lucide-react';

const COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6',
];

function toDateOnly(iso: string): string {
  return iso.slice(0, 10);
}

export default function GraficosPage() {
  const { products, transactions } = useDashboard();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const setPeriod = useCallback((from: string, to: string) => {
    setDateFrom(from);
    setDateTo(to);
  }, []);

  const outTransactions = useMemo(() => {
    const out = transactions.filter((t) => t.type === 'OUT');
    if (!dateFrom && !dateTo) return out;
    return out.filter((t) => {
      const d = toDateOnly(t.date);
      if (dateFrom && d < dateFrom) return false;
      if (dateTo && d > dateTo) return false;
      return true;
    });
  }, [transactions, dateFrom, dateTo]);

  const productById = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products]
  );

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of outTransactions) {
      const product = productById.get(t.productId);
      const category = product?.category ?? 'Outros';
      map.set(category, (map.get(category) ?? 0) + t.quantity);
    }
    return Array.from(map.entries())
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity);
  }, [outTransactions, productById]);

  const byProduct = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of outTransactions) {
      const key = t.productName;
      map.set(key, (map.get(key) ?? 0) + t.quantity);
    }
    return Array.from(map.entries())
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 12);
  }, [outTransactions]);

  const byUser = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of outTransactions) {
      const key = t.userName;
      map.set(key, (map.get(key) ?? 0) + t.quantity);
    }
    return Array.from(map.entries())
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity);
  }, [outTransactions]);

  const hasData = outTransactions.length > 0;

  const today = useMemo(() => {
    const t = new Date();
    return t.toISOString().slice(0, 10);
  }, []);

  const setLast7Days = useCallback(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 6);
    setPeriod(start.toISOString().slice(0, 10), end.toISOString().slice(0, 10));
  }, [setPeriod]);

  const setThisMonth = useCallback(() => {
    const d = new Date();
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    setPeriod(start.toISOString().slice(0, 10), today);
  }, [today, setPeriod]);

  const setLastMonth = useCallback(() => {
    const d = new Date();
    const start = new Date(d.getFullYear(), d.getMonth() - 1, 1);
    const end = new Date(d.getFullYear(), d.getMonth(), 0);
    setPeriod(start.toISOString().slice(0, 10), end.toISOString().slice(0, 10));
  }, [setPeriod]);

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600">
          <BarChart3 size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gráficos de uso</h1>
          <p className="text-sm text-slate-500">
            Uso (retiradas) por categoria, produto e quem utilizou
          </p>
        </div>
      </div>

      {/* Filtro por período */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Calendar size={20} className="text-indigo-500" />
            <span>Período das retiradas</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <span>De</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <span>Até</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                max={today}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={setLast7Days}
              className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Últimos 7 dias
            </button>
            <button
              type="button"
              onClick={setThisMonth}
              className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Este mês
            </button>
            <button
              type="button"
              onClick={setLastMonth}
              className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Mês passado
            </button>
            <button
              type="button"
              onClick={() => setPeriod('', '')}
              className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw size={14} />
              Limpar
            </button>
          </div>
        </div>
        {(dateFrom || dateTo) && (
          <p className="mt-3 text-xs text-slate-500">
            Exibindo retiradas de {dateFrom || '...'} até {dateTo || '...'}.
            {outTransactions.length === 0 && ' Nenhuma retirada neste período.'}
          </p>
        )}
      </section>

      {!hasData ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <BarChart3 size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-600 font-medium">
            {(dateFrom || dateTo) ? 'Nenhuma retirada neste período' : 'Nenhuma retirada registrada'}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {(dateFrom || dateTo)
              ? 'Tente outro período ou limpe o filtro para ver todos os dados.'
              : 'Os gráficos aparecerão quando houver movimentações do tipo "Retirada".'}
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Por categoria */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Uso por categoria</h2>
            {byCategory.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byCategory} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      angle={byCategory.length > 5 ? -35 : 0}
                      textAnchor={byCategory.length > 5 ? 'end' : 'middle'}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value: number) => [value, 'Quantidade']}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                    />
                    <Bar dataKey="quantity" fill="#6366f1" radius={[4, 4, 0, 0]} name="Quantidade" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Sem dados por categoria.</p>
            )}
          </section>

          {/* Por produto (tipo de produto) */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Uso por produto</h2>
            {byProduct.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byProduct} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" width={95} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value: number) => [value, 'Quantidade']}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                    />
                    <Bar dataKey="quantity" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Quantidade" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Sem dados por produto.</p>
            )}
          </section>

          {/* Quem usou */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Uso por funcionário</h2>
            {byUser.length > 0 ? (
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="h-80 flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={byUser} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        angle={byUser.length > 4 ? -25 : 0}
                        textAnchor={byUser.length > 4 ? 'end' : 'middle'}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(value: number) => [value, 'Quantidade']}
                        contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                      />
                      <Bar dataKey="quantity" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Quantidade" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-80 w-full lg:w-80 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={byUser}
                        dataKey="quantity"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {byUser.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [value, 'Quantidade']}
                        contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Sem dados por funcionário.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
