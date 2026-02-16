'use client';

import React, { useMemo } from 'react';
import { useDashboard } from '../DashboardContext';
import { ShoppingCart, Package, AlertTriangle } from 'lucide-react';

export default function ListaPedidoPage() {
  const { products } = useDashboard();

  const listaPedido = useMemo(() => {
    return [...products]
      .filter((p) => p.quantity <= p.minThreshold)
      .sort((a, b) => a.quantity - b.quantity);
  }, [products]);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
          <ShoppingCart size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Lista para próximo pedido</h1>
          <p className="text-sm text-slate-500">
            Produtos com estoque no mínimo ou abaixo — use esta lista para repor
          </p>
        </div>
      </div>

      {listaPedido.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <Package size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-600 font-medium">Nenhum produto na lista</p>
          <p className="text-sm text-slate-500 mt-1">
            Todos os produtos estão acima do estoque mínimo. Quando algum chegar no mínimo, ele aparecerá aqui.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-amber-50/50">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-amber-700">{listaPedido.length}</span>
              {listaPedido.length === 1 ? ' produto ' : ' produtos '}
              com estoque no mínimo
            </p>
          </div>
          <ul className="divide-y divide-slate-100">
            {listaPedido.map((product) => {
              const falta = Math.max(0, product.minThreshold - product.quantity);
              const sugerido = Math.max(falta, product.minThreshold);
              return (
                <li
                  key={product.id}
                  className="flex items-center gap-4 px-4 py-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 text-amber-600">
                    <AlertTriangle size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-800">{product.name}</p>
                    <p className="text-sm text-slate-500">
                      {product.category} · Estoque atual: <span className="font-medium text-amber-600">{product.quantity}</span>
                      {product.unit} (mín: {product.minThreshold} {product.unit})
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-slate-700">
                      Sugestão: {sugerido.toFixed(sugerido % 1 ? 2 : 0)} {product.unit}
                    </p>
                    {falta > 0 && (
                      <p className="text-xs text-amber-600">Faltam {falta.toFixed(falta % 1 ? 2 : 0)} para o mínimo</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
