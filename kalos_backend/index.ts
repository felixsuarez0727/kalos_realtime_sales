import { Hono } from "hono";
import { cors } from "hono/cors";
import transactions from "./routes/transactions";

const app = new Hono();

app.use("*", cors({
  origin: "http://localhost:3000" 
}));

app.route("/transactions", transactions);

export default app;