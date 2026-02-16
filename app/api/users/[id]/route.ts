import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: 'ID do funcionário é obrigatório' },
        { status: 400 }
      );
    }
    const [result] = await pool.execute<{ affectedRows: number }>(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    if (!result?.affectedRows) {
      return NextResponse.json(
        { error: 'Funcionário não encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const err = e as { code?: string; errno?: number };
    if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.errno === 1451) {
      return NextResponse.json(
        { error: 'Não é possível excluir: funcionário possui movimentações vinculadas.' },
        { status: 409 }
      );
    }
    console.error('DELETE /api/users/[id]', e);
    return NextResponse.json(
      { error: 'Erro ao excluir funcionário' },
      { status: 500 }
    );
  }
}
