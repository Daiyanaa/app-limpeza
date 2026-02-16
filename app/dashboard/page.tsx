'use client';

import Dashboard from '@/components/Dashboard';
import HistoryList from '@/components/HistoryList';
import LowStockSidebar from '@/components/LowStockSidebar';
import { useDashboard } from './DashboardContext';

export default function DashboardPage() {
  const { products, transactions, openTransactionModal } = useDashboard();

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full max-w-7xl mx-auto">
      <div className="min-w-0 flex-1 space-y-10">
        <section>
          <Dashboard products={products} onOpenTransaction={openTransactionModal} />
        </section>
        <section>
          <HistoryList transactions={transactions} />
        </section>
      </div>
      <LowStockSidebar products={products} />
    </div>
  );
}
