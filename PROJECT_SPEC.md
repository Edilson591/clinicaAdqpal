# ADQPAL — Especificação Técnica do Projeto

> **Versão:** 1.0.0 · **Última atualização:** 2026-04-04 · **Autor:** edilson591

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Objetivo do Produto](#2-objetivo-do-produto)
3. [Público-Alvo](#3-público-alvo)
4. [Funcionalidades](#4-funcionalidades)
5. [Arquitetura do Sistema](#5-arquitetura-do-sistema)
6. [Stack Tecnológica](#6-stack-tecnológica)
7. [Estrutura de Repositório](#7-estrutura-de-repositório)
8. [Backend — Especificação Técnica](#8-backend--especificação-técnica)
9. [Frontend — Especificação Técnica](#9-frontend--especificação-técnica)
10. [Banco de Dados](#10-banco-de-dados)
11. [Autenticação e Segurança](#11-autenticação-e-segurança)
12. [Integrações Externas](#12-integrações-externas)
13. [Design System](#13-design-system)
14. [Variáveis de Ambiente](#14-variáveis-de-ambiente)
15. [Scripts e Execução](#15-scripts-e-execução)
16. [Roadmap](#16-roadmap)

---

## 1. Visão Geral

**ADQPAL** é uma plataforma web de gestão clínica desenvolvida para atender consultórios médicos e clínicas de pequeno e médio porte. O sistema centraliza o gerenciamento de pacientes, consultas, finanças e comunicação com pacientes em uma única interface moderna e responsiva.

O projeto é composto por duas aplicações independentes que se comunicam via API REST:

| Camada | Tecnologia | Descrição |
|--------|-----------|-----------|
| **Backend** | Node.js + TypeScript + Express | API REST com arquitetura hexagonal |
| **Frontend** | React + TypeScript + Vite | SPA (Single Page Application) |
| **Banco de Dados** | PostgreSQL via Supabase | Banco relacional gerenciado em nuvem |

---

## 2. Objetivo do Produto

O ADQPAL resolve os principais gargalos operacionais de uma clínica médica:

- **Gestão de pacientes**: cadastro centralizado com dados completos (nome, CPF, e-mail, telefone, data de nascimento)
- **Agendamento de consultas**: criação, visualização e atualização de consultas com status em tempo real
- **Comunicação automatizada**: envio de confirmações de consulta via WhatsApp diretamente pelo sistema
- **Controle financeiro**: painel de receitas, despesas, saldo líquido e histórico de transações
- **Acesso seguro**: autenticação JWT com controle de sessão para múltiplos médicos/funcionários

---

## 3. Público-Alvo

| Perfil | Necessidade |
|--------|-------------|
| Médicos e especialistas | Visualizar agenda, acessar prontuários, confirmar consultas |
| Secretárias / recepcionistas | Cadastrar pacientes, agendar consultas, enviar confirmações |
| Gestores de clínica | Acompanhar indicadores financeiros e operacionais |

---

## 4. Funcionalidades

### 4.1 Autenticação

- [x] Cadastro de usuário (nome, e-mail, senha)
- [x] Login com e-mail e senha
- [x] Recuperação de senha (fluxo via e-mail)
- [x] Sessão via JWT com expiração configurável
- [x] Logout com limpeza de sessão

### 4.2 Gestão de Pacientes

- [x] Listagem de pacientes com busca por nome, CPF e e-mail
- [x] Filtros: todos / com CPF / sem CPF / com e-mail
- [x] Cadastro de novo paciente
- [x] Visualização de prontuário
- [x] Edição e exclusão de paciente

### 4.3 Consultas (Appointments)

- [x] Criação de nova consulta com paciente, data/hora, médico e observações
- [x] Listagem de todas as consultas
- [x] Busca de consulta por ID
- [x] Listagem de consultas por paciente
- [x] Atualização de consulta (data, status, notas)
- [x] Exclusão de consulta
- [x] Status: `SCHEDULED` | `COMPLETED` | `CANCELLED`

### 4.4 WhatsApp

- [x] Envio de confirmação de consulta via WhatsApp (Meta Cloud API)
- [x] Mensagem formatada com data/hora em PT-BR, nome do paciente e médico
- [x] Rate limiting: 5 envios por 15 minutos por usuário

### 4.5 Dashboard

- [x] Contagem de consultas do dia
- [x] Contagem de novos pacientes
- [x] Próximo atendimento
- [x] Agenda do dia com status e acesso rápido ao prontuário

### 4.6 Gestão Financeira

- [x] KPIs: Receita Total, Despesas, Saldo Líquido, Consultas Pagas
- [x] Gráfico de barras: Receita vs Despesas (últimos 6 meses)
- [x] Painel de transações recentes com totais de entrada/saída

---

## 5. Arquitetura do Sistema

### Visão macro

```
┌─────────────────────────────────────────────────────────────┐
│                     USUÁRIO (Browser)                        │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────────┐
│               FRONTEND (React SPA)                           │
│  Vite · React Router · Redux · React Query · Axios          │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (JSON)
┌──────────────────────────▼──────────────────────────────────┐
│               BACKEND (Node.js API)                          │
│  Express · Prisma · JWT · Zod · Bcrypt                      │
└──────────────────────────┬──────────────────────────────────┘
                           │ PostgreSQL Wire Protocol
┌──────────────────────────▼──────────────────────────────────┐
│           BANCO DE DADOS (Supabase / PostgreSQL)             │
└─────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│           INTEGRAÇÕES EXTERNAS                               │
│  Meta Cloud API (WhatsApp Business)                         │
└─────────────────────────────────────────────────────────────┘
```

### Arquitetura Hexagonal (Backend)

O backend segue a arquitetura hexagonal (Ports & Adapters), separando o domínio da aplicação das dependências externas:

```
  HTTP Request
      │
      ▼
  interfaces/          ← Controllers, Middlewares, Rotas (Express)
      │
      ▼
  application/         ← Use Cases (orquestra domínio + ports)
      │
      ▼
  domain/              ← Entidades, interfaces (zero deps externas)
      │ implementa
      ▼
  infrastructure/      ← Prisma, bcrypt, JWT (adaptadores concretos)
```

**Benefícios desta arquitetura:**
- Testabilidade: use cases testáveis sem banco real
- Substituibilidade: trocar ORM ou banco sem mudar regras de negócio
- Clareza: cada camada tem responsabilidade única e explícita

---

## 6. Stack Tecnológica

### Backend

| Tecnologia | Versão | Função |
|-----------|--------|--------|
| Node.js | 20+ | Runtime JavaScript |
| TypeScript | 5.x | Tipagem estática (strict mode) |
| Express | 4.x | Framework HTTP |
| Prisma | 7.x | ORM — queries tipadas |
| Supabase (PostgreSQL) | — | Banco de dados gerenciado |
| bcryptjs | 2.x | Hash de senhas (12 rounds) |
| jsonwebtoken | 9.x | Geração e validação de JWT |
| Zod | 3.x | Validação e parsing de entrada |
| Morgan | 1.x | Logging de requisições HTTP |
| ts-node-dev | 2.x | Hot reload em desenvolvimento |

### Frontend

| Tecnologia | Versão | Função |
|-----------|--------|--------|
| React | 18+ | UI declarativa |
| TypeScript | 5.x | Tipagem estática |
| Vite | — | Build tool + dev server |
| React Router DOM | 6.x | Roteamento SPA |
| Redux Toolkit | — | Estado global (auth) |
| TanStack Query | — | Cache e estado de servidor |
| Axios | — | Cliente HTTP |
| react-hook-form | — | Gerenciamento de formulários |
| Zod | 3.x | Schemas de validação tipados |
| Tailwind CSS | — | Estilização utilitária |
| Lucide React | — | Biblioteca de ícones |

---

## 7. Estrutura de Repositório

```
clinica adqpal/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── domain/            # Entidades, interfaces (ports)
│   │   ├── application/       # Use Cases, DTOs, mappers
│   │   ├── infrastructure/    # Prisma, bcrypt, JWT
│   │   └── interfaces/        # Controllers, middlewares, rotas
│   ├── server.ts
│   ├── tsconfig.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── context/           # Auth, Theme, Sidebar
│   │   ├── hooks/             # Custom hooks (React Query)
│   │   ├── layout/            # AppLayout compartilhado
│   │   ├── pages/             # Páginas da aplicação
│   │   ├── routes/            # Definição de rotas
│   │   ├── services/          # Axios + service layer
│   │   ├── store/             # Redux (authSlice)
│   │   └── validate/          # Schemas Zod por formulário
│   ├── design/                # Arquivos .pen (Pencil)
│   └── package.json
└── PROJECT_SPEC.md            ← este arquivo
```

---

## 8. Backend — Especificação Técnica

### API Endpoints

#### Rotas Públicas

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/health` | Health check |
| `POST` | `/users/register` | Cadastro de usuário |
| `POST` | `/users/login` | Login |

#### Rotas Privadas (requerem `Authorization: Bearer <token>`)

**Usuários**

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/users/:id` | Buscar usuário por ID |
| `PUT` | `/users/:id` | Atualizar dados do usuário |
| `DELETE` | `/users/:id` | Deletar usuário |

**Consultas**

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/appointments` | Criar nova consulta |
| `GET` | `/appointments` | Listar todas as consultas |
| `GET` | `/appointments/:id` | Buscar consulta por ID |
| `GET` | `/appointments/patient/:patientId` | Consultas de um paciente |
| `PUT` | `/appointments/:id` | Atualizar consulta |
| `DELETE` | `/appointments/:id` | Deletar consulta |
| `POST` | `/appointments/:id/whatsapp` | Enviar confirmação via WhatsApp |

### Padrão de Resposta

```json
// Sucesso
{
  "success": true,
  "message": "Operação realizada com sucesso.",
  "data": { ... }
}

// Erro
{
  "success": false,
  "message": "Dados inválidos.",
  "errors": {
    "email": ["Digite um e-mail válido"]
  }
}
```

### Regras de Validação

| Campo | Regra |
|-------|-------|
| `name` | 2–100 caracteres |
| `email` | Formato válido, único no banco |
| `password` | Mín. 8 caracteres, pelo menos 1 maiúscula e 1 número |

### Rate Limiting

| Limitador | Limite | Escopo |
|-----------|--------|--------|
| `generalRateLimiter` | 100 req / 15min | Por IP |
| `whatsAppRateLimiter` | 5 envios / 15min | Por `userId` |

---

## 9. Frontend — Especificação Técnica

### Rotas da Aplicação

| Rota | Tipo | Página |
|------|------|--------|
| `/login` | Pública | `LoginPage` |
| `/esqueceu-a-senha` | Pública | `ForgotPasswordPage` |
| `/dashboard` | Privada | `DashboardPage` |
| `/pacientes` | Privada | `PatientsPage` |
| `/financeiro` | Privada | `GestaoFinanceiraPage` |
| `*` | — | Redireciona para `/login` |

### Fluxo de Autenticação

```
LoginForm
  └─ useMutation(userService.login)
        onSuccess → dispatch(setCredentials)
                       → Redux armazena token + user
                       → Cookies: adqpal_token (7d), adqpal_user (7d)
        onError   → exibe erro no formulário
```

### Cookies de Sessão

| Cookie | Conteúdo | Expiração | Flags |
|--------|----------|-----------|-------|
| `adqpal_token` | JWT | 7 dias | `SameSite=Strict` |
| `adqpal_user` | JSON do usuário | 7 dias | `SameSite=Strict` |

### Padrão de Formulários

Todos os formulários seguem a mesma arquitetura em 3 camadas:

| Camada | Ferramenta | Responsabilidade |
|--------|-----------|------------------|
| Validação | **Zod** (`src/validate/`) | Schema tipado com mensagens PT-BR |
| Estado do form | **react-hook-form** via `useZodForm` | Registro, erros, submit |
| Integração HTTP | **TanStack Query** (`useMutation`) | Chamada à API, loading, erros |

### Hierarquia de Providers

```
main.tsx
  └─ QueryClientProvider (staleTime 5min, retry 1)
        └─ App
              └─ AuthProvider
                    └─ Provider (Redux store)
                          └─ BrowserRouter + Routes
```

### Arquitetura de Layout

```
ProtectedRoute
  └─ AppLayout          ← SidebarProvider + Sidebar + <Outlet />
        └─ <página>     ← renderizada automaticamente pelo Outlet
```

Páginas **públicas** (`/login`, `/esqueceu-a-senha`) não usam `AppLayout`.

### Interceptors do Axios

| Evento | Ação |
|--------|------|
| Request | Injeta `Authorization: Bearer <token>` do cookie |
| Response 401 | `dispatch(logout())` → limpa Redux + cookies → redireciona `/login` |

---

## 10. Banco de Dados

### Schema Prisma

#### Model: `User`

```prisma
model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String   @map("password_hash")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@map("users")
}
```

#### Model: `Appointment`

```prisma
model Appointment {
  id           String            @id @default(uuid())
  userId       String
  patientId    String
  scheduledAt  DateTime
  medico       String?
  status       AppointmentStatus @default(SCHEDULED)
  notes        String?
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt

  user    User    @relation(fields: [userId], references: [id])
  patient Patient @relation(fields: [patientId], references: [id])
}

enum AppointmentStatus {
  SCHEDULED
  COMPLETED
  CANCELLED
}
```

---

## 11. Autenticação e Segurança

| Medida | Implementação |
|--------|--------------|
| Hash de senha | bcrypt com 12 rounds |
| Timing-safe login | Hash sempre comparado, mesmo quando usuário não existe |
| Token | JWT com `sub` (userId) e `email` no payload |
| Middleware de auth | Valida JWT e popula `req.userId` em todas as rotas privadas |
| Validação de entrada | Zod em todos os bodies via `validateBody` middleware |
| Rate limiting geral | 100 req/15min por IP |
| Rate limiting WhatsApp | 5 envios/15min por userId |
| Stack trace | Omitido em `NODE_ENV=production` |
| Credenciais | Exclusivamente em `.env`, nunca no código-fonte |
| HTTPS | Configurado no reverse proxy (Nginx / Railway / Render) |

---

## 12. Integrações Externas

### WhatsApp Business (Meta Cloud API)

**Endpoint:** `POST graph.facebook.com/v17.0/{PHONE_NUMBER_ID}/messages`

**Fluxo interno (`SendAppointmentWhatsApp`):**

1. Busca consulta com relações (paciente + usuário)
2. Resolve nome do médico: usa `appointment.medico` ou `user.username`
3. Formata mensagem com data/hora no fuso `America/Sao_Paulo`
4. Normaliza telefone: remove não-dígitos, adiciona código `55`
5. Envia via Meta Cloud API com Bearer token, timeout 10s
6. Erros da API viram `DomainError` HTTP 502

**Variáveis necessárias:**

| Variável | Descrição |
|----------|-----------|
| `WHATSAPP_PHONE_NUMBER_ID` | ID do número no Meta Business |
| `WHATSAPP_TOKEN` | Token permanente da API |
| `WHATSAPP_API_VERSION` | Versão da API (padrão: `v17.0`) |

### Supabase (PostgreSQL)

Banco de dados gerenciado em nuvem. Comunicação exclusiva via Prisma no backend. A Service Role Key **nunca** é exposta no frontend.

---

## 13. Design System

### Tokens de Cor

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-primary` | `#38A169` | Verde principal, ações |
| `--color-primary-dark` | `#2D3748` | Cinza escuro, títulos |
| `--color-border-input` | `#D4D4D4` | Bordas de inputs |
| `--color-muted-foreground` | `#737373` | Placeholders |
| `--color-surface` | `#FFFFFF` | Background inputs |
| `--color-ring` | `#38A169` | Focus ring |

### Tipografia (fonte: Inter)

| Elemento | Tamanho | Peso | Cor |
|----------|---------|------|-----|
| Título principal | 28px | 700 | `#1A365D` |
| Título de página | 24px | 600 | `#1E293B` |
| Label de campo | 14px | 600 | `#2D3748` |
| Input / Corpo | 16px | 400 | `#A0AEC0` |
| Botão | 16px | 600 | `#FFFFFF` |
| Texto secundário | 16px | 400 | `#718096` |

### Dimensões de Componentes

| Componente | Altura | Largura | Border Radius | Padding |
|-----------|--------|---------|---------------|---------|
| Input | 56px | fill / 320px | 8px | 16px |
| Botão | 56px | fill | 8px | — |
| Card | — | — | 16px | 48px |
| Input Group | 82px | fill / 320px | — | — |

### Temas de Página

| Página | Tema | Background |
|--------|------|-----------|
| Login / Forgot Password | Light | Gradiente |
| Dashboard | Light | `#F5F6FA` |
| Pacientes | Dark (padrão) / Light (toggle) | `#0F172A` / `#F8FAFC` |
| Financeiro | Light | `#F8FAFC` |

---

## 14. Variáveis de Ambiente

### Backend (`.env`)

| Variável | Obrigatória | Descrição | Exemplo |
|----------|------------|-----------|---------|
| `DATABASE_URL` | sim | Connection string PostgreSQL Supabase | `postgresql://...` |
| `JWT_SECRET` | sim | Segredo para assinar tokens | `sua-chave-secreta-longa` |
| `JWT_EXPIRES_IN` | não | Expiração do token | `7d` |
| `PORT` | não | Porta do servidor | `3333` |
| `NODE_ENV` | não | Ambiente de execução | `development` |
| `WHATSAPP_PHONE_NUMBER_ID` | não* | ID do número WhatsApp | `12345678` |
| `WHATSAPP_TOKEN` | não* | Token permanente Meta API | `EAABsb...` |
| `WHATSAPP_API_VERSION` | não | Versão da API WhatsApp | `v17.0` |

> *Obrigatórias apenas para uso do endpoint de WhatsApp.

---

## 15. Scripts e Execução

### Backend

```bash
# Instalar dependências
npm install

# Desenvolvimento (hot reload)
npm run dev

# Build para produção
npm run build

# Executar em produção
npm run start

# Banco de dados
npm run prisma:migrate    # Aplica migrações
npm run prisma:generate   # Regenera o Prisma Client
npm run prisma:studio     # Interface visual do banco
```

### Frontend

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

### Setup inicial completo

```bash
# 1. Clone o repositório
git clone <url-do-repo>

# 2. Configure o backend
cd backend
cp .env.example .env
# Edite .env com suas credenciais

# 3. Inicialize o banco
npm install
npm run prisma:migrate
# Informe um nome: "create_initial_schema"

# 4. Inicie o backend
npm run dev
# Backend rodando em http://localhost:3333

# 5. Configure e inicie o frontend (outro terminal)
cd ../frontend
npm install
npm run dev
# Frontend rodando em http://localhost:5173
```

---

## 16. Roadmap

### Implementado

- [x] Autenticação completa (registro, login, JWT)
- [x] CRUD de usuários
- [x] CRUD de pacientes
- [x] CRUD de consultas
- [x] Envio de confirmação via WhatsApp
- [x] Dashboard com indicadores
- [x] Gestão financeira (KPIs + gráfico + transações)
- [x] Sistema de temas dark/light (página de pacientes)
- [x] Design system com componentes reutilizáveis

### Previsto

- [ ] Módulo de prontuário eletrônico completo
- [ ] Notificações em tempo real (WebSocket)
- [ ] Relatórios exportáveis (PDF/Excel)
- [ ] Integração com agenda (Google Calendar)
- [ ] Controle de permissões por perfil (RBAC)
- [ ] Testes automatizados (Jest + Testing Library)
- [ ] CI/CD pipeline
- [ ] Deploy em produção documentado

---

*Este documento reflete o estado atual do projeto e deve ser atualizado a cada nova funcionalidade ou mudança arquitetural significativa.*
