'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Product, Transaction, TransactionFormData, TransactionType, User } from '@/types';
import TransactionForm from '@/components/TransactionForm';

type OpenTransactionModal = (type: TransactionType) => void;

interface DashboardContextValue {
  products: Product[];
  transactions: Transaction[];
  openTransactionModal: OpenTransactionModal;
  registerTransaction: (data: TransactionFormData) => Promise<void>;
  registerTransactions: (data: TransactionFormData[]) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  users: User[];
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{ open: boolean; type: TransactionType }>({
    open: false,
    type: 'OUT',
  });

  const refetch = useCallback(async () => {
    setError(null);
    try {
      const [prods, txs, usrs] = await Promise.all([
        api.getProducts(),
        api.getTransactions(),
        api.getUsers(),
      ]);
      setProducts(prods);
      setTransactions(txs);
      setUsers(usrs);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const openTransactionModal = useCallback((type: TransactionType) => {
    setModalState({ open: true, type });
  }, []);

  const closeModal = useCallback(() => {
    setModalState((s) => ({ ...s, open: false }));
  }, []);

  const registerTransaction = useCallback(
    async (data: TransactionFormData) => {
      setError(null);
      try {
        const newTransaction = await api.registerTransaction(data);
        setProducts((prev) =>
          prev.map((p) =>
            p.id === data.productId
              ? {
                  ...p,
                  quantity:
                    data.type === 'IN' ? p.quantity + data.quantity : p.quantity - data.quantity,
                }
              : p
          )
        );
        setTransactions((prev) => [newTransaction, ...prev]);
        closeModal();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro ao registrar movimentação');
        throw e;
      }
    },
    [closeModal]
  );

  const registerTransactions = useCallback(
    async (items: TransactionFormData[]) => {
      setError(null);
      try {
        const newTx = await api.registerTransactions(items);
        if (newTx.length > 0) {
          const qtyByProductId: Record<string, number> = {};
          for (const t of newTx) {
            qtyByProductId[t.productId] = (qtyByProductId[t.productId] || 0) + t.quantity;
          }
          setProducts((prev) =>
            prev.map((p) =>
              qtyByProductId[p.id] ? { ...p, quantity: p.quantity + qtyByProductId[p.id] } : p
            )
          );
          setTransactions((prev) => [...newTx, ...prev]);
        }
        closeModal();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro ao registrar entradas');
        throw e;
      }
    },
    [closeModal]
  );

  const addUser = useCallback(async (user: Omit<User, 'id'>) => {
    setError(null);
    try {
      const created = await api.addUser(user);
      setUsers((prev) => [...prev, created]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao cadastrar funcionário');
      throw e;
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    setError(null);
    try {
      await api.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao excluir funcionário');
      throw e;
    }
  }, []);

  const addProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    setError(null);
    try {
      const created = await api.addProduct(product);
      setProducts((prev) => [...prev, created]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao cadastrar produto');
      throw e;
    }
  }, []);

  const value: DashboardContextValue = {
    products,
    transactions,
    openTransactionModal,
    registerTransaction,
    registerTransactions,
    addProduct,
    users,
    addUser,
    deleteUser,
    loading,
    error,
    refetch,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
      <DashboardModal
        isOpen={modalState.open}
        type={modalState.type}
        onClose={closeModal}
        onRegister={registerTransaction}
        onRegisterMultiple={registerTransactions}
        products={products}
        users={users}
      />
    </DashboardContext.Provider>
  );
}

function DashboardModal({
  isOpen,
  type,
  onClose,
  onRegister,
  onRegisterMultiple,
  products,
  users,
}: {
  isOpen: boolean;
  type: TransactionType;
  onClose: () => void;
  onRegister: (data: TransactionFormData) => void | Promise<void>;
  onRegisterMultiple: (data: TransactionFormData[]) => void | Promise<void>;
  products: Product[];
  users: User[];
}) {
  return (
    <TransactionForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onRegister}
      onSubmitMultiple={onRegisterMultiple}
      type={type}
      products={products}
      users={users}
    />
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
