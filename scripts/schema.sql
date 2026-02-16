-- CleanStock - Schema MySQL/MariaDB
-- Execute este arquivo no seu banco para criar as tabelas.

CREATE DATABASE IF NOT EXISTS cleanstock CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cleanstock;

-- Funcionários (usuários do sistema)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role ENUM('Admin', 'Staff') NOT NULL DEFAULT 'Staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Produtos
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  quantity DECIMAL(12, 2) NOT NULL DEFAULT 0,
  min_threshold DECIMAL(12, 2) NOT NULL DEFAULT 0,
  unit VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Movimentações (entradas e retiradas)
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
