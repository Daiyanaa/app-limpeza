'use client';

import React from 'react';
import { Package, AlertTriangle } from 'lucide-react';
import { Product } from '@/types';

const LIMIT = 10;

interface LowStockSidebarProps {
  products: Product[];
}

const LowStockSidebar: React.FC<LowStockSidebarProps> = ({ products }) => {
  const sorted = [...products]
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, LIMIT);

  if (sorted.length === 0) {
    return (
      <aside className="w-full lg:w-72 shrink-0">
        <div className="lg:sticky lg:top-24 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
            <Package size={18} />
            Menor estoque
          </h3>
          <p className="text-sm text-slate-500">Nenhum produto cadastrado.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="lg:sticky lg:top-24 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <Package size={18} />
            Menor estoque
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Ordenado por quantidade (crescente)</p>
        </div>
        <ul className="divide-y divide-slate-100 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {sorted.map((product, index) => {
            const isCritical = product.quantity <= product.minThreshold;
            return (
              <li
                key={product.id}
                className={`px-4 py-3 transition-colors ${
                  isCritical ? 'bg-rose-50/30 hover:bg-rose-50/50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate" title={product.name}>
                      {product.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      <span className={isCritical ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
                        {product.quantity}
                      </span>
                      <span className="text-slate-400"> {product.unit}</span>
                      <span className="text-slate-400"> · min {product.minThreshold}</span>
                    </p>
                  </div>
                  {isCritical && (
                    <span className="shrink-0 flex items-center text-rose-600" title="Estoque crítico">
                      <AlertTriangle size={16} />
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default LowStockSidebar;
