'use client';

import { useDashboard } from '../DashboardContext';
import TransactionsListWithFilters from '@/components/TransactionsListWithFilters';

export default function EntradasPage() {
  const { products, transactions, users, openTransactionModal } = useDashboard();

  return (
    <TransactionsListWithFilters
      transactions={transactions}
      type="IN"
      productOptions={products.map((p) => ({ id: p.id, name: p.name }))}
      userOptions={users.map((u) => ({ id: u.id, name: u.name }))}
      onNewClick={() => openTransactionModal('IN')}
      newButtonLabel="Nova Entrada"
      title="Registrar Entradas"
      emptyMessage="Nenhuma entrada registrada. Use o botão acima para registrar."
    />
  );
}
