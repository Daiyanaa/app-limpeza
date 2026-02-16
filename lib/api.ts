import type {
  Product,
  Transaction,
  TransactionFormData,
  User,
} from '@/types';

const base = typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_APP_URL ?? '';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${base}/api${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? res.statusText);
  }
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${base}/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? res.statusText);
  }
  return res.json();
}

async function del(path: string): Promise<void> {
  const res = await fetch(`${base}/api${path}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? res.statusText);
  }
}

export const api = {
  getProducts: () => get<Product[]>('/products'),
  getUsers: () => get<User[]>('/users'),
  getTransactions: () => get<Transaction[]>('/transactions'),
  addProduct: (product: Omit<Product, 'id'>) =>
    post<Product>('/products', product),
  addUser: (user: Omit<User, 'id'>) => post<User>('/users', user),
  deleteUser: (id: string) => del(`/users/${id}`),
  registerTransaction: (data: TransactionFormData) =>
    post<Transaction>('/transactions', data),
  registerTransactions: (items: TransactionFormData[]) =>
    post<Transaction[]>('/transactions', items),
};
