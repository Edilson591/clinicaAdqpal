import api from "./api";

export interface PluggyItemResponse {
  id: string;
  pluggyItemId: string;
  connectorName: string;
  connectorLogo: string | null;
  status: string;
  lastSync: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SyncResult {
  accounts: number;
  transactionsSynced: number;
}

export const PluggyService = {
  /** Obtém o token temporário para abrir o widget Pluggy Connect */
  async getConnectToken(itemId?: string): Promise<{ accessToken: string; sandbox: boolean; mock: boolean }> {
    const params = itemId ? `?itemId=${itemId}` : "";
    const res = await api.get(`/pluggy/connect-token${params}`);
    return {
      accessToken: res.data.data.accessToken,
      sandbox: res.data.data.sandbox ?? true,
      mock: res.data.data.mock ?? false,
    };
  },

  /** Lista todos os itens (bancos) conectados */
  async listItems(): Promise<PluggyItemResponse[]> {
    const res = await api.get("/pluggy/items");
    return res.data.data;
  },

  /** Sincroniza contas e transações após conexão via widget */
  async syncItem(itemId: string): Promise<SyncResult> {
    const res = await api.post(`/pluggy/sync/${itemId}`);
    return res.data.data;
  },

  /** Remove a conexão com um banco */
  async deleteItem(itemId: string): Promise<void> {
    await api.delete(`/pluggy/items/${itemId}`);
  },
};
