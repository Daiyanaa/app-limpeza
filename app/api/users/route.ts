import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import type { User } from '@/types';

function randomId(): string {
  return 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function GET() {
  try {
    const [rows] = await pool.execute<
      { id: string; name: string; role: 'Admin' | 'Staff' }[]
    >('SELECT id, name, role FROM users ORDER BY name');
    const users: User[] = (rows || []).map((r) => ({
      id: r.id,
      name: r.name,
      role: r.role,
    }));
    return NextResponse.json(users);
  } catch (e) {
    console.error('GET /api/users', e);
    return NextResponse.json(
      { error: 'Erro ao listar funcionários' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role } = body as { name?: string; role?: 'Admin' | 'Staff' };
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }
    const r = role === 'Admin' ? 'Admin' : 'Staff';
    const id = randomId();
    await pool.execute(
      'INSERT INTO users (id, name, role) VALUES (?, ?, ?)',
      [id, name.trim(), r]
    );
    const user: User = { id, name: name.trim(), role: r };
    return NextResponse.json(user);
  } catch (e) {
    console.error('POST /api/users', e);
    return NextResponse.json(
      { error: 'Erro ao cadastrar funcionário' },
      { status: 500 }
    );
  }
}
