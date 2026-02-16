import React from 'react';
import { AlertTriangle, CheckCircle2, Package, TrendingDown, TrendingUp } from 'lucide-react';
import { Product } from '@/types';

interface DashboardProps {
  products: Product[];
  onOpenTransaction: (type: 'IN' | 'OUT') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ products, onOpenTransaction }) => {
  // Sort products: Critical stock first
  const sortedProducts = [...products].sort((a, b) => {
    const aCritical = a.quantity <= a.minThreshold;
    const bCritical = b.quantity <= b.minThreshold;
    if (aCritical && !bCritical) return -1;
    if (!aCritical && bCritical) return 1;
    return 0;
  });

  return (
    <div className="space-y-8">
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onOpenTransaction('OUT')}
          className="group relative flex flex-col items-center justify-center p-6 bg-white border-2 border-rose-100 rounded-2xl shadow-sm hover:border-rose-500 hover:shadow-md transition-all active:scale-[0.98]"
        >
          <div className="w-12 h-12 mb-3 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
            <TrendingDown size={24} />
          </div>
          <span className="font-bold text-slate-800 text-lg">Registrar Retirada</span>
          <span className="text-xs text-slate-500 mt-1">Uso de material</span>
        </button>

        <button
          onClick={() => onOpenTransaction('IN')}
          className="group relative flex flex-col items-center justify-center p-6 bg-white border-2 border-emerald-100 rounded-2xl shadow-sm hover:border-emerald-500 hover:shadow-md transition-all active:scale-[0.98]"
        >
          <div className="w-12 h-12 mb-3 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <TrendingUp size={24} />
          </div>
          <span className="font-bold text-slate-800 text-lg">Registrar Entrada</span>
          <span className="text-xs text-slate-500 mt-1">Reposição de estoque</span>
        </button>
      </div>

      {/* Stock Status */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Status do Estoque</h2>
          <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {products.length} Itens
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProducts.map((product) => {
            const isCritical = product.quantity <= product.minThreshold;
            
            return (
              <div
                key={product.id}
                className={`relative overflow-hidden p-5 rounded-xl border transition-all ${
                  isCritical
                    ? 'bg-rose-50/50 border-rose-200 shadow-sm'
                    : 'bg-white border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-lg ${isCritical ? 'bg-white text-rose-600' : 'bg-slate-50 text-slate-600'}`}>
                    <Package size={20} />
                  </div>
                  {isCritical ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-white px-2 py-1 rounded-full border border-rose-100">
                      <AlertTriangle size={12} />
                      CRÍTICO
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                      <CheckCircle2 size={12} />
                      NORMAL
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-800 text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{product.category}</p>

                <div className="flex items-end justify-between">
                  <div>
                    <span className={`text-2xl font-bold ${isCritical ? 'text-rose-600' : 'text-slate-900'}`}>
                      {product.quantity}
                    </span>
                    <span className="text-sm text-slate-500 ml-1">{product.unit}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Min: {product.minThreshold}
                  </div>
                </div>

                {/* Progress bar for visualization */}
                <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${isCritical ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, (product.quantity / (product.minThreshold * 2)) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;