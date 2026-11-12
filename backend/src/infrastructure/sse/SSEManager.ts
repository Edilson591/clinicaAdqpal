import type { Response } from "express";

/**
 * SSEManager — singleton que gerencia conexões SSE ativas.
 * Cada cliente conectado em GET /appointments/events é registrado aqui.
 * O controller chama broadcast() após create/update/delete.
 */
class SSEManager {
  private clients = new Set<{ response: Response; userId: string; roleId: number }>();

  addClient(response: Response, userId = "legacy", roleId = 1): void {
    this.clients.add({ response, userId, roleId });
  }

  removeClient(res: Response): void {
    for (const client of this.clients) {
      if (client.response === res) this.clients.delete(client);
    }
  }

  broadcast(event: string, data: unknown, responsibleUserId?: string): void {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of this.clients) {
      const mayViewAllAppointments = [1, 2, 5].includes(client.roleId);
      if (responsibleUserId && !mayViewAllAppointments && client.userId !== responsibleUserId) continue;
      try {
        client.response.write(payload);
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
