import { Hono } from "hono";
import db from "../db/sqlite";
import { TransactionSchema } from "../schema";
import { broadcast } from "../ws/socket";

const transactions = new Hono();

transactions.get("/", (c) => {
  const search = c.req.query("search");
  const stmt = db.prepare(`
    SELECT * FROM transactions
    WHERE customerName LIKE ?
    ORDER BY date DESC
  `);
  const rows = stmt.all(`%${search || ""}%`);
  return c.json(rows);
});

transactions.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = TransactionSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: parsed.error.errors }, 400);
  }

  const { customerName, amount, currency } = parsed.data;
  const stmt = db.prepare(`
    INSERT INTO transactions (customerName, amount, currency)
    VALUES (?, ?, ?)
  `);
  stmt.run(customerName, amount, currency);

  // Total revenue
  const total = db.prepare(`SELECT SUM(amount) as revenue FROM transactions`).get();

  broadcast({
    type: "new_transaction",
    data: { customerName, amount, currency },
    totalRevenue: total.revenue || 0,
  });

  return c.json({ success: true });
});

transactions.get("/total", (c) => {
  const row = db.prepare(`SELECT SUM(amount) as revenue FROM transactions`).get();
  return c.json({ totalRevenue: row.revenue || 0 });
});

export default transactions;