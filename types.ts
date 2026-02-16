export interface Product {
  id: string;
  name: string;
  quantity: number;
  minThreshold: number;
  unit: string;
  category: string;
}

export type TransactionType = 'IN' | 'OUT';

export interface User {
  id: string;
  name: string;
  role: 'Admin' | 'Staff';
}

export interface Transaction {
  id: string;
  date: string; // ISO string
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  type: TransactionType;
  quantity: number;
}

export interface TransactionFormData {
  productId: string;
  userId: string;
  quantity: number;
  type: TransactionType;
}