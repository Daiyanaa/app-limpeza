import { Product, Transaction, User } from '@/types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Detergente Neutro 5L', quantity: 8, minThreshold: 3, unit: 'galões', category: 'Químicos' },
  { id: '2', name: 'Papel Toalha Interfolha', quantity: 2, minThreshold: 5, unit: 'fardos', category: 'Descartáveis' },
  { id: '3', name: 'Desinfetante Floral', quantity: 12, minThreshold: 4, unit: 'litros', category: 'Químicos' },
  { id: '4', name: 'Saco de Lixo 100L', quantity: 45, minThreshold: 20, unit: 'unidades', category: 'Descartáveis' },
  { id: '5', name: 'Luvas de Látex M', quantity: 1, minThreshold: 3, unit: 'caixas', category: 'EPI' },
  { id: '6', name: 'Sabonete Líquido', quantity: 6, minThreshold: 4, unit: 'refis', category: 'Higiene' },
];

export const USERS: User[] = [
  { id: 'u1', name: 'Carlos Silva', role: 'Staff' },
  { id: 'u2', name: 'Ana Souza', role: 'Staff' },
  { id: 'u3', name: 'Roberto Mendes', role: 'Staff' },
  { id: 'u4', name: 'Fernanda Lima', role: 'Admin' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    productId: '2',
    productName: 'Papel Toalha Interfolha',
    userId: 'u1',
    userName: 'Carlos Silva',
    type: 'OUT',
    quantity: 1,
  },
  {
    id: 't2',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    productId: '1',
    productName: 'Detergente Neutro 5L',
    userId: 'u4',
    userName: 'Fernanda Lima',
    type: 'IN',
    quantity: 5,
  },
  {
    id: 't3',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    productId: '5',
    productName: 'Luvas de Látex M',
    userId: 'u2',
    userName: 'Ana Souza',
    type: 'OUT',
    quantity: 2,
  },
];