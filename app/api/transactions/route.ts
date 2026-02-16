import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import type { Transaction, TransactionFormData } from '@/types';

function randomId(): string {
  return 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function GET() {
  try {
    const [rows] = await pool.execute<
      {
        id: string;
        date: Date;
        product_id: string;
        product_name: string;
        user_id: string;
        user_name: string;
        type: 'IN' | 'OUT';
        quantity: number;
      }[]
    >(
      'SELECT id, date, product_id, product_name, user_id, user_name, type, quantity FROM transactions ORDER BY date DESC'
    );
    const transactions: Transaction[] = (rows || []).map((r) => ({
      id: r.id,
      date: new Date(r.date).toISOString(),
      productId: r.product_id,
      productName: r.product_name,
      userId: r.user_id,
      userName: r.user_name,
      type: r.type,
      quantity: Number(r.quantity),
    }));
    return NextResponse.json(transactions);
  } catch (e) {
    console.error('GET /api/transactions', e);
    return NextResponse.json(
      { error: 'Erro ao listar movimentações' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const isArray = Array.isArray(body);

    if (isArray) {
      // Múltiplas entradas (registro em lote)
      const items = body as TransactionFormData[];
      if (items.length === 0) {
        return NextResponse.json(
          { error: 'Envie ao menos um item' },
          { status: 400 }
        );
      }
      const conn = await pool.getConnection();
      try {
        const inserted: Transaction[] = [];
        const qtyByProduct: Record<string, number> = {};

        for (const data of items) {
          if (!data.productId || !data.userId || typeof data.quantity !== 'number' || data.quantity <= 0) continue;
          const [userRows] = await conn.execute<{ name: string }[]>(
            'SELECT name FROM users WHERE id = ?',
            [data.userId]
          );
          const [productRows] = await conn.execute<{ name: string; quantity: number }[]>(
            'SELECT name, quantity FROM products WHERE id = ?',
            [data.productId]
          );
          const user = (userRows || [])[0];
          const product = (productRows || [])[0];
          if (!user || !product) continue;

          const txId = randomId();
          const now = new Date();
          await conn.execute(
            'INSERT INTO transactions (id, date, product_id, product_name, user_id, user_name, type, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [txId, now, data.productId, product.name, data.userId, user.name, 'IN', data.quantity]
          );
          inserted.push({
            id: txId,
            date: now.toISOString(),
            productId: data.productId,
            productName: product.name,
            userId: data.userId,
            userName: user.name,
            type: 'IN',
            quantity: data.quantity,
          });
          qtyByProduct[data.productId] = (qtyByProduct[data.productId] || 0) + data.quantity;
        }

        for (const [productId, delta] of Object.entries(qtyByProduct)) {
          await conn.execute(
            'UPDATE products SET quantity = quantity + ? WHERE id = ?',
            [delta, productId]
          );
        }

        return NextResponse.json(inserted);
      } finally {
        conn.release();
      }
    }

    // Uma única movimentação (IN ou OUT)
    const data = body as TransactionFormData & { type?: 'IN' | 'OUT' };
    const { productId, userId, quantity, type } = data;
    const txType = type === 'OUT' ? 'OUT' : 'IN';

    if (!productId || !userId || typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json(
        { error: 'productId, userId e quantity são obrigatórios; quantity deve ser positivo' },
        { status: 400 }
      );
    }

    const [userRows] = await pool.execute<{ name: string }[]>(
      'SELECT name FROM users WHERE id = ?',
      [userId]
    );
    const [productRows] = await pool.execute<{ name: string; quantity: number }[]>(
      'SELECT name, quantity FROM products WHERE id = ?',
      [productId]
    );
    const user = (userRows || [])[0];
    const product = (productRows || [])[0];
    if (!user) {
      return NextResponse.json({ error: 'Funcionário não encontrado' }, { status: 400 });
    }
    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 400 });
    }

    if (txType === 'OUT' && product.quantity < quantity) {
      return NextResponse.json(
        { error: 'Quantidade em estoque insuficiente' },
        { status: 400 }
      );
    }

    const conn = await pool.getConnection();
    try {
      const txId = randomId();
      const now = new Date();
      await conn.execute(
        'INSERT INTO transactions (id, date, product_id, product_name, user_id, user_name, type, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [txId, now, productId, product.name, userId, user.name, txType, quantity]
      );
      const newQty =
        txType === 'IN'
          ? Number(product.quantity) + quantity
          : Number(product.quantity) - quantity;
      await conn.execute('UPDATE products SET quantity = ? WHERE id = ?', [
        newQty,
        productId,
      ]);

      const transaction: Transaction = {
        id: txId,
        date: now.toISOString(),
        productId,
        productName: product.name,
        userId,
        userName: user.name,
        type: txType,
        quantity,
      };
      return NextResponse.json(transaction);
    } finally {
      conn.release();
    }
  } catch (e) {
    console.error('POST /api/transactions', e);
    return NextResponse.json(
      { error: 'Erro ao registrar movimentação' },
      { status: 500 }
    );
  }
}
