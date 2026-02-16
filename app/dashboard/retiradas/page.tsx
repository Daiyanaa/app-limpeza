'use client';

import { useDashboard } from '../DashboardContext';
import TransactionsListWithFilters from '@/components/TransactionsListWithFilters';

export default function RetiradasPage() {
  const { products, transactions, users, openTransactionModal } = useDashboard();

  return (
    <TransactionsListWithFilters
      transactions={transactions}
      type="OUT"
      productOptions={products.map((p) => ({ id: p.id, name: p.name }))}
      userOptions={users.map((u) => ({ id: u.id, name: u.name }))}
      onNewClick={() => openTransactionModal('OUT')}
      newButtonLabel="Nova Retirada"
      title="Registrar Retiradas"
      emptyMessage="Nenhuma retirada registrada. Use o botão acima para registrar."
    />
  );
}
