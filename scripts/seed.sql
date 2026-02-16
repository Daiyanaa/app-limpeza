-- Dados iniciais opcionais (execute após schema.sql)
USE cleanstock;

INSERT IGNORE INTO users (id, name, role) VALUES
('u1', 'Carlos Silva', 'Staff'),
('u2', 'Ana Souza', 'Staff'),
('u3', 'Roberto Mendes', 'Staff'),
('u4', 'Fernanda Lima', 'Admin');

INSERT IGNORE INTO products (id, name, quantity, min_threshold, unit, category) VALUES
('1', 'Detergente Neutro 5L', 8, 3, 'galões', 'Químicos'),
('2', 'Papel Toalha Interfolha', 2, 5, 'fardos', 'Descartáveis'),
('3', 'Desinfetante Floral', 12, 4, 'litros', 'Químicos'),
('4', 'Saco de Lixo 100L', 45, 20, 'unidades', 'Descartáveis'),
('5', 'Luvas de Látex M', 1, 3, 'caixas', 'EPI'),
('6', 'Sabonete Líquido', 6, 4, 'refis', 'Higiene');
