import app from "./index";
import { serve } from "@hono/node-server";
import "./ws/socket"; // Inicializa WebSocket

serve({
  fetch: app.fetch,
  port: 3001,
});

console.log("Server running on http://localhost:3001");