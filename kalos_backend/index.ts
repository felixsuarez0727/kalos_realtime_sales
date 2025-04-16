import { Hono } from "hono";
import { cors } from 'hono/cors'
import transactions from "./routes/transactions";

const app = new Hono();

// CORS should be called before the route
app.use('*', cors({
    origin: 'http://localhost:3000', // o '*' para permitir todo
  }));
  

app.route("/transactions", transactions);

export default app;