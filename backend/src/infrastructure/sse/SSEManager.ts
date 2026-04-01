import type { Response } from "express";

/**
 * SSEManager — singleton que gerencia conexões SSE ativas.
 * Cada cliente conectado em GET /appointments/events é registrado aqui.
 * O controller chama broadcast() após create/update/delete.
 */
class SSEManager {
  private clients: Set<Response> = new Set();

  addClient(res: Response): void {
    this.clients.add(res);
  }

  removeClient(res: Response): void {
    this.clients.delete(res);
  }

  broadcast(event: string, data: unknown): void {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of this.clients) {
      try {
        client.write(payload);
      } catch {
        // cliente desconectado sem disparar "close" — limpa da lista
        this.clients.delete(client);
      }
    }
  }

  get clientCount(): number {
    return this.clients.size;
  }
}

export const sseManager = new SSEManager();
