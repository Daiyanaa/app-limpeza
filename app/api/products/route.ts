import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import type { Product } from '@/types';

function randomId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export async function GET() {
  try {
    const [rows] = await pool.execute<
      { id: string; name: string; quantity: number; min_threshold: number; unit: string; category: string }[]
    >(
      'SELECT id, name, quantity, min_threshold, unit, category FROM products ORDER BY name'
    );
    const products: Product[] = (rows || []).map((r) => ({
      id: r.id,
      name: r.name,
      quantity: Number(r.quantity),
      minThreshold: Number(r.min_threshold),
      unit: r.unit,
      category: r.category,
    }));
    return NextResponse.json(products);
  } catch (e) {
    console.error('GET /api/products', e);
    return NextResponse.json(
      { error: 'Erro ao listar produtos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      quantity = 0,
      minThreshold = 0,
      unit,
      category,
    } = body as {
      name?: string;
      quantity?: number;
      minThreshold?: number;
      unit?: string;
      category?: string;
    };
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Nome do produto é obrigatório' },
        { status: 400 }
      );
    }
    if (!unit || typeof unit !== 'string' || !unit.trim()) {
      return NextResponse.json({ error: 'Unidade é obrigatória' }, { status: 400 });
    }
    if (!category || typeof category !== 'string' || !category.trim()) {
      return NextResponse.json(
        { error: 'Categoria é obrigatória' },
        { status: 400 }
      );
    }
    const qty = Number(quantity) >= 0 ? Number(quantity) : 0;
    const min = Number(minThreshold) >= 0 ? Number(minThreshold) : 0;
    const id = randomId();
    await pool.execute(
      'INSERT INTO products (id, name, quantity, min_threshold, unit, category) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name.trim(), qty, min, unit.trim(), category.trim()]
    );
    const product: Product = {
      id,
      name: name.trim(),
      quantity: qty,
      minThreshold: min,
      unit: unit.trim(),
      category: category.trim(),
    };
    return NextResponse.json(product);
  } catch (e) {
    console.error('POST /api/products', e);
    return NextResponse.json(
      { error: 'Erro ao cadastrar produto' },
      { status: 500 }
    );
  }
}
