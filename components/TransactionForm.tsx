'use client';

import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { Product, TransactionType, User, TransactionFormData } from '@/types';

interface EntryRow {
  id: string;
  productId: string;
  quantity: number;
}

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void | Promise<void>;
  onSubmitMultiple?: (data: TransactionFormData[]) => void | Promise<void>;
  type: TransactionType;
  products: Product[];
  users: User[];
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onSubmitMultiple,
  type,
  products,
  users,
}) => {
  const [formData, setFormData] = useState<Partial<TransactionFormData>>({
    quantity: 1,
  });
  const [entryRows, setEntryRows] = useState<EntryRow[]>([
    { id: '1', productId: '', quantity: 1 },
  ]);
  const [multiUserId, setMultiUserId] = useState('');
  const [error, setError] = useState<string>('');

  const isEntry = type === 'IN';
  const allowMultiple = isEntry && !!onSubmitMultiple;

  useEffect(() => {
    if (isOpen) {
      setFormData({ quantity: 1, type });
      setEntryRows([{ id: String(Date.now()), productId: '', quantity: 1 }]);
      setMultiUserId('');
      setError('');
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  const addRow = () => {
    setEntryRows((prev) => [
      ...prev,
      { id: String(Date.now() + Math.random()), productId: '', quantity: 1 },
    ]);
  };

  const removeRow = (id: string) => {
    setEntryRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
  };

  const updateRow = (id: string, field: 'productId' | 'quantity', value: string | number) => {
    setEntryRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, [field]: field === 'quantity' ? Number(value) || 0 : value } : r
      )
    );
  };

  const handleSubmitSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.userId || !formData.productId || !formData.quantity) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    const selectedProduct = products.find((p) => p.id === formData.productId);

    if (type === 'OUT' && selectedProduct) {
      if (formData.quantity > selectedProduct.quantity) {
        setError(`Estoque insuficiente. Disponível: ${selectedProduct.quantity} ${selectedProduct.unit}`);
        return;
      }
    }

    if (formData.quantity <= 0) {
      setError('A quantidade deve ser maior que zero.');
      return;
    }

    try {
      await onSubmit({
        productId: formData.productId,
        userId: formData.userId,
        quantity: formData.quantity,
        type: type,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar.');
    }
  };

  const handleSubmitMultiple = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!multiUserId) {
      setError('Selecione o responsável.');
      return;
    }

    const validRows = entryRows.filter((r) => r.productId && r.quantity > 0);
    if (validRows.length === 0) {
      setError('Adicione ao menos uma entrada com produto e quantidade.');
      return;
    }

    const data: TransactionFormData[] = validRows.map((r) => ({
      productId: r.productId,
      userId: multiUserId,
      quantity: r.quantity,
      type: 'IN',
    }));

    try {
      await onSubmitMultiple?.(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar entradas.');
    }
  };

  const handleSubmit = allowMultiple ? handleSubmitMultiple : handleSubmitSingle;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className={`w-full bg-white rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] ${allowMultiple ? 'sm:max-w-lg' : 'sm:max-w-md'}`}>
        <div className={`px-6 py-4 border-b flex justify-between items-center ${isEntry ? 'bg-emerald-50' : 'bg-rose-50'}`}>
          <h2 className={`text-xl font-bold ${isEntry ? 'text-emerald-700' : 'text-rose-700'}`}>
            {isEntry ? 'Registrar Entrada' : 'Registrar Retirada'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {allowMultiple ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Responsável</label>
                <select
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                  value={multiUserId}
                  onChange={(e) => setMultiUserId(e.target.value)}
                  required
                >
                  <option value="">Selecione o funcionário</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">Entradas</label>
                  <button
                    type="button"
                    onClick={addRow}
                    className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    <Plus size={16} />
                    Adicionar linha
                  </button>
                </div>
                <div className="space-y-3">
                  {entryRows.map((row, index) => (
                    <div
                      key={row.id}
                      className="flex gap-2 items-start p-3 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
                        <select
                          className="w-full p-2.5 border border-slate-200 rounded-lg bg-white text-sm"
                          value={row.productId}
                          onChange={(e) => updateRow(row.id, 'productId', e.target.value)}
                          required={entryRows.length === 1}
                        >
                          <option value="">Produto</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} ({product.quantity} {product.unit})
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="1"
                          placeholder="Qtd"
                          className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-medium"
                          value={row.quantity || ''}
                          onChange={(e) => updateRow(row.id, 'quantity', e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg shrink-0"
                        title="Remover linha"
                        disabled={entryRows.length === 1}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 active:scale-[0.98] transition-all"
                >
                  Confirmar {entryRows.filter((r) => r.productId && r.quantity > 0).length} entrada(s)
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Responsável</label>
                <select
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                  value={formData.userId || ''}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  required
                >
                  <option value="" disabled>Selecione o funcionário</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Produto</label>
                <select
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                  value={formData.productId || ''}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  required
                >
                  <option value="" disabled>Selecione o produto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Atual: {product.quantity} {product.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Quantidade {formData.productId && products.find(p => p.id === formData.productId)?.unit && `(${products.find(p => p.id === formData.productId)?.unit})`}
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-lg font-medium"
                  value={formData.quantity || ''}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className={`w-full py-4 rounded-xl font-bold text-white shadow-lg active:scale-[0.98] transition-all ${
                    isEntry
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                      : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                  }`}
                >
                  Confirmar {isEntry ? 'Entrada' : 'Retirada'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;