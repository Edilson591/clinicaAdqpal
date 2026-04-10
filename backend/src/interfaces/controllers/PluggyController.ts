import { Request, Response, NextFunction } from "express";
import { PluggyService } from "../../infrastructure/services/PluggyService";
import prisma from "../../infrastructure/database/prismaClient";
import { DomainError } from "../../domain/errors/DomainError";

// Mapeamento de tipos de conta Pluggy → nosso AccountType
function mapAccountType(pluggyType: string): string {
  switch (pluggyType.toUpperCase()) {
    case "CREDIT":
      return "CREDIT_CARD";
    case "INVESTMENT":
      return "INVESTMENT";
    case "SAVINGS":
      return "SAVINGS";
    default:
      return "CHECKING";
  }
}

// Mapeamento de método de pagamento pelo campo paymentData do Pluggy
function mapPaymentMethod(pluggyPayment?: string): string {
  if (!pluggyPayment) return "OTHER";
  const m = pluggyPayment.toUpperCase();
  if (m.includes("PIX")) return "PIX";
  if (m.includes("CREDIT")) return "CREDIT_CARD";
  if (m.includes("DEBIT")) return "DEBIT_CARD";
  if (m.includes("TED") || m.includes("DOC") || m.includes("TRANSFER"))
    return "BANK_TRANSFER";
  return "OTHER";
}

export class PluggyController {
  // GET /pluggy/connect-token
  // Cria um token temporário para o widget Pluggy Connect
  async createConnectToken(req: Request, res: Response, next: NextFunction) {
    try {
      const pluggy = new PluggyService();
      const { itemId } = req.query as { itemId?: string };
      const accessToken = await pluggy.createConnectToken(itemId);
      res.json({ success: true, data: { accessToken } });
    } catch (err) {
      next(err);
    }
  }

  // GET /pluggy/items
  // Lista todos os itens conectados armazenados localmente
  async listItems(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await prisma.pluggyItem.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  }

  // POST /pluggy/sync/:itemId
  // Recebe um itemId após conexão via widget e sincroniza contas + transações
  async syncItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const userId = (req as Request & { userId: string }).userId;

      const pluggy = new PluggyService();

      // 1. Busca detalhes do item no Pluggy
      const item = await pluggy.fetchItem(itemId as string);

      // 2. Upsert do registro PluggyItem local
      await prisma.pluggyItem.upsert({
        where: { pluggyItemId: itemId as string },
        create: {
          pluggyItemId: itemId as string,
          connectorName: item.connector.name,
          connectorLogo: item.connector.imageUrl ?? null,
          status: item.status,
          lastSync: new Date(),
        },
        update: {
          status: item.status,
          connectorName: item.connector.name,
          connectorLogo: item.connector.imageUrl ?? null,
          lastSync: new Date(),
        },
      });

      // 3. Busca contas do item
      const accounts = await pluggy.fetchAccounts(itemId as string);
      let transactionsSynced = 0;

      // Data de início: 90 dias atrás
      const dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - 90);
      const from = dateFrom.toISOString().split("T")[0];
      const to = new Date().toISOString().split("T")[0];

      // Busca ou cria uma categoria padrão para importações
      let defaultCategory = await prisma.financialCategory.findFirst({
        where: { name: "Importado (Pluggy)", isActive: true },
      });

      if (!defaultCategory) {
        defaultCategory = await prisma.financialCategory.create({
          data: {
            name: "Importado (Pluggy)",
            type: "BOTH",
            isDefault: false,
            isActive: true,
            color: "#94A3B8",
          },
        });
      }

      for (const account of accounts) {
        // 4. Upsert da conta financeira local
        let financialAccount = await prisma.financialAccount.findFirst({
          where: { pluggyAccountId: account.id },
        });

        if (!financialAccount) {
          financialAccount = await prisma.financialAccount.create({
            data: {
              name: account.name,
              type: mapAccountType(account.type) as
                | "CHECKING"
                | "SAVINGS"
                | "CASH"
                | "CREDIT_CARD"
                | "INVESTMENT",
              bank: item.connector.name,
              initialBalance: account.balance ?? 0,
              currency: account.currencyCode ?? "BRL",
              isActive: true,
              isDefault: false,
              pluggyAccountId: account.id,
            },
          });
        }

        // 5. Busca e sincroniza transações dos últimos 90 dias
        const transactions = await pluggy.fetchTransactions(
          account.id,
          from,
          to,
        );

        for (const tx of transactions) {
          const reference = `pluggy_${tx.id}`;

          // Evita duplicatas pelo campo reference
          const exists = await prisma.transaction.findFirst({
            where: { reference },
          });
          if (exists) continue;

          await prisma.transaction.create({
            data: {
              accountId: financialAccount.id,
              categoryId: defaultCategory.id,
              createdBy: userId,
              type: tx.type === "CREDIT" ? "INCOME" : "EXPENSE",
              amount: Math.abs(tx.amount),
              description: tx.description || "Transação importada",
              status: "CONFIRMED",
              paymentMethod: mapPaymentMethod(tx.paymentData?.paymentMethod) as
                | "CASH"
                | "CREDIT_CARD"
                | "DEBIT_CARD"
                | "PIX"
                | "BANK_TRANSFER"
                | "INSURANCE"
                | "OTHER",
              dueDate: new Date(tx.date),
              paidAt: new Date(tx.date),
              reference,
            },
          });

          transactionsSynced++;
        }
      }

      res.json({
        success: true,
        message: `Sincronização concluída: ${accounts.length} conta(s), ${transactionsSynced} transação(ões) importada(s).`,
        data: { accounts: accounts.length, transactionsSynced },
      });
    } catch (err) {
      next(err);
    }
  }

  // DELETE /pluggy/items/:itemId
  // Remove a conexão com o banco (local + Pluggy)
  async deleteItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;

      const localItem = await prisma.pluggyItem.findFirst({
        where: { pluggyItemId: itemId as string},
      });

      if (!localItem) {
        throw new DomainError("Item não encontrado.", 404);
      }

      // Remove no Pluggy
      const pluggy = new PluggyService();
      await pluggy.deleteItem(itemId as string);

      // Remove localmente
      await prisma.pluggyItem.delete({ where: { pluggyItemId: itemId as string} });

      res.json({ success: true, message: "Conta desconectada com sucesso." });
    } catch (err) {
      next(err);
    }
  }

  // POST /pluggy/webhook
  // Recebe notificações automáticas do Pluggy (sem auth JWT)
  async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      const { event, itemId } = req.body as { event: string; itemId: string };

      if (event === "item/updated" || event === "transactions/updated") {
        await prisma.pluggyItem.updateMany({
          where: { pluggyItemId: itemId },
          data: { status: "UPDATING" },
        });
        // Sincronização assíncrona disparada pelo webhook pode ser implementada aqui
        // ou via fila (ex: BullMQ). Por ora apenas atualiza o status.
      }

      res.status(200).json({ received: true });
    } catch (err) {
      next(err);
    }
  }
}
