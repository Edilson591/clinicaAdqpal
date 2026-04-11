/**
 * Seed financeiro — ADQPAL
 * Cria contas, categorias e transações realistas dos últimos 3 meses.
 *
 * Uso: npm run seed
 *
 * O seed é idempotente: pode ser executado várias vezes sem duplicar dados.
 * Tudo é vinculado ao primeiro usuário admin encontrado no banco.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(10, 0, 0, 0);
  return d;
}

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Dados ────────────────────────────────────────────────────────────────────

const ACCOUNTS = [
  {
    name: "Conta Corrente Bradesco",
    type: "CHECKING" as const,
    bank: "Bradesco",
    initialBalance: 15000,
    isDefault: true,
    color: "#CC092F",
  },
  {
    name: "Poupança Itaú",
    type: "SAVINGS" as const,
    bank: "Itaú",
    initialBalance: 8000,
    isDefault: false,
    color: "#FF6200",
  },
  {
    name: "Caixa / Dinheiro",
    type: "CASH" as const,
    bank: null,
    initialBalance: 500,
    isDefault: false,
    color: "#22C55E",
  },
  {
    name: "Cartão Nubank",
    type: "CREDIT_CARD" as const,
    bank: "Nubank",
    initialBalance: 0,
    isDefault: false,
    color: "#8B5CF6",
  },
];

const CATEGORIES = [
  // Receitas
  { name: "Consultas Particulares", type: "INCOME" as const, color: "#22C55E", icon: "stethoscope" },
  { name: "Convênios / Planos", type: "INCOME" as const, color: "#10B981", icon: "heart-pulse" },
  { name: "Exames", type: "INCOME" as const, color: "#34D399", icon: "clipboard" },
  { name: "Procedimentos", type: "INCOME" as const, color: "#6EE7B7", icon: "activity" },
  // Despesas
  { name: "Aluguel", type: "EXPENSE" as const, color: "#EF4444", icon: "home" },
  { name: "Energia Elétrica", type: "EXPENSE" as const, color: "#F97316", icon: "zap" },
  { name: "Água", type: "EXPENSE" as const, color: "#3B82F6", icon: "droplets" },
  { name: "Internet / Telefone", type: "EXPENSE" as const, color: "#8B5CF6", icon: "wifi" },
  { name: "Folha de Pagamento", type: "EXPENSE" as const, color: "#EC4899", icon: "users" },
  { name: "Material Médico", type: "EXPENSE" as const, color: "#F59E0B", icon: "package" },
  { name: "Material de Escritório", type: "EXPENSE" as const, color: "#D97706", icon: "printer" },
  { name: "Manutenção / Reparos", type: "EXPENSE" as const, color: "#6B7280", icon: "wrench" },
  { name: "Sistema / Software", type: "EXPENSE" as const, color: "#64748B", icon: "monitor" },
  { name: "Impostos / Taxas", type: "EXPENSE" as const, color: "#DC2626", icon: "landmark" },
  { name: "Importado (Pluggy)", type: "BOTH" as const, color: "#94A3B8", icon: "link" },
];

// Transações fixas mensais (despesas recorrentes)
const FIXED_EXPENSES = [
  { desc: "Aluguel sala clínica", catName: "Aluguel", amount: 3200, method: "BANK_TRANSFER" as const },
  { desc: "Energia elétrica", catName: "Energia Elétrica", amount: 320, method: "DEBIT_CARD" as const },
  { desc: "Água e saneamento", catName: "Água", amount: 85, method: "DEBIT_CARD" as const },
  { desc: "Internet fibra + telefone", catName: "Internet / Telefone", amount: 230, method: "DEBIT_CARD" as const },
  { desc: "Folha de pagamento — recepção", catName: "Folha de Pagamento", amount: 2800, method: "BANK_TRANSFER" as const },
  { desc: "Sistema ADQPAL / licenças", catName: "Sistema / Software", amount: 150, method: "CREDIT_CARD" as const },
  { desc: "Simples Nacional", catName: "Impostos / Taxas", amount: 480, method: "BANK_TRANSFER" as const },
];

// Transações variáveis de receita
const INCOME_TEMPLATES = [
  { desc: "Consulta particular", catName: "Consultas Particulares", min: 200, max: 450, method: "PIX" as const },
  { desc: "Consulta particular", catName: "Consultas Particulares", min: 200, max: 450, method: "CASH" as const },
  { desc: "Consulta Unimed", catName: "Convênios / Planos", min: 120, max: 280, method: "INSURANCE" as const },
  { desc: "Consulta Bradesco Saúde", catName: "Convênios / Planos", min: 130, max: 260, method: "INSURANCE" as const },
  { desc: "Exame de sangue", catName: "Exames", min: 80, max: 200, method: "PIX" as const },
  { desc: "Eletrocardiograma", catName: "Exames", min: 150, max: 300, method: "DEBIT_CARD" as const },
  { desc: "Procedimento dermatológico", catName: "Procedimentos", min: 350, max: 800, method: "CREDIT_CARD" as const },
  { desc: "Consulta online", catName: "Consultas Particulares", min: 180, max: 350, method: "PIX" as const },
];

// Transações variáveis de despesa
const EXPENSE_TEMPLATES = [
  { desc: "Compra material médico", catName: "Material Médico", min: 200, max: 900, method: "CREDIT_CARD" as const },
  { desc: "Papel A4 / cartuchos", catName: "Material de Escritório", min: 80, max: 200, method: "CREDIT_CARD" as const },
  { desc: "Manutenção equipamento", catName: "Manutenção / Reparos", min: 300, max: 1200, method: "BANK_TRANSFER" as const },
  { desc: "Luvas e EPIs", catName: "Material Médico", min: 120, max: 350, method: "PIX" as const },
  { desc: "Dedetização / limpeza", catName: "Manutenção / Reparos", min: 250, max: 500, method: "PIX" as const },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Iniciando seed financeiro...\n");

  // 1. Resolve o usuário admin (ou o primeiro usuário disponível)
  const adminUser = await prisma.user.findFirst({
    where: { role: { name: { in: ["ADMIN", "admin", "Admin"] } } },
    orderBy: { createdAt: "asc" },
  }) ?? await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });

  if (!adminUser) {
    console.error("❌ Nenhum usuário encontrado. Crie um usuário antes de rodar o seed.");
    process.exit(1);
  }

  console.log(`✅ Usuário base: ${adminUser.username} (${adminUser.id})\n`);

  // 2. Contas financeiras
  console.log("💳 Criando contas financeiras...");
  const accountMap: Record<string, string> = {};

  for (const acc of ACCOUNTS) {
    const existing = await prisma.financialAccount.findFirst({
      where: { name: acc.name, bank: acc.bank },
    });

    const record = existing ?? await prisma.financialAccount.create({
      data: {
        name: acc.name,
        type: acc.type,
        bank: acc.bank,
        initialBalance: acc.initialBalance,
        currency: "BRL",
        isActive: true,
        isDefault: acc.isDefault,
        color: acc.color,
      },
    });

    accountMap[acc.name] = record.id;
    console.log(`  ${existing ? "→ já existe" : "  criada"}: ${acc.name}`);
  }

  // 3. Categorias
  console.log("\n📁 Criando categorias...");
  const categoryMap: Record<string, string> = {};

  for (const cat of CATEGORIES) {
    const existing = await prisma.financialCategory.findFirst({
      where: { name: cat.name },
    });

    const record = existing ?? await prisma.financialCategory.create({
      data: {
        name: cat.name,
        type: cat.type,
        color: cat.color,
        icon: cat.icon,
        isDefault: false,
        isActive: true,
      },
    });

    categoryMap[cat.name] = record.id;
    console.log(`  ${existing ? "→ já existe" : "  criada"}: ${cat.name}`);
  }

  // 4. Limpa transações seed anteriores (pelo tag)
  const deleted = await prisma.transaction.deleteMany({
    where: { tags: { has: "seed" } },
  });
  if (deleted.count > 0) {
    console.log(`\n🧹 Removidas ${deleted.count} transações seed anteriores.`);
  }

  // 5. Transações
  console.log("\n💰 Gerando transações (últimos 90 dias)...");

  const checkingId = accountMap["Conta Corrente Bradesco"];
  const cashId = accountMap["Caixa / Dinheiro"];
  const creditId = accountMap["Cartão Nubank"];
  const savingsId = accountMap["Poupança Itaú"];

  const methodToAccountId: Record<string, string> = {
    BANK_TRANSFER: checkingId,
    PIX: checkingId,
    DEBIT_CARD: checkingId,
    CREDIT_CARD: creditId,
    CASH: cashId,
    INSURANCE: checkingId,
    OTHER: checkingId,
  };

  let count = 0;

  // Despesas fixas — 3 meses (mês atual, 1 mês atrás, 2 meses atrás)
  for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
    const dueDay = 5 + monthOffset * 30; // dia 5 de cada mês

    for (const fx of FIXED_EXPENSES) {
      const catId = categoryMap[fx.catName];
      const accId = methodToAccountId[fx.method];
      if (!catId || !accId) continue;

      await prisma.transaction.create({
        data: {
          accountId: accId,
          categoryId: catId,
          createdBy: adminUser.id,
          type: "EXPENSE",
          amount: fx.amount,
          description: fx.desc,
          status: "CONFIRMED",
          paymentMethod: fx.method,
          dueDate: daysAgo(dueDay),
          paidAt: daysAgo(dueDay),
          isRecurring: true,
          tags: ["seed", "fixo"],
        },
      });
      count++;
    }
  }

  // Receitas variáveis — ~5 por semana nos últimos 90 dias
  for (let day = 1; day <= 88; day += 2) {
    const numTx = Math.random() < 0.4 ? 2 : 1;
    for (let i = 0; i < numTx; i++) {
      const tmpl = pick(INCOME_TEMPLATES);
      const catId = categoryMap[tmpl.catName];
      const accId = methodToAccountId[tmpl.method];
      if (!catId || !accId) continue;

      await prisma.transaction.create({
        data: {
          accountId: accId,
          categoryId: catId,
          createdBy: adminUser.id,
          type: "INCOME",
          amount: randomBetween(tmpl.min, tmpl.max),
          description: tmpl.desc,
          status: "CONFIRMED",
          paymentMethod: tmpl.method,
          dueDate: daysAgo(day),
          paidAt: daysAgo(day),
          isRecurring: false,
          tags: ["seed"],
        },
      });
      count++;
    }
  }

  // Despesas variáveis — ~2 por semana
  for (let day = 1; day <= 88; day += 5) {
    const tmpl = pick(EXPENSE_TEMPLATES);
    const catId = categoryMap[tmpl.catName];
    const accId = methodToAccountId[tmpl.method];
    if (!catId || !accId) continue;

    await prisma.transaction.create({
      data: {
        accountId: accId,
        categoryId: catId,
        createdBy: adminUser.id,
        type: "EXPENSE",
        amount: randomBetween(tmpl.min, tmpl.max),
        description: tmpl.desc,
        status: "CONFIRMED",
        paymentMethod: tmpl.method,
        dueDate: daysAgo(day),
        paidAt: daysAgo(day),
        isRecurring: false,
        tags: ["seed"],
      },
    });
    count++;
  }

  // Algumas pendentes (futuras)
  const pendingTemplates = [
    { desc: "Aluguel próximo mês", catName: "Aluguel", amount: 3200, method: "BANK_TRANSFER" as const, dueIn: -15 },
    { desc: "Folha de pagamento próximo mês", catName: "Folha de Pagamento", amount: 2800, method: "BANK_TRANSFER" as const, dueIn: -20 },
    { desc: "Renovação licença sistema", catName: "Sistema / Software", amount: 150, method: "CREDIT_CARD" as const, dueIn: -10 },
  ];

  for (const pt of pendingTemplates) {
    const catId = categoryMap[pt.catName];
    const accId = methodToAccountId[pt.method];
    if (!catId || !accId) continue;

    await prisma.transaction.create({
      data: {
        accountId: accId,
        categoryId: catId,
        createdBy: adminUser.id,
        type: "EXPENSE",
        amount: pt.amount,
        description: pt.desc,
        status: "PENDING",
        paymentMethod: pt.method,
        dueDate: daysAgo(pt.dueIn), // negativo = futura
        isRecurring: false,
        tags: ["seed", "pendente"],
      },
    });
    count++;
  }

  // Transferência entre contas
  await prisma.transaction.create({
    data: {
      accountId: savingsId,
      categoryId: categoryMap["Importado (Pluggy)"],
      createdBy: adminUser.id,
      type: "TRANSFER",
      amount: 2000,
      description: "Transferência poupança → corrente",
      status: "CONFIRMED",
      paymentMethod: "BANK_TRANSFER",
      dueDate: daysAgo(14),
      paidAt: daysAgo(14),
      transferToAccountId: checkingId,
      isRecurring: false,
      tags: ["seed"],
    },
  });
  count++;

  console.log(`\n✅ Seed concluído!`);
  console.log(`   Contas criadas/verificadas : ${ACCOUNTS.length}`);
  console.log(`   Categorias criadas/verificadas: ${CATEGORIES.length}`);
  console.log(`   Transações inseridas       : ${count}`);
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
