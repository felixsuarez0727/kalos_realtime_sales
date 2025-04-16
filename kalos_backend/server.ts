import app from "./index";
import { serve } from "@hono/node-server";
 
import "./ws/socket";

if (require.main === module) {
  serve({
    fetch: app.fetch,
    port: 3001,
  });
  console.log("Server running on http://localhost:3001");
}

export default app;