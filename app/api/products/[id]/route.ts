import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import type { Product } from '@/types';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { quantity } = body as { quantity?: number };
    if (typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json(
        { error: 'Quantidade inválida' },
        { status: 400 }
      );
    }
    const [result] = await pool.execute<{ affectedRows: number }>(
      'UPDATE products SET quantity = ? WHERE id = ?',
      [quantity, id]
    );
    if (!result?.affectedRows) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }
    const [rows] = await pool.execute<
      { id: string; name: string; quantity: number; min_threshold: number; unit: string; category: string }[]
    >(
      'SELECT id, name, quantity, min_threshold, unit, category FROM products WHERE id = ?',
      [id]
    );
    const r = (rows || [])[0];
    if (!r) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    const product: Product = {
      id: r.id,
      name: r.name,
      quantity: Number(r.quantity),
      minThreshold: Number(r.min_threshold),
      unit: r.unit,
      category: r.category,
    };
    return NextResponse.json(product);
  } catch (e) {
    console.error('PATCH /api/products/[id]', e);
    return NextResponse.json(
      { error: 'Erro ao atualizar produto' },
      { status: 500 }
    );
  }
}
