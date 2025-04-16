import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8787 });

const clients: Set<WebSocket> = new Set();

wss.on("connection", (ws) => {
  clients.add(ws);
  ws.on("close", () => clients.delete(ws));
});

export function broadcast(data: any) {
  const json = JSON.stringify(data);
  for (const client of clients) {
    if (client.readyState === client.OPEN) {
      client.send(json);
    }
  }
}