import { WebSocketServer } from "ws";

let wss: WebSocketServer | null = null;
if (process.env.NODE_ENV !== "test") {
  wss = new WebSocketServer({ port: 8787 });
  console.log("WebSocket iniciado en puerto 8787");
}

export const broadcast = (data: any) => {
  if (!wss) return;
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  }
};

export { wss };