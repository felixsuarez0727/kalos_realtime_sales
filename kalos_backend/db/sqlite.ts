import Database from "better-sqlite3";

const db = new Database("sales.db");

// Crear tabla si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT DEFAULT CURRENT_TIMESTAMP,
    customerName TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL
  );
`);

export default db;