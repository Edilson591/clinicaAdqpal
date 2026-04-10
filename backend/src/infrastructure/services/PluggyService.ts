import { Item, PluggyClient } from "pluggy-sdk";

// Tipos mapeados da API Pluggy
export interface PluggyAccount {
  id: string;
  name: string;
  type: string; // BANK | CREDIT | INVESTMENT | LOAN | FINANCING
  subtype: string; // CHECKING_ACCOUNT | SAVINGS_ACCOUNT | etc.
  balance: number;
  currencyCode: string;
  itemId: string;
  number?: string;
}

export interface PluggyTransaction {
  id: string;
  description: string;
  amount: number; // positivo = CREDIT, negativo = DEBIT
  type: "CREDIT" | "DEBIT";
  date: string;
  accountId: string;
  paymentData?: {
    paymentMethod?: string;
  };
}

export interface PluggyItemDetail {
  id: string;
  status: string; // UPDATED | UPDATING | LOGIN_ERROR | WAITING_USER_INPUT | OUTDATED
  connector: {
    id: number;
    name: string;
    imageUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export class PluggyService {
  private client: PluggyClient;

  constructor() {
    if (!process.env.PLUGGY_CLIENT_ID || !process.env.PLUGGY_CLIENT_SECRET) {
      throw new Error(
        "PLUGGY_CLIENT_ID e PLUGGY_CLIENT_SECRET são obrigatórios no .env",
      );
    }

    this.client = new PluggyClient({
      clientId: process.env.PLUGGY_CLIENT_ID,
      clientSecret: process.env.PLUGGY_CLIENT_SECRET,
      baseUrl: process.env.PLUGGY_BASE_URL!,
    });
  }

  toPluggyItemDetail(item: Item): PluggyItemDetail {
    return {
      ...item,
      updatedAt: item.updatedAt.toISOString(),
      createdAt: item.createdAt.toISOString(),
    };
  }
  /** Cria um token temporário para abrir o widget Pluggy Connect no frontend */
  async createConnectToken(itemId?: string): Promise<string> {
    const sandbox =
      process.env.PLUGGY_SANDBOX === "true" ||
      process.env.NODE_ENV !== "production";
    const options: Record<string, unknown> = { sandbox };
    if (process.env.PLUGGY_WEBHOOK_URL) {
      options.webhookUrl = process.env.PLUGGY_WEBHOOK_URL;
    }
    const result = await this.client.createConnectToken(
      itemId,
      options as Parameters<PluggyClient["createConnectToken"]>[1],
    );
    return result.accessToken;
  }

  /** Busca detalhes de um item (conexão bancária) */
  async fetchItem(itemId: string): Promise<PluggyItemDetail> {
    const item = await this.client.fetchItem(itemId);

    return this.toPluggyItemDetail(item);
  }

  /** Busca todas as contas de um item */
  async fetchAccounts(itemId: string): Promise<PluggyAccount[]> {
    const result = await this.client.fetchAccounts(itemId);
    return (result.results ?? []) as unknown as PluggyAccount[];
  }

  /** Busca transações de uma conta dentro de um intervalo de datas */
  async fetchTransactions(
    accountId: string,
    from: string,
    to: string,
  ): Promise<PluggyTransaction[]> {
    const result = await this.client.fetchTransactions(accountId, {
      from,
      to,
    } as Record<string, unknown>);
    return (result.results ?? []) as unknown as PluggyTransaction[];
  }

  /** Deleta (desconecta) um item */
  async deleteItem(itemId: string): Promise<void> {
    await this.client.deleteItem(itemId);
  }
}
