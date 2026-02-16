-- Migração para banco existente (ex.: f1store)
-- Execute: mysql -u root -p f1store < scripts/migrate-f1store.sql
-- Ou no MySQL Workbench: selecione o banco f1store e rode este script.

-- 1) Criar tabela de movimentações (se não existir)
CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(36) PRIMARY KEY,
  date DATETIME(3) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  type ENUM('IN', 'OUT') NOT NULL,
  quantity DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_transactions_date (date),
  INDEX idx_transactions_product (product_id),
  INDEX idx_transactions_user (user_id),
  INDEX idx_transactions_type (type),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- 2) Adicionar coluna quantity em products
-- MySQL 8.0.12+ / MariaDB 10.5.2+:
ALTER TABLE products ADD COLUMN IF NOT EXISTS quantity DECIMAL(12, 2) NOT NULL DEFAULT 0;
-- Se sua versão não suportar IF NOT EXISTS, use só (rode uma vez):
-- ALTER TABLE products ADD COLUMN quantity DECIMAL(12, 2) NOT NULL DEFAULT 0;
