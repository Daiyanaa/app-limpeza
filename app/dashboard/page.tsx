'use client';

import Dashboard from '@/components/Dashboard';
import HistoryList from '@/components/HistoryList';
import { useDashboard } from './DashboardContext';

export default function DashboardPage() {
  const { products, transactions, openTransactionModal } = useDashboard();

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <section>
        <Dashboard products={products} onOpenTransaction={openTransactionModal} />
      </section>
      <section>
        <HistoryList transactions={transactions} />
      </section>
    </div>
  );
}
