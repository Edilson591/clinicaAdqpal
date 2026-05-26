/**
 * Seed completo — ADQPAL
 * Cobre todos os endpoints: roles, usuários, especialidades, pacientes,
 * consultas, prontuários, histórico, financeiro, funcionários e notas fiscais.
 *
 * Uso: npm run seed
 * É idempotente: pode ser executado várias vezes sem duplicar dados.
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { EncryptionService } from "../src/infrastructure/services/EncryptionService";

const prisma = new PrismaClient();
const crypto = new EncryptionService();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(10, 0, 0, 0);
  return d;
}

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(14, 0, 0, 0);
  return d;
}

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

// ─── 1. ROLES ─────────────────────────────────────────────────────────────────

const ROLES = [
  { id: 1, name: "Administrador" },
  { id: 2, name: "Usuário" },
  { id: 3, name: "Médico" },
  { id: 4, name: "Enfermeiro" },
  { id: 5, name: "Recepcionista" },
  { id: 6, name: "Técnico de Laboratório" },
  { id: 7, name: "Contador" },
  { id: 8, name: "Farmacêutico" },
  { id: 9, name: "Suporte de TI" },
];

// ─── 2. USUÁRIOS ──────────────────────────────────────────────────────────────

const USERS_DATA = [
  {
    email: "admin@adqpal.com",
    username: "Admin ADQPAL",
    password: "Admin@123",
    roleId: 1,
    cpf: "111.111.111-11",
  },
  {
    email: "dr.carlos@adqpal.com",
    username: "Dr. Carlos Silva",
    password: "Medico@123",
    roleId: 3,
    cpf: "222.222.222-22",
  },
  {
    email: "dr.ana@adqpal.com",
    username: "Dra. Ana Paula",
    password: "Medico@123",
    roleId: 3,
    cpf: "333.333.333-33",
  },
  {
    email: "dr.roberto@adqpal.com",
    username: "Dr. Roberto Menezes",
    password: "Medico@123",
    roleId: 3,
    cpf: "444.444.444-44",
  },
  {
    email: "enfermeira.julia@adqpal.com",
    username: "Júlia Ferreira",
    password: "Enfermeira@123",
    roleId: 4,
    cpf: "555.555.555-55",
  },
  {
    email: "recepcao@adqpal.com",
    username: "Mariana Costa",
    password: "Recepcao@123",
    roleId: 5,
    cpf: "666.666.666-66",
  },
  {
    email: "ti@adqpal.com",
    username: "Pedro TI",
    password: "Suporte@123",
    roleId: 9,
    cpf: "777.777.777-77",
  },
];

// ─── 3. ESPECIALIDADES ────────────────────────────────────────────────────────

const SPECIALTIES_DATA = [
  "Clínica Geral",
  "Psicologia",
  "Fisioterapia",
  "Nutrição",
  "Cardiologia",
  "Dermatologia",
  "Pediatria",
  "Ortopedia",
  "Neurologia",
  "Ginecologia",
];

// ─── 4. PACIENTES ─────────────────────────────────────────────────────────────

const PATIENTS_DATA = [
  { name: "Ana Paula Souza",      email: "ana.souza@email.com",    phone: "(11) 99201-1001", cpf: "012.345.678-90", dateOfBirth: new Date("1990-03-15"), gender: "F", city: "São Paulo",    state: "SP", street: "Rua das Flores",      streetNumber: "123", zipCode: "01310-100", agreement: "Unimed" },
  { name: "Bruno Henrique Lima",  email: "bruno.lima@email.com",   phone: "(21) 98402-2002", cpf: "123.456.789-01", dateOfBirth: new Date("1985-07-22"), gender: "M", city: "Rio de Janeiro", state: "RJ", street: "Av. Atlântica",       streetNumber: "456", zipCode: "22070-001", agreement: null },
  { name: "Carla Rodrigues",      email: "carla.rod@email.com",    phone: "(31) 97603-3003", cpf: "234.567.890-12", dateOfBirth: new Date("1978-11-08"), gender: "F", city: "Belo Horizonte", state: "MG", street: "Rua dos Inconfidentes", streetNumber: "789", zipCode: "30140-120", agreement: "Bradesco Saúde" },
  { name: "Diego Alves Santos",   email: "diego.alves@email.com",  phone: "(41) 96804-4004", cpf: "345.678.901-23", dateOfBirth: new Date("1992-05-30"), gender: "M", city: "Curitiba",     state: "PR", street: "Rua XV de Novembro",   streetNumber: "321", zipCode: "80020-310", agreement: null },
  { name: "Fernanda Oliveira",    email: "fernanda.oli@email.com", phone: "(51) 95905-5005", cpf: "456.789.012-34", dateOfBirth: new Date("1988-09-12"), gender: "F", city: "Porto Alegre", state: "RS", street: "Av. Ipiranga",         streetNumber: "654", zipCode: "90160-093", agreement: "SulAmérica" },
  { name: "Gabriel Costa Neto",   email: "gabriel.cn@email.com",   phone: "(61) 95006-6006", cpf: "567.890.123-45", dateOfBirth: new Date("2000-01-25"), gender: "M", city: "Brasília",     state: "DF", street: "SQN 210",              streetNumber: "Bloco B", zipCode: "70862-020", agreement: null },
  { name: "Helena Martins",       email: "helena.mar@email.com",   phone: "(71) 94107-7007", cpf: "678.901.234-56", dateOfBirth: new Date("1975-06-18"), gender: "F", city: "Salvador",     state: "BA", street: "Av. Tancredo Neves",   streetNumber: "987", zipCode: "41820-021", agreement: "Amil" },
  { name: "Igor Pereira",         email: "igor.per@email.com",     phone: "(81) 93208-8008", cpf: "789.012.345-67", dateOfBirth: new Date("1995-12-03"), gender: "M", city: "Recife",       state: "PE", street: "Rua da Aurora",       streetNumber: "147", zipCode: "50050-170", agreement: null },
  { name: "Juliana Ferreira",     email: "juliana.fe@email.com",   phone: "(85) 92309-9009", cpf: "890.123.456-78", dateOfBirth: new Date("1983-04-27"), gender: "F", city: "Fortaleza",    state: "CE", street: "Av. Beira Mar",        streetNumber: "258", zipCode: "60165-121", agreement: "Unimed" },
  { name: "Kleber Nascimento",    email: "kleber.nas@email.com",   phone: "(92) 91410-0010", cpf: "901.234.567-89", dateOfBirth: new Date("1970-08-14"), gender: "M", city: "Manaus",       state: "AM", street: "Rua Recife",           streetNumber: "369", zipCode: "69053-110", agreement: null },
  { name: "Larissa Campos",       email: "larissa.ca@email.com",   phone: "(11) 90511-1011", cpf: "012.345.678-91", dateOfBirth: new Date("1997-02-09"), gender: "F", city: "São Paulo",    state: "SP", street: "Rua Augusta",          streetNumber: "512", zipCode: "01304-001", agreement: "Bradesco Saúde" },
  { name: "Marcos Vinicius",      email: "marcos.vi@email.com",    phone: "(21) 99612-2012", cpf: "123.456.789-02", dateOfBirth: new Date("1980-10-21"), gender: "M", city: "Rio de Janeiro", state: "RJ", street: "Rua Voluntários da Pátria", streetNumber: "673", zipCode: "22270-010", agreement: null },
  { name: "Natalia Duarte",       email: "natalia.du@email.com",   phone: "(31) 98713-3013", cpf: "234.567.890-13", dateOfBirth: new Date("1993-07-04"), gender: "F", city: "Belo Horizonte", state: "MG", street: "Rua Espírito Santo",   streetNumber: "894", zipCode: "30160-030", agreement: "SulAmérica" },
  { name: "Otávio Reis",          email: "otavio.re@email.com",    phone: "(41) 97814-4014", cpf: "345.678.901-24", dateOfBirth: new Date("1968-03-17"), gender: "M", city: "Curitiba",     state: "PR", street: "Av. Sete de Setembro",  streetNumber: "105", zipCode: "80230-010", agreement: null },
  { name: "Patricia Gomes",       email: "patricia.go@email.com",  phone: "(51) 96915-5015", cpf: "456.789.012-35", dateOfBirth: new Date("1986-11-29"), gender: "F", city: "Porto Alegre", state: "RS", street: "Rua Padre Chagas",     streetNumber: "216", zipCode: "90570-080", agreement: "Amil" },
  { name: "Quintino Araújo",      email: "quintino.ar@email.com",  phone: "(61) 96016-6016", cpf: "567.890.123-46", dateOfBirth: new Date("1972-09-06"), gender: "M", city: "Brasília",     state: "DF", street: "CLN 402",              streetNumber: "Bloco C", zipCode: "70835-540", agreement: null },
  { name: "Renata Barros",        email: "renata.ba@email.com",    phone: "(71) 95117-7017", cpf: "678.901.234-57", dateOfBirth: new Date("1991-05-23"), gender: "F", city: "Salvador",     state: "BA", street: "Largo 2 de Julho",     streetNumber: "327", zipCode: "40060-430", agreement: "Unimed" },
  { name: "Samuel Teixeira",      email: "samuel.te@email.com",    phone: "(81) 94218-8018", cpf: "789.012.345-68", dateOfBirth: new Date("2001-01-11"), gender: "M", city: "Recife",       state: "PE", street: "Av. Boa Viagem",       streetNumber: "438", zipCode: "51021-000", agreement: null },
  { name: "Tatiana Monteiro",     email: "tatiana.mo@email.com",   phone: "(85) 93319-9019", cpf: "890.123.456-79", dateOfBirth: new Date("1977-08-30"), gender: "F", city: "Fortaleza",    state: "CE", street: "Rua Nogueira Acioli",  streetNumber: "549", zipCode: "60110-140", agreement: "Bradesco Saúde" },
  { name: "Ulisses Campos",       email: "ulisses.ca@email.com",   phone: "(11) 92420-0020", cpf: "901.234.567-80", dateOfBirth: new Date("1965-12-05"), gender: "M", city: "São Paulo",    state: "SP", street: "Av. Paulista",         streetNumber: "660", zipCode: "01310-100", agreement: null },
];

// ─── 5. CONTAS FINANCEIRAS ────────────────────────────────────────────────────

const ACCOUNTS = [
  { name: "Conta Corrente Bradesco", type: "CHECKING" as const, bank: "Bradesco", initialBalance: 15000, isDefault: true,  color: "#CC092F" },
  { name: "Poupança Itaú",           type: "SAVINGS"  as const, bank: "Itaú",     initialBalance: 8000,  isDefault: false, color: "#FF6200" },
  { name: "Caixa / Dinheiro",        type: "CASH"     as const, bank: null,       initialBalance: 500,   isDefault: false, color: "#22C55E" },
  { name: "Cartão Nubank",           type: "CREDIT_CARD" as const, bank: "Nubank", initialBalance: 0,   isDefault: false, color: "#8B5CF6" },
];

// ─── 6. CATEGORIAS FINANCEIRAS ────────────────────────────────────────────────

const CATEGORIES = [
  { name: "Consultas Particulares",  type: "INCOME"  as const, color: "#22C55E", icon: "stethoscope" },
  { name: "Convênios / Planos",      type: "INCOME"  as const, color: "#10B981", icon: "heart-pulse"  },
  { name: "Exames",                  type: "INCOME"  as const, color: "#34D399", icon: "clipboard"    },
  { name: "Procedimentos",           type: "INCOME"  as const, color: "#6EE7B7", icon: "activity"     },
  { name: "Aluguel",                 type: "EXPENSE" as const, color: "#EF4444", icon: "home"         },
  { name: "Energia Elétrica",        type: "EXPENSE" as const, color: "#F97316", icon: "zap"          },
  { name: "Água",                    type: "EXPENSE" as const, color: "#3B82F6", icon: "droplets"     },
  { name: "Internet / Telefone",     type: "EXPENSE" as const, color: "#8B5CF6", icon: "wifi"         },
  { name: "Folha de Pagamento",      type: "EXPENSE" as const, color: "#EC4899", icon: "users"        },
  { name: "Material Médico",         type: "EXPENSE" as const, color: "#F59E0B", icon: "package"      },
  { name: "Material de Escritório",  type: "EXPENSE" as const, color: "#D97706", icon: "printer"      },
  { name: "Manutenção / Reparos",    type: "EXPENSE" as const, color: "#6B7280", icon: "wrench"       },
  { name: "Sistema / Software",      type: "EXPENSE" as const, color: "#64748B", icon: "monitor"      },
  { name: "Impostos / Taxas",        type: "EXPENSE" as const, color: "#DC2626", icon: "landmark"     },
  { name: "Importado (Pluggy)",      type: "BOTH"    as const, color: "#94A3B8", icon: "link"         },
];

// ─── 7. FUNCIONÁRIOS ──────────────────────────────────────────────────────────

const EMPLOYEES_DATA = [
  { name: "Mariana Costa",   cpf: "100.200.300-40", email: "mariana.rh@adqpal.com",   phone: "(11) 91111-1001", position: "Recepcionista",      department: "Recepção",         hireDate: new Date("2022-03-01"), salary: 2800,  status: "ACTIVE"     as const, gender: "F", city: "São Paulo",    state: "SP", street: "Rua Haddock Lobo",    streetNumber: "110", zipCode: "01414-001" },
  { name: "Júlia Ferreira",  cpf: "200.300.400-50", email: "julia.rh@adqpal.com",    phone: "(11) 92222-2002", position: "Enfermeira",         department: "Enfermagem",       hireDate: new Date("2021-06-15"), salary: 3500,  status: "ACTIVE"     as const, gender: "F", city: "São Paulo",    state: "SP", street: "Rua Oscar Freire",    streetNumber: "220", zipCode: "01426-001" },
  { name: "Robson Lima",     cpf: "300.400.500-60", email: "robson.rh@adqpal.com",   phone: "(11) 93333-3003", position: "Técnico Lab.",       department: "Laboratório",      hireDate: new Date("2020-09-01"), salary: 3200,  status: "ACTIVE"     as const, gender: "M", city: "São Paulo",    state: "SP", street: "Al. Santos",          streetNumber: "330", zipCode: "01419-002" },
  { name: "Sandra Mello",    cpf: "400.500.600-70", email: "sandra.rh@adqpal.com",   phone: "(11) 94444-4004", position: "Contadora",          department: "Financeiro",       hireDate: new Date("2019-01-10"), salary: 5200,  status: "ACTIVE"     as const, gender: "F", city: "São Paulo",    state: "SP", street: "Rua da Consolação",   streetNumber: "440", zipCode: "01302-001" },
  { name: "Thiago Borges",   cpf: "500.600.700-80", email: "thiago.rh@adqpal.com",   phone: "(11) 95555-5005", position: "Farmacêutico",       department: "Farmácia",         hireDate: new Date("2023-02-01"), salary: 4100,  status: "ACTIVE"     as const, gender: "M", city: "São Paulo",    state: "SP", street: "Rua Frei Caneca",     streetNumber: "550", zipCode: "01307-001" },
  { name: "Vera Pacheco",    cpf: "600.700.800-90", email: "vera.rh@adqpal.com",     phone: "(11) 96666-6006", position: "Aux. Administrativo", department: "Administrativo",  hireDate: new Date("2018-07-20"), salary: 2200,  status: "ON_LEAVE"   as const, gender: "F", city: "São Paulo",    state: "SP", street: "Rua Pamplona",        streetNumber: "660", zipCode: "01405-001" },
  { name: "Wilson Cardoso",  cpf: "700.800.900-01", email: "wilson.rh@adqpal.com",   phone: "(11) 97777-7007", position: "Segurança",          department: "Operações",        hireDate: new Date("2020-11-05"), salary: 2500,  status: "TERMINATED" as const, gender: "M", city: "São Paulo",    state: "SP", street: "Av. Angélica",        streetNumber: "770", zipCode: "01228-200" },
  { name: "Ximena Torres",   cpf: "800.900.001-12", email: "ximena.rh@adqpal.com",   phone: "(11) 98888-8008", position: "Recepcionista",      department: "Recepção",         hireDate: new Date("2023-08-14"), salary: 2600,  status: "ACTIVE"     as const, gender: "F", city: "São Paulo",    state: "SP", street: "Rua Bela Cintra",     streetNumber: "880", zipCode: "01415-001" },
];

// ─── 8. DIAGNÓSTICOS / SERVIÇOS NF ────────────────────────────────────────────

const DIAGNOSTICOS = [
  "Hipertensão arterial sistêmica",
  "Diabetes mellitus tipo 2",
  "Ansiedade generalizada",
  "Lombalgia crônica",
  "Rinite alérgica",
  "Hipotireoidismo",
  "Gastrite crônica",
  "Síndrome metabólica",
  "Depressão leve",
  "Cefaleia tensional",
];

// const SERVICOS_NF = [
//   "Consulta Clínica Geral",
//   "Consulta Psicológica",
//   "Sessão de Fisioterapia",
//   "Consulta Nutricional",
//   "Consulta Cardiológica",
//   "Consulta Dermatológica",
//   "Consulta Pediátrica",
//   "Eletrocardiograma",
//   "Hemograma Completo",
//   "Procedimento Dermatológico",
// ];

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Iniciando seed completo ADQPAL...\n");

  // ── 1. Roles ──────────────────────────────────────────────────────────────

  console.log("👔 Criando roles...");
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: { name: role.name },
      create: { id: role.id, name: role.name },
    });
    console.log(`  ✓ ${role.id}: ${role.name}`);
  }

  // ── 2. Usuários ───────────────────────────────────────────────────────────

  console.log("\n👤 Criando usuários...");
  const userMap: Record<string, string> = {}; // email → id

  for (const u of USERS_DATA) {
    const passwordHash = await hashPassword(u.password);
    const cpfClean = u.cpf.replace(/\D/g, "");
    const encryptedEmail = crypto.encrypt(u.email) ?? u.email;
    const encryptedCpf = crypto.encrypt(cpfClean) ?? cpfClean;
    let existing = await prisma.user.findUnique({ where: { email: encryptedEmail } });
    if (!existing) {
      existing = await prisma.user.findUnique({ where: { email: u.email } });
    }

    const user = existing ?? await prisma.user.create({
      data: {
        email: encryptedEmail,
        username: u.username,
        passwordHash,
        roleId: u.roleId,
        cpf: encryptedCpf,
      },
    });

    userMap[u.email] = user.id;
    console.log(`  ${existing ? "→ já existe" : "  criado"}: ${u.username} (${u.email})`);
  }

  const adminId    = userMap["admin@adqpal.com"];
  const doctor1Id  = userMap["dr.carlos@adqpal.com"];
  const doctor2Id  = userMap["dr.ana@adqpal.com"];
  const doctor3Id  = userMap["dr.roberto@adqpal.com"];
  const doctorIds  = [doctor1Id, doctor2Id, doctor3Id];

  // ── 3. Especialidades ─────────────────────────────────────────────────────

  console.log("\n🏥 Criando especialidades...");
  const specialtyMap: Record<string, string> = {};

  for (const name of SPECIALTIES_DATA) {
    const s = await prisma.specialty.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    specialtyMap[name] = s.id;
    console.log(`  ✓ ${name}`);
  }

  // ── 4. Doctor Specialties ─────────────────────────────────────────────────

  console.log("\n🔗 Vinculando especialidades aos médicos...");
  const doctorSpecialties: Record<string, string[]> = {
    [doctor1Id]: ["Clínica Geral", "Cardiologia"],
    [doctor2Id]: ["Psicologia", "Neurologia"],
    [doctor3Id]: ["Ortopedia", "Fisioterapia"],
  };

  for (const [docId, specs] of Object.entries(doctorSpecialties)) {
    for (const specName of specs) {
      const specId = specialtyMap[specName];
      if (!specId) continue;
      await prisma.doctorSpecialty.upsert({
        where: { doctorId_specialtyId: { doctorId: docId, specialtyId: specId } },
        update: {},
        create: { doctorId: docId, specialtyId: specId },
      });
      console.log(`  ✓ médico vinculado: ${specName}`);
    }
  }

  // ── 5. Pacientes ──────────────────────────────────────────────────────────

  console.log("\n🧑‍⚕️ Criando pacientes...");
  const patientIds: string[] = [];

  for (const p of PATIENTS_DATA) {
    const cpfClean = p.cpf.replace(/\D/g, "");
    const existing = await prisma.patient.findUnique({ where: { cpf: cpfClean } });

    const patient = existing ?? await prisma.patient.create({
      data: {
        name: p.name,
        email: p.email,
        phone: p.phone,
        cpf: cpfClean,
        dateOfBirth: p.dateOfBirth,
        gender: p.gender,
        city: p.city,
        state: p.state,
        street: p.street,
        streetNumber: p.streetNumber,
        zipCode: p.zipCode,
        agreement: p.agreement,
      },
    });

    patientIds.push(patient.id);
    console.log(`  ${existing ? "→ já existe" : "  criado"}: ${p.name}`);
  }

  // ── 6. Consultas ──────────────────────────────────────────────────────────

  console.log("\n📅 Criando consultas...");

  const appointmentSpecs = [
    // Passadas — concluídas
    { daysOffset: -45, patient: 0,  doctor: doctor1Id, spec: "Clínica Geral",  status: "COMPLETED"   as const, type: "IN_PERSON" as const },
    { daysOffset: -42, patient: 1,  doctor: doctor2Id, spec: "Psicologia",     status: "COMPLETED"   as const, type: "IN_PERSON" as const },
    { daysOffset: -40, patient: 2,  doctor: doctor1Id, spec: "Cardiologia",    status: "COMPLETED"   as const, type: "IN_PERSON" as const },
    { daysOffset: -38, patient: 3,  doctor: doctor3Id, spec: "Ortopedia",      status: "COMPLETED"   as const, type: "IN_PERSON" as const },
    { daysOffset: -35, patient: 4,  doctor: doctor2Id, spec: "Neurologia",     status: "COMPLETED"   as const, type: "ONLINE"    as const },
    { daysOffset: -33, patient: 5,  doctor: doctor1Id, spec: "Clínica Geral",  status: "COMPLETED"   as const, type: "IN_PERSON" as const },
    { daysOffset: -30, patient: 6,  doctor: doctor3Id, spec: "Fisioterapia",   status: "COMPLETED"   as const, type: "IN_PERSON" as const },
    { daysOffset: -28, patient: 7,  doctor: doctor1Id, spec: "Clínica Geral",  status: "COMPLETED"   as const, type: "IN_PERSON" as const },
    { daysOffset: -25, patient: 8,  doctor: doctor2Id, spec: "Psicologia",     status: "COMPLETED"   as const, type: "ONLINE"    as const },
    { daysOffset: -22, patient: 9,  doctor: doctor3Id, spec: "Ortopedia",      status: "COMPLETED"   as const, type: "IN_PERSON" as const },
    { daysOffset: -20, patient: 10, doctor: doctor1Id, spec: "Cardiologia",    status: "COMPLETED"   as const, type: "IN_PERSON" as const },
    { daysOffset: -18, patient: 11, doctor: doctor2Id, spec: "Psicologia",     status: "COMPLETED"   as const, type: "IN_PERSON" as const },
    { daysOffset: -15, patient: 12, doctor: doctor3Id, spec: "Fisioterapia",   status: "COMPLETED"   as const, type: "IN_PERSON" as const },
    { daysOffset: -12, patient: 13, doctor: doctor1Id, spec: "Clínica Geral",  status: "CANCELLED"   as const, type: "IN_PERSON" as const },
    { daysOffset: -10, patient: 14, doctor: doctor2Id, spec: "Neurologia",     status: "COMPLETED"   as const, type: "ONLINE"    as const },
    { daysOffset:  -7, patient: 15, doctor: doctor1Id, spec: "Clínica Geral",  status: "COMPLETED"   as const, type: "IN_PERSON" as const },
    { daysOffset:  -5, patient: 16, doctor: doctor3Id, spec: "Ortopedia",      status: "COMPLETED"   as const, type: "IN_PERSON" as const },
    { daysOffset:  -3, patient: 17, doctor: doctor2Id, spec: "Psicologia",     status: "COMPLETED"   as const, type: "IN_PERSON" as const },
    { daysOffset:  -2, patient: 18, doctor: doctor1Id, spec: "Cardiologia",    status: "IN_PROGRESS" as const, type: "IN_PERSON" as const },
    { daysOffset:  -1, patient: 19, doctor: doctor3Id, spec: "Fisioterapia",   status: "CONFIRMED"   as const, type: "IN_PERSON" as const },
    // Futuras — agendadas
    { daysOffset:   2, patient: 0,  doctor: doctor2Id, spec: "Psicologia",     status: "SCHEDULED"   as const, type: "ONLINE"    as const },
    { daysOffset:   3, patient: 1,  doctor: doctor1Id, spec: "Clínica Geral",  status: "SCHEDULED"   as const, type: "IN_PERSON" as const },
    { daysOffset:   5, patient: 2,  doctor: doctor3Id, spec: "Ortopedia",      status: "SCHEDULED"   as const, type: "IN_PERSON" as const },
    { daysOffset:   7, patient: 3,  doctor: doctor2Id, spec: "Neurologia",     status: "SCHEDULED"   as const, type: "ONLINE"    as const },
    { daysOffset:  10, patient: 4,  doctor: doctor1Id, spec: "Cardiologia",    status: "SCHEDULED"   as const, type: "IN_PERSON" as const },
    { daysOffset:  12, patient: 5,  doctor: doctor3Id, spec: "Fisioterapia",   status: "SCHEDULED"   as const, type: "IN_PERSON" as const },
    { daysOffset:  14, patient: 6,  doctor: doctor2Id, spec: "Psicologia",     status: "SCHEDULED"   as const, type: "IN_PERSON" as const },
    { daysOffset:  21, patient: 7,  doctor: doctor1Id, spec: "Clínica Geral",  status: "SCHEDULED"   as const, type: "IN_PERSON" as const },
    { daysOffset:  25, patient: 8,  doctor: doctor3Id, spec: "Ortopedia",      status: "SCHEDULED"   as const, type: "IN_PERSON" as const },
    { daysOffset:  30, patient: 9,  doctor: doctor2Id, spec: "Neurologia",     status: "SCHEDULED"   as const, type: "ONLINE"    as const },
  ];

  const appointmentIds: string[] = [];

  for (const spec of appointmentSpecs) {
    const scheduledAt = spec.daysOffset < 0
      ? daysAgo(Math.abs(spec.daysOffset))
      : daysFromNow(spec.daysOffset);

    const patientId = patientIds[spec.patient];
    const specialtyId = specialtyMap[spec.spec];

    const existing = await prisma.appointment.findFirst({
      where: { patientId, userId: spec.doctor, scheduledAt },
    });

    const appt = existing ?? await prisma.appointment.create({
      data: {
        patientId,
        userId: spec.doctor,
        scheduledAt,
        status: spec.status,
        type: spec.type,
        specialtyId,
        notes: `Consulta de ${spec.spec} — agendada pelo sistema`,
      },
    });

    appointmentIds.push(appt.id);
    console.log(`  ${existing ? "→ já existe" : "  criada"}: ${PATIENTS_DATA[spec.patient].name} — ${spec.spec} (${spec.status})`);
  }

  // ── 7. Prontuários ────────────────────────────────────────────────────────

  console.log("\n📋 Criando prontuários...");

  // Pegar apenas consultas concluídas (índices 0-17 do array acima, que têm COMPLETED)
  const completedAppointmentIndices = appointmentSpecs
    .map((s, i) => ({ ...s, i }))
    .filter((s) => s.status === "COMPLETED")
    .map((s) => s.i);

  for (const idx of completedAppointmentIndices) {
    const apptId = appointmentIds[idx];
    const patientIdx = appointmentSpecs[idx].patient;
    const patientId = patientIds[patientIdx];

    const existing = await prisma.medicalRecord.findUnique({
      where: { appointmentId: apptId },
    });

    if (!existing) {
      await prisma.medicalRecord.create({
        data: {
          appointmentId: apptId,
          patientId,
          diagnosis: pick(DIAGNOSTICOS),
          prescription: `Prescrição: ${pick(["Losartana 50mg 1x/dia", "Metformina 500mg 2x/dia", "Paracetamol 750mg se necessário", "Omeprazol 20mg em jejum", "Sertralina 50mg 1x/dia"])}`,
          notes: "Paciente compareceu à consulta. Exame físico sem alterações significativas. Retorno em 30 dias.",
        },
      });
      console.log(`  ✓ prontuário: ${PATIENTS_DATA[patientIdx].name}`);
    } else {
      console.log(`  → já existe: ${PATIENTS_DATA[patientIdx].name}`);
    }
  }

  // ── 8. Histórico de Pacientes ─────────────────────────────────────────────

  console.log("\n📝 Criando histórico de pacientes...");

  const deletedHistory = await prisma.patientHistory.deleteMany({
    where: { description: { contains: "[seed]" } },
  });
  if (deletedHistory.count > 0) {
    console.log(`  🧹 Removidos ${deletedHistory.count} históricos seed anteriores.`);
  }

  const historyTypes = ["CONSULTA", "EXAME", "PRESCRICAO", "OBSERVACAO"] as const;

  for (let i = 0; i < Math.min(patientIds.length, 15); i++) {
    const patientId = patientIds[i];
    const doctorId = pick(doctorIds);
    const relatedAppt = appointmentIds.find((_, idx) => appointmentSpecs[idx]?.patient === i);

    // 2 históricos por paciente
    await prisma.patientHistory.create({
      data: {
        patientId,
        doctorId,
        appointmentId: relatedAppt ?? null,
        type: "CONSULTA",
        title: "Consulta de rotina",
        description: `[seed] Paciente relatou melhora dos sintomas. ${pick(["Pressão arterial controlada.", "Glicemia dentro dos limites.", "Dor lombar reduzida.", "Ansiedade sob controle.", "Sem queixas novas."])}`,
        attachments: [],
      },
    });

    await prisma.patientHistory.create({
      data: {
        patientId,
        doctorId,
        appointmentId: null,
        type: pick([...historyTypes]),
        title: pick(["Resultado de exames", "Alergia registrada", "Medicação atualizada", "Observação clínica"]),
        description: `[seed] ${pick(["Exames laboratoriais dentro da normalidade.", "Paciente alérgico a penicilina.", "Dose ajustada conforme resposta ao tratamento.", "Histórico familiar positivo para HAS."])}`,
        attachments: [],
      },
    });

    console.log(`  ✓ histórico: ${PATIENTS_DATA[i].name}`);
  }

  // ── 9. Contas Financeiras ─────────────────────────────────────────────────

  console.log("\n💳 Criando contas financeiras...");
  const accountMap: Record<string, string> = {};

  for (const acc of ACCOUNTS) {
    const existing = await prisma.financialAccount.findFirst({
      where: { name: acc.name },
    });
    const record = existing ?? await prisma.financialAccount.create({
      data: { name: acc.name, type: acc.type, bank: acc.bank, initialBalance: acc.initialBalance, currency: "BRL", isActive: true, isDefault: acc.isDefault, color: acc.color },
    });
    accountMap[acc.name] = record.id;
    console.log(`  ${existing ? "→ já existe" : "  criada"}: ${acc.name}`);
  }

  // ── 10. Categorias Financeiras ────────────────────────────────────────────

  console.log("\n📁 Criando categorias financeiras...");
  const categoryMap: Record<string, string> = {};

  for (const cat of CATEGORIES) {
    const existing = await prisma.financialCategory.findFirst({ where: { name: cat.name } });
    const record = existing ?? await prisma.financialCategory.create({
      data: { name: cat.name, type: cat.type, color: cat.color, icon: cat.icon, isDefault: false, isActive: true },
    });
    categoryMap[cat.name] = record.id;
    console.log(`  ${existing ? "→ já existe" : "  criada"}: ${cat.name}`);
  }

  // ── 11. Transações ────────────────────────────────────────────────────────

  console.log("\n💰 Gerando transações (últimos 90 dias)...");

  const deleted = await prisma.transaction.deleteMany({ where: { tags: { has: "seed" } } });
  if (deleted.count > 0) console.log(`  🧹 Removidas ${deleted.count} transações seed anteriores.`);

  const checkingId = accountMap["Conta Corrente Bradesco"];
  const cashId     = accountMap["Caixa / Dinheiro"];
  const creditId   = accountMap["Cartão Nubank"];
  const savingsId  = accountMap["Poupança Itaú"];

  const methodToAccountId: Record<string, string> = {
    BANK_TRANSFER: checkingId, PIX: checkingId, DEBIT_CARD: checkingId,
    CREDIT_CARD: creditId,     CASH: cashId,    INSURANCE: checkingId, OTHER: checkingId,
  };

  const FIXED_EXPENSES = [
    { desc: "Aluguel sala clínica",          catName: "Aluguel",                amount: 3200, method: "BANK_TRANSFER" as const },
    { desc: "Energia elétrica",              catName: "Energia Elétrica",        amount: 320,  method: "DEBIT_CARD"    as const },
    { desc: "Água e saneamento",             catName: "Água",                    amount: 85,   method: "DEBIT_CARD"    as const },
    { desc: "Internet fibra + telefone",     catName: "Internet / Telefone",     amount: 230,  method: "DEBIT_CARD"    as const },
    { desc: "Folha de pagamento",            catName: "Folha de Pagamento",      amount: 2800, method: "BANK_TRANSFER" as const },
    { desc: "Sistema ADQPAL / licenças",     catName: "Sistema / Software",      amount: 150,  method: "CREDIT_CARD"   as const },
    { desc: "Simples Nacional",              catName: "Impostos / Taxas",        amount: 480,  method: "BANK_TRANSFER" as const },
  ];

  const INCOME_TEMPLATES = [
    { desc: "Consulta particular",     catName: "Consultas Particulares", min: 200, max: 450, method: "PIX"       as const },
    { desc: "Consulta particular",     catName: "Consultas Particulares", min: 200, max: 450, method: "CASH"      as const },
    { desc: "Consulta Unimed",         catName: "Convênios / Planos",     min: 120, max: 280, method: "INSURANCE" as const },
    { desc: "Consulta Bradesco Saúde", catName: "Convênios / Planos",     min: 130, max: 260, method: "INSURANCE" as const },
    { desc: "Exame de sangue",         catName: "Exames",                 min: 80,  max: 200, method: "PIX"       as const },
    { desc: "Eletrocardiograma",       catName: "Exames",                 min: 150, max: 300, method: "DEBIT_CARD" as const },
    { desc: "Procedimento dermatológico", catName: "Procedimentos",       min: 350, max: 800, method: "CREDIT_CARD" as const },
    { desc: "Consulta online",         catName: "Consultas Particulares", min: 180, max: 350, method: "PIX"       as const },
  ];

  const EXPENSE_TEMPLATES = [
    { desc: "Compra material médico",  catName: "Material Médico",        min: 200, max: 900, method: "CREDIT_CARD"   as const },
    { desc: "Papel A4 / cartuchos",    catName: "Material de Escritório", min: 80,  max: 200, method: "CREDIT_CARD"   as const },
    { desc: "Manutenção equipamento",  catName: "Manutenção / Reparos",   min: 300, max: 1200, method: "BANK_TRANSFER" as const },
    { desc: "Luvas e EPIs",            catName: "Material Médico",        min: 120, max: 350, method: "PIX"           as const },
    { desc: "Dedetização / limpeza",   catName: "Manutenção / Reparos",   min: 250, max: 500, method: "PIX"           as const },
  ];

  let txCount = 0;

  for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
    const dueDay = 5 + monthOffset * 30;
    for (const fx of FIXED_EXPENSES) {
      const catId = categoryMap[fx.catName];
      const accId = methodToAccountId[fx.method];
      if (!catId || !accId) continue;
      await prisma.transaction.create({
        data: { accountId: accId, categoryId: catId, createdBy: adminId, type: "EXPENSE", amount: fx.amount, description: fx.desc, status: "CONFIRMED", paymentMethod: fx.method, dueDate: daysAgo(dueDay), paidAt: daysAgo(dueDay), isRecurring: true, tags: ["seed", "fixo"] },
      });
      txCount++;
    }
  }

  for (let day = 1; day <= 88; day += 2) {
    const numTx = Math.random() < 0.4 ? 2 : 1;
    for (let i = 0; i < numTx; i++) {
      const tmpl = pick(INCOME_TEMPLATES);
      const catId = categoryMap[tmpl.catName];
      const accId = methodToAccountId[tmpl.method];
      if (!catId || !accId) continue;
      await prisma.transaction.create({
        data: { accountId: accId, categoryId: catId, createdBy: adminId, type: "INCOME", amount: randomBetween(tmpl.min, tmpl.max), description: tmpl.desc, status: "CONFIRMED", paymentMethod: tmpl.method, dueDate: daysAgo(day), paidAt: daysAgo(day), isRecurring: false, tags: ["seed"] },
      });
      txCount++;
    }
  }

  for (let day = 1; day <= 88; day += 5) {
    const tmpl = pick(EXPENSE_TEMPLATES);
    const catId = categoryMap[tmpl.catName];
    const accId = methodToAccountId[tmpl.method];
    if (!catId || !accId) continue;
    await prisma.transaction.create({
      data: { accountId: accId, categoryId: catId, createdBy: adminId, type: "EXPENSE", amount: randomBetween(tmpl.min, tmpl.max), description: tmpl.desc, status: "CONFIRMED", paymentMethod: tmpl.method, dueDate: daysAgo(day), paidAt: daysAgo(day), isRecurring: false, tags: ["seed"] },
    });
    txCount++;
  }

  // Pendentes futuras
  for (const pt of [
    { desc: "Aluguel próximo mês",         catName: "Aluguel",           amount: 3200, method: "BANK_TRANSFER" as const, dueIn: -15 },
    { desc: "Folha próximo mês",           catName: "Folha de Pagamento", amount: 2800, method: "BANK_TRANSFER" as const, dueIn: -20 },
    { desc: "Renovação licença sistema",   catName: "Sistema / Software", amount: 150,  method: "CREDIT_CARD"   as const, dueIn: -10 },
  ]) {
    const catId = categoryMap[pt.catName];
    const accId = methodToAccountId[pt.method];
    if (!catId || !accId) continue;
    await prisma.transaction.create({
      data: { accountId: accId, categoryId: catId, createdBy: adminId, type: "EXPENSE", amount: pt.amount, description: pt.desc, status: "PENDING", paymentMethod: pt.method, dueDate: daysAgo(pt.dueIn), isRecurring: false, tags: ["seed", "pendente"] },
    });
    txCount++;
  }

  // Transferência
  await prisma.transaction.create({
    data: { accountId: savingsId, categoryId: categoryMap["Importado (Pluggy)"], createdBy: adminId, type: "TRANSFER", amount: 2000, description: "Transferência poupança → corrente", status: "CONFIRMED", paymentMethod: "BANK_TRANSFER", dueDate: daysAgo(14), paidAt: daysAgo(14), transferToAccountId: checkingId, isRecurring: false, tags: ["seed"] },
  });
  txCount++;

  console.log(`  ✅ ${txCount} transações inseridas.`);

  // ── 12. Funcionários ──────────────────────────────────────────────────────

  console.log("\n👷 Criando funcionários...");

  for (const emp of EMPLOYEES_DATA) {
    const cpfClean = emp.cpf.replace(/\D/g, "");
    const existing = await prisma.employee.findFirst({ where: { cpf: cpfClean } });

    if (!existing) {
      await prisma.employee.create({
        data: {
          name:        emp.name,
          cpf:         cpfClean,
          email:       emp.email,
          phone:       emp.phone,
          position:    emp.position,
          department:  emp.department,
          hireDate:    emp.hireDate,
          salary:      emp.salary,
          status:      emp.status,
          gender:      emp.gender,
          city:        emp.city,
          state:       emp.state,
          street:      emp.street,
          streetNumber: emp.streetNumber,
          zipCode:     emp.zipCode,
        },
      });
      console.log(`  ✓ criado: ${emp.name} (${emp.position})`);
    } else {
      console.log(`  → já existe: ${emp.name}`);
    }
  }

  // ── 13. Notas Fiscais ─────────────────────────────────────────────────────

  console.log("\n🧾 Criando notas fiscais...");

  const deletedNFs = await prisma.notaFiscal.deleteMany({
    where: { observacoes: { contains: "[seed]" } },
  });
  if (deletedNFs.count > 0) console.log(`  🧹 Removidas ${deletedNFs.count} NFs seed anteriores.`);

  const nfSpecs: Array<{
    patientIdx: number;
    servico: string;
    valor: number;
    status: "PENDENTE" | "EMITIDA" | "CANCELADA";
    daysOffset: number;
  }> = [
    { patientIdx: 0,  servico: "Consulta Clínica Geral",     valor: 280,  status: "EMITIDA",   daysOffset: 45 },
    { patientIdx: 1,  servico: "Consulta Psicológica",       valor: 350,  status: "EMITIDA",   daysOffset: 42 },
    { patientIdx: 2,  servico: "Consulta Cardiológica",      valor: 420,  status: "EMITIDA",   daysOffset: 40 },
    { patientIdx: 3,  servico: "Consulta Ortopédica",        valor: 320,  status: "EMITIDA",   daysOffset: 38 },
    { patientIdx: 4,  servico: "Consulta Neurológica",       valor: 380,  status: "EMITIDA",   daysOffset: 35 },
    { patientIdx: 5,  servico: "Consulta Clínica Geral",     valor: 250,  status: "EMITIDA",   daysOffset: 33 },
    { patientIdx: 6,  servico: "Sessão de Fisioterapia",     valor: 180,  status: "EMITIDA",   daysOffset: 30 },
    { patientIdx: 7,  servico: "Consulta Clínica Geral",     valor: 260,  status: "EMITIDA",   daysOffset: 28 },
    { patientIdx: 8,  servico: "Consulta Psicológica",       valor: 350,  status: "EMITIDA",   daysOffset: 25 },
    { patientIdx: 9,  servico: "Consulta Ortopédica",        valor: 320,  status: "EMITIDA",   daysOffset: 22 },
    { patientIdx: 10, servico: "Consulta Cardiológica",      valor: 410,  status: "EMITIDA",   daysOffset: 20 },
    { patientIdx: 11, servico: "Consulta Psicológica",       valor: 350,  status: "EMITIDA",   daysOffset: 18 },
    { patientIdx: 12, servico: "Sessão de Fisioterapia",     valor: 180,  status: "CANCELADA", daysOffset: 15 },
    { patientIdx: 13, servico: "Consulta Clínica Geral",     valor: 250,  status: "CANCELADA", daysOffset: 12 },
    { patientIdx: 14, servico: "Consulta Neurológica",       valor: 380,  status: "EMITIDA",   daysOffset: 10 },
    { patientIdx: 15, servico: "Consulta Clínica Geral",     valor: 260,  status: "EMITIDA",   daysOffset: 7  },
    { patientIdx: 16, servico: "Procedimento Dermatológico", valor: 650,  status: "EMITIDA",   daysOffset: 5  },
    { patientIdx: 17, servico: "Consulta Psicológica",       valor: 350,  status: "PENDENTE",  daysOffset: 3  },
    { patientIdx: 18, servico: "Consulta Cardiológica",      valor: 420,  status: "PENDENTE",  daysOffset: 2  },
    { patientIdx: 19, servico: "Sessão de Fisioterapia",     valor: 180,  status: "PENDENTE",  daysOffset: 1  },
    { patientIdx: 0,  servico: "Hemograma Completo",         valor: 90,   status: "PENDENTE",  daysOffset: 0  },
    { patientIdx: 1,  servico: "Eletrocardiograma",          valor: 200,  status: "PENDENTE",  daysOffset: 0  },
  ];

  // Contar NFs existentes para gerar numeração correta
  const nfCount = await prisma.notaFiscal.count();

  for (let i = 0; i < nfSpecs.length; i++) {
    const spec = nfSpecs[i];
    const patientId = patientIds[spec.patientIdx];
    const numero = `NF-${String(nfCount + i + 1).padStart(6, "0")}`;
    const createdAt = spec.daysOffset > 0 ? daysAgo(spec.daysOffset) : new Date();

    await prisma.notaFiscal.create({
      data: {
        numero,
        patientId,
        createdBy: adminId,
        servico: spec.servico,
        valor: spec.valor,
        status: spec.status,
        dataEmissao: spec.status === "EMITIDA" ? createdAt : null,
        observacoes: `[seed] Nota fiscal gerada pelo seed de dados.`,
      },
    });

    console.log(`  ✓ ${numero}: ${PATIENTS_DATA[spec.patientIdx].name} — ${spec.servico} (${spec.status})`);
  }

  // ── Resumo ────────────────────────────────────────────────────────────────

  console.log("\n" + "=".repeat(55));
  console.log("✅ Seed completo concluído!");
  console.log("=".repeat(55));
  console.log(`  Roles             : ${ROLES.length}`);
  console.log(`  Usuários          : ${USERS_DATA.length}  (admin@adqpal.com / Admin@123)`);
  console.log(`  Especialidades    : ${SPECIALTIES_DATA.length}`);
  console.log(`  Pacientes         : ${PATIENTS_DATA.length}`);
  console.log(`  Consultas         : ${appointmentSpecs.length}`);
  console.log(`  Prontuários       : ${completedAppointmentIndices.length}`);
  console.log(`  Histórico         : ${Math.min(patientIds.length, 15) * 2}`);
  console.log(`  Contas financeiras: ${ACCOUNTS.length}`);
  console.log(`  Categorias        : ${CATEGORIES.length}`);
  console.log(`  Transações        : ${txCount}`);
  console.log(`  Funcionários      : ${EMPLOYEES_DATA.length}`);
  console.log(`  Notas Fiscais     : ${nfSpecs.length}`);
  console.log("=".repeat(55));
  console.log("\n🔑 Login admin:");
  console.log("   E-mail : admin@adqpal.com");
  console.log("   Senha  : Admin@123");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    // process.exit(1);
  })
  .finally(() => prisma.$disconnect());
