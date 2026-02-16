import React from 'react';
import { ArrowDown, ArrowUp, Clock, Package } from 'lucide-react';
import { Transaction } from '@/types';

interface HistoryListProps {
  transactions: Transaction[];
}

const HistoryList: React.FC<HistoryListProps> = ({ transactions }) => {
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
          <Clock className="text-slate-400" />
        </div>
        <p className="text-slate-500">Nenhuma movimentação registrada.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <Clock className="w-5 h-5 text-slate-500" />
        <h3 className="font-semibold text-slate-800">Últimas Movimentações</h3>
      </div>
      
      <div className="divide-y divide-slate-100">
        {transactions.map((t) => (
          <div key={t.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  t.type === 'IN' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                }`}
              >
                {t.type === 'IN' ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
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
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${
                  t.type === 'IN'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700'
                }`}
              >
                {t.type === 'IN' ? 'ENTRADA' : 'SAÍDA'}
              </span>
              <p className="text-xs text-slate-400 mt-1">{formatDate(t.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;