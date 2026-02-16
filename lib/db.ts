import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'cleanstock',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

// Log no terminal quando conectar ao banco (na primeira vez que o db for usado)
pool
  .query('SELECT 1')
  .then(() => {
    const host = process.env.DB_HOST ?? 'localhost';
    const port = process.env.DB_PORT ?? '3306';
    const db = process.env.DB_NAME ?? 'cleanstock';
    console.log(`[DB] Conectado ao MySQL: ${db} (${host}:${port})`);
  })
  .catch((err) => {
    console.error('[DB] Erro ao conectar no MySQL:', err.message);
  });

export type RowUser = { id: string; name: string; role: 'Admin' | 'Staff' };
export type RowProduct = {
  id: string;
  name: string;
  quantity: number;
  min_threshold: number;
  unit: string;
  category: string;
};
export type RowTransaction = {
  id: string;
  date: Date;
  product_id: string;
  product_name: string;
  user_id: string;
  user_name: string;
  type: 'IN' | 'OUT';
  quantity: number;
};

export default pool;
