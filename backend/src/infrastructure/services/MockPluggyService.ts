import {
  PluggyAccount,
  PluggyTransaction,
  PluggyItemDetail,
} from "./PluggyService";

const MOCK_ITEM_ID = "mock-item-001";

const MOCK_ACCOUNTS: PluggyAccount[] = [
  {
    id: "mock-acc-001",
    name: "Conta Corrente Bradesco",
    type: "BANK",
    subtype: "CHECKING_ACCOUNT",
    balance: 12450.75,
    currencyCode: "BRL",
    itemId: MOCK_ITEM_ID,
    number: "12345-6",
  },
  {
    id: "mock-acc-002",
    name: "Cartão de Crédito Nubank",
    type: "CREDIT",
    subtype: "CREDIT_CARD",
    balance: -1230.5,
    currencyCode: "BRL",
    itemId: MOCK_ITEM_ID,
    number: "4111 **** **** 1111",
  },
];

function generateMockTransactions(
  accountId: string,
  from: string,
  to: string,
): PluggyTransaction[] {
  const start = new Date(from);
  const end = new Date(to);
  const txs: PluggyTransaction[] = [];

  const templates = [
    { description: "Pagamento consulta particular", amount: 350.0, type: "CREDIT" as const },
    { description: "Aluguel sala clínica", amount: -2800.0, type: "DEBIT" as const },
    { description: "Plano de saúde - repasse", amount: 1200.0, type: "CREDIT" as const },
    { description: "Energia elétrica", amount: -180.5, type: "DEBIT" as const },
    { description: "Material de escritório", amount: -95.0, type: "DEBIT" as const },
    { description: "Consulta convênio Unimed", amount: 420.0, type: "CREDIT" as const },
    { description: "Internet fibra", amount: -130.0, type: "DEBIT" as const },
    { description: "Folha de pagamento", amount: -4500.0, type: "DEBIT" as const },
    { description: "Consulta particular - Pix", amount: 200.0, type: "CREDIT" as const, paymentMethod: "PIX" },
    { description: "Fornecedor material médico", amount: -650.0, type: "DEBIT" as const },
  ];

  let index = 0;
  const cursor = new Date(start);

  while (cursor <= end && txs.length < 20) {
    const tmpl = templates[index % templates.length];
    txs.push({
      id: `mock-tx-${accountId}-${index}`,
      description: tmpl.description,
      amount: tmpl.amount,
      type: tmpl.type,
      date: cursor.toISOString().split("T")[0],
      accountId,
      paymentData: tmpl.paymentMethod ? { paymentMethod: tmpl.paymentMethod } : undefined,
    });
    cursor.setDate(cursor.getDate() + 4);
    index++;
  }

  return txs;
}

export class MockPluggyService {
  constructor() {
    console.log("[MockPluggyService] Modo mock ativo — nenhuma chamada real ao Pluggy.");
  }

  async createConnectToken(_itemId?: string): Promise<string> {
    return `mock-connect-token-${Date.now()}`;
  }

  async fetchItem(itemId: string): Promise<PluggyItemDetail> {
    return {
      id: itemId,
      status: "UPDATED",
      connector: {
        id: 1,
        name: "Bradesco (Mock)",
        imageUrl: "https://cdn.pluggy.ai/assets/connector-icons/bradesco.svg",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async fetchAccounts(_itemId: string): Promise<PluggyAccount[]> {
    return MOCK_ACCOUNTS;
  }

  async fetchTransactions(
    accountId: string,
    from: string,
    to: string,
  ): Promise<PluggyTransaction[]> {
    return generateMockTransactions(accountId, from, to);
  }

  async deleteItem(_itemId: string): Promise<void> {
    console.log("[MockPluggyService] deleteItem chamado — noop no mock.");
  }
}
