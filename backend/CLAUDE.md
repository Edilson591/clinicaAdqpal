# CLAUDE.md — Backend ADQPAL

Documentação técnica do backend da aplicação ADQPAL.

---

## Stack

| Tecnologia | Versão | Papel |
|---|---|---|
| Node.js | 20+ | Runtime |
| TypeScript | 5.x | Linguagem (strict mode) |
| Express | 4.x | Framework HTTP |
| Prisma | 5.x | ORM |
| Supabase (PostgreSQL) | — | Banco de dados |
| bcryptjs | 2.x | Hash de senhas (12 rounds) |
| jsonwebtoken | 9.x | Autenticação JWT |
| Zod | 3.x | Validação de entrada |
| Morgan | 1.x | Logging de requisições |
| axios | 1.x | Cliente HTTP (WhatsApp API) |
| cors | 2.x | Controle de origens permitidas |
| dotenv | 16.x | Carregamento de variáveis de ambiente |
| express-rate-limit | 8.x | Rate limiting |
| swagger-ui-express | 5.x | Documentação interativa OpenAPI |
| ts-node-dev | 2.x | Hot reload em dev |

---

## Estrutura do Projeto

```
backend/
├─ prisma/
│  └─ schema.prisma              # Schema do banco (todos os modelos Prisma)
├─ src/
│  ├─ __tests__/                 # Testes automatizados (Jest + Supertest)
│  │  ├─ application/
│  │  │  ├─ CreateAppointment.test.ts
│  │  │  ├─ GetAppointment.test.ts
│  │  │  └─ UpdateDeleteAppointment.test.ts
│  │  ├─ domain/
│  │  │  └─ errors.test.ts
│  │  ├─ dtos/
│  │  │  └─ AppointmentDTOs.test.ts
│  │  ├─ http/
│  │  │  └─ health.test.ts
│  │  └─ infrastructure/
│  │     └─ SSEManager.test.ts
│  ├─ domain/                    # CAMADA DE DOMÍNIO (sem dependências externas)
│  │  ├─ entities/
│  │  │  ├─ Appointment.ts
│  │  │  ├─ MedicalRecord.ts
│  │  │  ├─ Patient.ts
│  │  │  ├─ PatientHistory.ts
│  │  │  └─ User.ts
│  │  ├─ errors/
│  │  │  └─ DomainError.ts       # Hierarquia de erros tipados
│  │  ├─ repositories/
│  │  │  ├─ IAppointmentRepository.ts
│  │  │  ├─ IMedicalRecordRepository.ts
│  │  │  ├─ IPatientHistoryRepository.ts
│  │  │  ├─ IPatientRepository.ts
│  │  │  └─ IUserRepository.ts
│  │  ├─ services/
│  │  │  ├─ IHashService.ts      # Port para hashing
│  │  │  └─ ITokenService.ts     # Port para JWT
│  │  └─ shared/
│  │     └─ pagination.ts        # Tipos e helpers de paginação
│  ├─ application/               # CAMADA DE APLICAÇÃO (casos de uso)
│  │  ├─ dtos/
│  │  │  ├─ AppointmentDTOs.ts
│  │  │  ├─ MedicalRecordDTOs.ts
│  │  │  ├─ PatientDTOs.ts
│  │  │  ├─ PatientHistoryDTOs.ts
│  │  │  └─ UserDTOs.ts
│  │  ├─ mappers/
│  │  │  ├─ appointmentMapper.ts
│  │  │  ├─ medicalRecordMapper.ts
│  │  │  ├─ patientMapper.ts
│  │  │  └─ userMapper.ts
│  │  └─ use-cases/
│  │     ├─ CreateAppointment.ts
│  │     ├─ CreateMedicalRecord.ts
│  │     ├─ CreatePatient.ts
│  │     ├─ CreatePatientHistory.ts
│  │     ├─ DeleteAppointment.ts
│  │     ├─ DeleteMedicalRecord.ts
│  │     ├─ DeletePatient.ts
│  │     ├─ DeleteUser.ts
│  │     ├─ GetAppointment.ts
│  │     ├─ GetMedicalRecord.ts
│  │     ├─ GetPatient.ts
│  │     ├─ GetUser.ts
│  │     ├─ ListPatientHistory.ts
│  │     ├─ LoginUser.ts
│  │     ├─ RegisterUser.ts
│  │     ├─ SendAppointmentWhatsApp.ts
│  │     ├─ SoftDeletePatientHistory.ts
│  │     ├─ UpdateAppointment.ts
│  │     ├─ UpdateMedicalRecord.ts
│  │     ├─ UpdatePatient.ts
│  │     └─ UpdateUser.ts
│  ├─ infrastructure/            # CAMADA DE INFRAESTRUTURA (implementações concretas)
│  │  ├─ database/
│  │  │  └─ prismaClient.ts      # Singleton do PrismaClient
│  │  ├─ repositories/
│  │  │  ├─ PrismaAppointmentRepository.ts
│  │  │  ├─ PrismaMedicalRecordRepository.ts
│  │  │  ├─ PrismaPatientHistoryRepository.ts
│  │  │  ├─ PrismaPatientRepository.ts
│  │  │  └─ PrismaUserRepository.ts
│  │  ├─ services/
│  │  │  ├─ BcryptHashService.ts
│  │  │  ├─ JwtTokenService.ts
│  │  │  └─ WhatsAppService.ts   # Integração Meta Cloud API
│  │  └─ sse/
│  │     └─ SSEManager.ts        # Server-Sent Events para notificações em tempo real
│  └─ interfaces/                # CAMADA DE INTERFACES (HTTP)
│     ├─ controllers/
│     │  ├─ AppointmentController.ts
│     │  ├─ MedicalRecordController.ts
│     │  ├─ PatientController.ts
│     │  ├─ PatientHistoryController.ts
│     │  └─ UserController.ts
│     ├─ middlewares/
│     │  ├─ authMiddleware.ts    # Valida JWT, popula req.userId
│     │  ├─ errorMiddleware.ts   # Tratamento global de erros
│     │  ├─ rateLimiter.ts       # Rate limiters (geral + WhatsApp)
│     │  └─ validateBody.ts      # Validação de body via Zod
│     ├─ routes/
│     │  ├─ appointmentRoutes.ts
│     │  ├─ historyRoutes.ts     # DELETE /history/:id (soft delete)
│     │  ├─ medicalRecordRoutes.ts
│     │  ├─ patientHistoryRoutes.ts
│     │  ├─ patientRoutes.ts
│     │  └─ userRoutes.ts
│     └─ http/
│        └─ app.ts               # Express app (middlewares + rotas)
└─ server.ts                     # Entry point (listen)
```

---

## Arquitetura Hexagonal

```
                    ┌─────────────────────────────────────┐
  HTTP Request ──▶  │  interfaces (Express controllers)   │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────▼──────────────────────┐
                    │  application (use cases)             │
                    │  - orquestra domain + ports          │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────▼──────────────────────┐
                    │  domain (entidades + interfaces)     │
                    │  - zero dependências externas        │
                    └──────────────┬──────────────────────┘
                                   │ implementa
                    ┌──────────────▼──────────────────────┐
                    │  infrastructure (Prisma, bcrypt, JWT)│
                    └─────────────────────────────────────┘
```

---

## Variáveis de Ambiente

Copie `.env.example` para `.env` e preencha:

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Connection string PostgreSQL do Supabase |
| `JWT_SECRET` | Segredo para assinar tokens JWT |
| `JWT_EXPIRES_IN` | Expiração do token (padrão: `7d`) |
| `PORT` | Porta do servidor (padrão: `3333`) |
| `NODE_ENV` | `development` \| `production` \| `test` |
| `SYNC_SECRET` | Segredo usado por rotas internas automatizadas, como `/internal/keepalive` |
| `ALLOWED_ORIGINS` | Origens CORS permitidas, separadas por vírgula (padrão: `http://localhost:5174`) |
| `WHATSAPP_PHONE_NUMBER_ID` | ID do número de telefone (encontrado em business.facebook.com → seu app → WhatsApp → Configuração da API) |
| `WHATSAPP_TOKEN` | Token permanente de acesso à API |
| `WHATSAPP_API_VERSION` | Versão da API (padrão: `v17.0`) |

### Onde obter a DATABASE_URL no Supabase

1. Acesse [supabase.com](https://supabase.com) → seu projeto
2. Vá em **Settings → Database → Connection string**
3. Selecione **URI** e copie
4. Substitua `[YOUR-PASSWORD]` pela senha do banco

---

## Scripts

```bash
npm run dev              # Servidor em modo watch (ts-node-dev)
npm run build            # Compila TypeScript → dist/
npm run start            # Executa dist/server.js
npm run test             # Roda todos os testes (Jest, sequencial)
npm run test:watch       # Roda testes em modo watch
npm run prisma:migrate   # Aplica migrações (cria/altera tabelas)
npm run prisma:studio    # Interface visual do banco (Prisma Studio)
npm run prisma:generate  # Regenera o Prisma Client
```

---

## Documentação Interativa (Swagger)

A documentação completa da API fica disponível automaticamente na **rota raiz** do backend:

> Em produção (`NODE_ENV=production` ou `VERCEL_ENV=production`), o Swagger não é exposto para evitar divulgação das rotas da API.

| Recurso | URL | Descrição |
|---------|-----|-----------|
| Swagger UI | `http://localhost:3333/` | Interface interativa para testar endpoints |
| JSON OpenAPI | `http://localhost:3333/api-docs.json` | Schema OpenAPI 3.0.3 para importar em ferramentas |

### Para usar a documentação

1. Inicie o servidor: `npm run dev`
2. Acesse `http://localhost:3333` no navegador
3. Clique em **Authorize** (🔒) no canto superior direito e insira o token JWT ou o `SYNC_SECRET` nas rotas internas
4. Explore e teste todos os endpoints diretamente pela interface

### O que está documentado

Todas as rotas públicas e privadas da API, incluindo schemas de requisição/resposta, parâmetros de query, exemplos e códigos de status HTTP.

### Arquivo de configuração

A especificação OpenAPI fica em `src/interfaces/http/swagger.ts`. Para adicionar novos endpoints, basta editar o objeto `paths` seguindo o padrão OpenAPI 3.0.3.

O workflow que chama o endpoint interno de keep-alive fica em `.github/workflows/keep-alive.yml`.

---

## Banco de Dados (Prisma)

### Setup inicial

```bash
# 1. Configure DATABASE_URL no .env

# 2. Crie a primeira migration (gera e aplica a tabela)
npm run prisma:migrate
# → Informe um nome, ex: "create_users_table"

# 3. Gere o client (já feito automaticamente no postinstall)
npm run prisma:generate
```

### Modelos no schema (`prisma/schema.prisma`)

**Role**

```prisma
model Role {
  id    Int    @id @default(autoincrement())
  name  String @unique
  users User[]

  @@map("roles")
}
```

**User** — campos reais (diferem do exemplo original):

```prisma
model User {
  id           String   @id @default(uuid())
  username     String   @unique
  email        String   @unique
  passwordHash String   @map("password_hash")
  roleId       Int      @map("role_id")
  role         Role     @relation(...)
  cpf          String?  @unique
  -- demais campos opcionais (phone, etc.)
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@map("users")
}
```

> **Atenção:** o campo de nome do usuário é `username` (não `name`). O modelo possui `roleId` (FK para `roles`) e `cpf` opcional.

**Patient**, **Appointment**, **MedicalRecord**, **PatientHistory** — ver seções específicas abaixo.

---

## Rotas da API

### Base URL: `http://localhost:3333`

### Rotas Públicas

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/users/register` | Criar usuário |
| `POST` | `/users/login` | Autenticar usuário |

### Rotas Internas

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| `GET` | `/internal/keepalive` | `Authorization: Bearer <SYNC_SECRET>` quando `SYNC_SECRET` estiver definido | Executa `SELECT 1` via Prisma para manter a conexão com o banco ativa |

Exemplo:

```bash
curl -H "Authorization: Bearer $SYNC_SECRET" http://localhost:3333/internal/keepalive
```

### Rotas Privadas (requerem `Authorization: Bearer <token>`)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/users/:id` | Buscar usuário por ID |
| `PUT` | `/users/:id` | Atualizar usuário |
| `DELETE` | `/users/:id` | Deletar usuário |

---

## Exemplos de Requisição

### POST /users/register

```json
// Body
{
  "name": "Maria Silva",
  "email": "maria@adqpal.com",
  "password": "Senha123"
}

// Response 201
{
  "success": true,
  "message": "Usuário criado com sucesso.",
  "data": {
    "id": "uuid",
    "name": "Maria Silva",
    "email": "maria@adqpal.com",
    "createdAt": "2026-03-25T00:00:00.000Z",
    "updatedAt": "2026-03-25T00:00:00.000Z"
  }
}
```

### POST /users/login

```json
// Body
{
  "email": "maria@adqpal.com",
  "password": "Senha123"
}

// Response 200
{
  "success": true,
  "message": "Login realizado com sucesso.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "id": "...", "name": "Maria Silva", ... }
  }
}
```

### PUT /users/:id

```http
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Maria Santos"
}
```

---

## Regras de Validação

### Registro / Atualização de senha

| Campo | Regra |
|---|---|
| `name` | 2–100 caracteres |
| `email` | formato válido, único no banco |
| `password` | mín. 8 chars, pelo menos 1 maiúscula e 1 número |

### Resposta de erro padronizada

```json
{
  "success": false,
  "message": "Dados inválidos.",
  "errors": {
    "email": ["Digite um e-mail válido"],
    "password": ["Senha deve conter pelo menos uma letra maiúscula"]
  }
}
```

---

## Histórico do Paciente (PatientHistory)

Implementado em 2026-04-04. Registra todas as interações médicas de um paciente ao longo do tempo.

### Modelo `PatientHistory`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | String (UUID) | sim | Gerado automaticamente |
| patientId | String (UUID FK) | sim | Referência ao paciente |
| doctorId | String (UUID FK) | sim | Usuário que criou o registro |
| appointmentId | String (UUID FK) | não | Consulta relacionada (opcional) |
| type | Enum | sim | `CONSULTA` \| `EXAME` \| `PRESCRICAO` \| `OBSERVACAO` \| `SOLICITACAO` |
| title | String | sim | Resumo (3–200 chars) |
| description | String | sim | Detalhes completos (mín. 10 chars) |
| attachments | String[] | não | URLs de arquivos anexados |
| deletedAt | DateTime? | — | Soft delete (null = ativo) |
| createdAt | DateTime | auto | Timestamp de criação |
| updatedAt | DateTime | auto | Timestamp de atualização |

### Rotas (requerem `Authorization: Bearer <token>`)

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/patients/:patientId/history` | Criar registro (médico/admin) |
| `GET` | `/patients/:patientId/history` | Listar histórico (paginado) |
| `GET` | `/patients/:patientId/history?type=EXAME` | Filtrar por tipo |
| `GET` | `/patients/:patientId/history?search=texto` | Busca em título/descrição |
| `DELETE` | `/history/:id` | Soft delete (criador ou admin) |

### Regras de negócio

- Apenas `roleId = 1` (ADMIN) e `roleId = 3` (DOCTOR) podem criar registros → `ForbiddenError` 403 para outros roles
- Soft delete: `deletedAt` é preenchido — o registro nunca é apagado permanentemente
- Apenas o criador (`doctorId`) ou um ADMIN pode deletar
- Listagem filtra `deletedAt IS NULL` automaticamente — registros deletados ficam invisíveis
- Busca (`?search=`) é case-insensitive em `title` e `description` (OR)
- Ordenação padrão: `createdAt DESC`

### Arquivos criados

| Camada | Arquivo |
|--------|---------|
| Domain | `src/domain/entities/PatientHistory.ts` |
| Domain | `src/domain/repositories/IPatientHistoryRepository.ts` |
| Domain | `src/domain/errors/DomainError.ts` → adicionado `ForbiddenError` (403) |
| Application | `src/application/dtos/PatientHistoryDTOs.ts` |
| Application | `src/application/use-cases/CreatePatientHistory.ts` |
| Application | `src/application/use-cases/ListPatientHistory.ts` |
| Application | `src/application/use-cases/SoftDeletePatientHistory.ts` |
| Infrastructure | `src/infrastructure/repositories/PrismaPatientHistoryRepository.ts` |
| Interfaces | `src/interfaces/controllers/PatientHistoryController.ts` |
| Interfaces | `src/interfaces/routes/patientHistoryRoutes.ts` |
| Interfaces | `src/interfaces/routes/historyRoutes.ts` |

---

## Segurança

- Senhas armazenadas com **bcrypt** (12 rounds — custo alto, brute force lento)
- **Timing-safe**: o login sempre compara hash mesmo quando o usuário não existe
- JWT com `sub` (user id) e `email` no payload
- Middleware de erro não vaza stack trace em produção (`NODE_ENV=production`)
- Service Role Key do Supabase usada **apenas no backend** (nunca no frontend)

---

## Consultas (Appointments)

### Modelo `Appointment`

| Campo       | Tipo             | Obrigatório | Descrição                                    |
|-------------|------------------|-------------|----------------------------------------------|
| id          | String (UUID)    | sim         | Identificador único gerado automaticamente   |
| userId      | String (UUID FK) | sim         | Referência ao usuário (médico responsável)   |
| patientId   | String (UUID FK) | sim         | Referência ao paciente                       |
| scheduledAt | DateTime         | sim         | Data e horário da consulta                   |
| medico      | String?          | não         | Nome do médico (override ao userId)          |
| status      | Enum             | sim         | `SCHEDULED` \| `COMPLETED` \| `CANCELLED`   |
| notes       | String?          | não         | Observações da consulta                      |
| createdAt   | DateTime         | auto        | Timestamp de criação                         |
| updatedAt   | DateTime         | auto        | Timestamp de atualização                     |

### Rotas de Consultas (requerem `Authorization: Bearer <token>`)

| Método | Rota                                | Descrição                         |
|--------|-------------------------------------|-----------------------------------|
| POST   | `/appointments`                     | Criar nova consulta               |
| GET    | `/appointments`                     | Listar todas as consultas         |
| GET    | `/appointments/:id`                 | Buscar consulta por ID            |
| GET    | `/appointments/patient/:patientId`  | Listar consultas de um paciente   |
| PUT    | `/appointments/:id`                 | Atualizar consulta                |
| DELETE | `/appointments/:id`                 | Deletar consulta                  |
| POST   | `/appointments/:id/whatsapp`        | Enviar confirmação via WhatsApp   |

### Exemplo: Criar Consulta

```json
// POST /appointments
{
  "userId": "uuid-do-medico",
  "patientId": "uuid-do-paciente",
  "scheduledAt": "2025-06-15T14:30:00.000Z",
  "medico": "Dr. Silva",
  "notes": "Primeira consulta — trazer exames anteriores"
}
```

---

## Envio de Consulta via WhatsApp

**Rota:** `POST /appointments/:id/whatsapp`

**Body:**
```json
{ "telefone": "+5511999999999" }
```

### Passo a passo interno (`SendAppointmentWhatsApp.execute`)

1. **Busca com relações** — `findByIdWithRelations(id)` retorna consulta + paciente (`name`, `phone`, `email`) + usuário (`username`)
2. **Resolve o médico** — usa `appointment.medico` se preenchido; senão usa `user.username`
3. **Formata a mensagem** — data/hora no fuso `America/Sao_Paulo`, status em português, observações apenas se preenchidas
4. **Normaliza o telefone** — remove não-dígitos, adiciona código `55` se necessário
5. **Envia via Meta Cloud API** — `POST graph.facebook.com/v17.0/{PHONE_NUMBER_ID}/messages` com Bearer token, timeout 10s
6. **Trata erros** — falhas da API viram `DomainError` HTTP 502 sem expor stack trace

### Configuração WhatsApp

As variáveis `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_TOKEN` e `WHATSAPP_API_VERSION` estão documentadas na seção **Variáveis de Ambiente** acima.

Para obter as credenciais: acesse **business.facebook.com** → seu app → WhatsApp → Configuração da API.

### Rate Limit do endpoint WhatsApp

- **5 envios por 15 minutos** por usuário autenticado (chave = `userId`)
- Retorna HTTP 429 com mensagem em português se limite atingido

---

## Segurança Detalhada

| Medida                  | Implementação                                               |
|-------------------------|-------------------------------------------------------------|
| Autenticação            | JWT Bearer em todas as rotas via `authMiddleware`           |
| Validação de entrada    | Zod em todos os bodies via `validateBody` middleware        |
| Rate limiting geral     | `generalRateLimiter` — 100 req/15min por IP                 |
| Rate limiting WhatsApp  | `whatsAppRateLimiter` — 5 envios/15min por userId           |
| Credenciais             | Exclusivamente em `.env`, nunca no código                   |
| Erros sem stack trace   | `errorMiddleware` omite detalhes em `NODE_ENV=production`   |
| HTTPS                   | Configurar no reverse proxy (Nginx, Railway, Render, etc.)  |

---

## Pacientes (Patients)

### Modelo `Patient`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | String (UUID) | sim | Gerado automaticamente |
| name | String | sim | Nome completo |
| email | String? | não | E-mail único |
| phone | String? | não | Telefone |
| cpf | String? | não | CPF único |
| dateOfBirth | DateTime? | não | Data de nascimento |
| street | String? | não | Endereço |
| gender | String? | não | Gênero |
| agreement | String? | não | Plano/convênio |
| createdAt | DateTime | auto | Timestamp de criação |
| updatedAt | DateTime | auto | Timestamp de atualização |

### Rotas de Pacientes (requerem `Authorization: Bearer <token>`)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/patients` | Criar paciente |
| GET | `/patients` | Listar pacientes |
| GET | `/patients/:id` | Buscar paciente por ID |
| PUT | `/patients/:id` | Atualizar paciente |
| DELETE | `/patients/:id` | Deletar paciente |

---

## Prontuários (MedicalRecords)

Cada prontuário está vinculado a uma consulta (`appointmentId` único — 1:1 com `Appointment`) e a um paciente.

### Modelo `MedicalRecord`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | String (UUID) | sim | Gerado automaticamente |
| appointmentId | String (UUID FK) | sim | Referência única à consulta |
| patientId | String (UUID FK) | sim | Referência ao paciente |
| diagnosis | String? | não | Diagnóstico |
| prescription | String? | não | Prescrição |
| notes | String? | não | Observações livres |
| createdAt | DateTime | auto | Timestamp de criação |
| updatedAt | DateTime | auto | Timestamp de atualização |

### Rotas de Prontuários (requerem `Authorization: Bearer <token>`)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/medical-records` | Criar prontuário |
| GET | `/medical-records` | Listar prontuários |
| GET | `/medical-records/:id` | Buscar prontuário por ID |
| PUT | `/medical-records/:id` | Atualizar prontuário |
| DELETE | `/medical-records/:id` | Deletar prontuário |

---

## Server-Sent Events (SSE)

`src/infrastructure/sse/SSEManager.ts` — gerencia conexões SSE para envio de notificações em tempo real ao frontend (ex.: atualização de agenda, status de consulta).

- Singleton que mantém mapa de clientes conectados por `userId`
- Frontend conecta em `GET /sse` (ou rota equivalente) com header `Accept: text/event-stream`
- Usado pelos controllers para emitir eventos após operações críticas

---

## Integração Pluggy (Open Banking)

Implementado em 2026-04-09. Permite conectar contas bancárias via Open Banking regulado pelo Banco Central do Brasil.

### Setup

```bash
# Instalar o SDK do Pluggy
npm install pluggy-sdk

# Aplicar a migration
npm run prisma:migrate
```

### Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `PLUGGY_CLIENT_ID` | Client ID obtido no dashboard Pluggy |
| `PLUGGY_CLIENT_SECRET` | Client Secret do dashboard Pluggy |
| `PLUGGY_WEBHOOK_URL` | URL pública do backend para receber webhooks (ex: `https://seu-dominio.com/pluggy/webhook`) |

### Rotas (`/pluggy`)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/pluggy/connect-token` | JWT | Cria token temporário para o widget Pluggy Connect |
| `GET` | `/pluggy/items` | JWT | Lista conexões bancárias ativas |
| `POST` | `/pluggy/sync/:itemId` | JWT | Sincroniza contas + últimas 90 dias de transações |
| `DELETE` | `/pluggy/items/:itemId` | JWT | Desconecta um banco (remove local + Pluggy) |
| `POST` | `/pluggy/webhook` | Nenhuma | Recebe eventos automáticos do Pluggy |

### Fluxo de Conexão

1. Frontend solicita `GET /pluggy/connect-token`
2. Backend cria token no Pluggy SDK → retorna `accessToken`
3. Frontend abre o widget Pluggy Connect com o token
4. Usuário autentica com o banco → widget chama `onSuccess({ item.id })`
5. Frontend envia `POST /pluggy/sync/:itemId`
6. Backend sincroniza: cria `PluggyItem` + `FinancialAccount` + `Transaction` (usando `reference: "pluggy_<id>"` para evitar duplicatas)

### Modelo `PluggyItem` (Prisma)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `pluggyItemId` | String (único) | ID do item no Pluggy |
| `connectorName` | String | Nome do banco (ex: "Bradesco") |
| `connectorLogo` | String? | URL do logo do banco |
| `status` | String | `UPDATED` \| `UPDATING` \| `LOGIN_ERROR` \| `OUTDATED` |
| `lastSync` | DateTime? | Última sincronização bem-sucedida |

### Arquivos criados

| Camada | Arquivo |
|--------|---------|
| Infrastructure | `src/infrastructure/services/PluggyService.ts` |
| Interfaces | `src/interfaces/controllers/PluggyController.ts` |
| Interfaces | `src/interfaces/routes/pluggyRoutes.ts` |
| Prisma | `prisma/migrations/20260409220000_pluggy_integration/` |

### Mapeamentos

**Tipo de conta Pluggy → AccountType:**
- `BANK` / `SAVINGS` → `CHECKING` / `SAVINGS`
- `CREDIT` → `CREDIT_CARD`
- `INVESTMENT` → `INVESTMENT`

**Tipo de transação Pluggy → TransactionType:**
- `CREDIT` → `INCOME`
- `DEBIT` → `EXPENSE`

---

## Módulo Financeiro

Implementado em 2026-04-09. Gerencia contas, categorias e transações financeiras da clínica.

### Modelo `FinancialAccount`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | String (UUID) | sim | Gerado automaticamente |
| name | String | sim | Nome da conta |
| type | Enum | sim | `CHECKING` \| `SAVINGS` \| `CASH` \| `CREDIT_CARD` \| `INVESTMENT` |
| bank | String? | não | Nome do banco |
| initialBalance | Float | sim | Saldo inicial |
| currency | String | sim | Moeda (padrão: `BRL`) |
| isActive | Boolean | sim | Conta ativa/inativa |
| isDefault | Boolean | sim | Conta padrão |
| color | String? | não | Cor para exibição |
| createdAt | DateTime | auto | Timestamp de criação |
| updatedAt | DateTime | auto | Timestamp de atualização |

### Modelo `FinancialCategory`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | String (UUID) | sim | Gerado automaticamente |
| name | String | sim | Nome da categoria |
| type | Enum | sim | `INCOME` \| `EXPENSE` \| `BOTH` |
| color | String? | não | Cor para exibição |
| icon | String? | não | Ícone da categoria |
| parentId | String? | não | FK para categoria pai (subcategorias) |
| isDefault | Boolean | sim | Categoria padrão do sistema |
| isActive | Boolean | sim | Categoria ativa/inativa |
| createdAt | DateTime | auto | Timestamp de criação |
| updatedAt | DateTime | auto | Timestamp de atualização |

### Modelo `Transaction`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | String (UUID) | sim | Gerado automaticamente |
| accountId | String (UUID FK) | sim | Conta financeira |
| categoryId | String (UUID FK) | sim | Categoria da transação |
| patientId | String (UUID FK) | não | Paciente relacionado (opcional) |
| appointmentId | String (UUID FK) | não | Consulta relacionada (opcional) |
| createdBy | String (UUID FK) | sim | Usuário que criou |
| type | Enum | sim | `INCOME` \| `EXPENSE` \| `TRANSFER` |
| amount | Float | sim | Valor da transação |
| description | String | sim | Descrição |
| status | Enum | sim | `PENDING` \| `CONFIRMED` \| `CANCELLED` |
| paymentMethod | Enum | sim | `CASH` \| `CREDIT_CARD` \| `DEBIT_CARD` \| `PIX` \| `BANK_TRANSFER` \| `INSURANCE` \| `OTHER` |
| dueDate | DateTime | sim | Data de vencimento |
| paidAt | DateTime? | não | Data de pagamento efetivo |
| reference | String? | não | Referência externa |
| isRecurring | Boolean | sim | Transação recorrente |
| recurringGroupId | String? | não | Agrupa recorrências |
| installmentNumber | Int? | não | Número da parcela |
| totalInstallments | Int? | não | Total de parcelas |
| transferToAccountId | String? | não | Conta destino (para transferências) |
| tags | String[] | não | Tags livres |
| attachmentUrl | String? | não | URL de comprovante/anexo |
| deletedAt | DateTime? | — | Soft delete |
| createdAt | DateTime | auto | Timestamp de criação |
| updatedAt | DateTime | auto | Timestamp de atualização |

### Rotas (requerem `Authorization: Bearer <token>`)

#### Contas (`/financial-accounts`)

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/financial-accounts` | Criar conta |
| `GET` | `/financial-accounts` | Listar contas |
| `GET` | `/financial-accounts/:id` | Buscar conta por ID |
| `PUT` | `/financial-accounts/:id` | Atualizar conta |
| `DELETE` | `/financial-accounts/:id` | Deletar conta |

#### Categorias (`/financial-categories`)

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/financial-categories` | Criar categoria |
| `GET` | `/financial-categories` | Listar categorias |
| `GET` | `/financial-categories/:id` | Buscar categoria por ID |
| `PUT` | `/financial-categories/:id` | Atualizar categoria |
| `DELETE` | `/financial-categories/:id` | Deletar categoria |

#### Transações (`/transactions`)

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/transactions` | Criar transação |
| `GET` | `/transactions` | Listar transações (com filtros) |
| `GET` | `/transactions/:id` | Buscar transação por ID |
| `PUT` | `/transactions/:id` | Atualizar transação |
| `DELETE` | `/transactions/:id` | Deletar transação (soft delete) |

### Filtros disponíveis em `GET /transactions`

`?accountId=` `?categoryId=` `?patientId=` `?appointmentId=` `?type=` `?status=` `?paymentMethod=` `?dateStart=` `?dateEnd=` `?search=` `?page=` `?limit=`

### Arquivos criados

| Camada | Arquivo |
|--------|---------|
| Domain | `src/domain/entities/FinancialAccount.ts` |
| Domain | `src/domain/entities/FinancialCategory.ts` |
| Domain | `src/domain/entities/Transaction.ts` |
| Domain | `src/domain/repositories/IFinancialAccountRepository.ts` |
| Domain | `src/domain/repositories/IFinancialCategoryRepository.ts` |
| Domain | `src/domain/repositories/ITransactionRepository.ts` |
| Application | `src/application/dtos/FinancialDTOs.ts` |
| Application | `src/application/mappers/financialMapper.ts` |
| Application | `src/application/use-cases/CreateFinancialAccount.ts` |
| Application | `src/application/use-cases/UpdateFinancialAccount.ts` |
| Application | `src/application/use-cases/DeleteFinancialAccount.ts` |
| Application | `src/application/use-cases/ListFinancialAccounts.ts` |
| Application | `src/application/use-cases/CreateFinancialCategory.ts` |
| Application | `src/application/use-cases/UpdateFinancialCategory.ts` |
| Application | `src/application/use-cases/DeleteFinancialCategory.ts` |
| Application | `src/application/use-cases/ListFinancialCategories.ts` |
| Application | `src/application/use-cases/CreateTransaction.ts` |
| Application | `src/application/use-cases/UpdateTransaction.ts` |
| Application | `src/application/use-cases/DeleteTransaction.ts` |
| Application | `src/application/use-cases/ListTransactions.ts` |
| Infrastructure | `src/infrastructure/repositories/PrismaFinancialAccountRepository.ts` |
| Infrastructure | `src/infrastructure/repositories/PrismaFinancialCategoryRepository.ts` |
| Infrastructure | `src/infrastructure/repositories/PrismaTransactionRepository.ts` |
| Interfaces | `src/interfaces/controllers/FinancialController.ts` |
| Interfaces | `src/interfaces/routes/financialAccountRoutes.ts` |
| Interfaces | `src/interfaces/routes/financialCategoryRoutes.ts` |
| Interfaces | `src/interfaces/routes/transactionRoutes.ts` |
| Prisma | `prisma/migrations/20260409192225_financial_module/` |

---

## Adicionando Novas Entidades

Para adicionar, por exemplo, `Paciente`:

1. **Domain**: `src/domain/entities/Paciente.ts` + `src/domain/repositories/IPacienteRepository.ts`
2. **Prisma**: adicione o model em `prisma/schema.prisma` → `npm run prisma:migrate`
3. **Infrastructure**: `src/infrastructure/repositories/PrismaPacienteRepository.ts`
4. **Application**: `src/application/use-cases/` (CRUD do paciente) + DTOs
5. **Interfaces**: controller + rotas em `src/interfaces/`
6. **App**: registre a rota em `src/interfaces/http/app.ts`

---

## RH — Funcionários (Employees)

Implementado em 2026-04-13. Gerencia o cadastro e ciclo de vida dos funcionários da clínica.

### Modelo `Employee`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | String (UUID) | sim | Gerado automaticamente |
| name | String | sim | Nome completo |
| cpf | String? | não | CPF único (11 dígitos) |
| email | String? | não | E-mail único |
| phone | String? | não | Telefone |
| position | String | sim | Cargo/função |
| department | String? | não | Departamento/setor |
| hireDate | DateTime? | não | Data de admissão |
| salary | Decimal? | não | Salário (10,2) |
| status | Enum | sim | `ACTIVE` \| `INACTIVE` \| `ON_LEAVE` \| `TERMINATED` (padrão: `ACTIVE`) |
| dateOfBirth | DateTime? | não | Data de nascimento |
| gender | String? | não | Gênero |
| street | String? | não | Logradouro |
| streetNumber | String? | não | Número |
| city | String? | não | Cidade |
| state | String? | não | UF (2 letras) |
| zipCode | String? | não | CEP (8 dígitos) |
| notes | String? | não | Observações livres |
| createdAt | DateTime | auto | Timestamp de criação |
| updatedAt | DateTime | auto | Timestamp de atualização |

### Rotas (`/employees`) — requerem `Authorization: Bearer <token>`

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/employees` | Criar funcionário |
| `GET` | `/employees` | Listar funcionários (com filtros) |
| `GET` | `/employees/:id` | Buscar funcionário por ID |
| `PUT` | `/employees/:id` | Atualizar funcionário |
| `DELETE` | `/employees/:id` | Deletar funcionário |

### Filtros disponíveis em `GET /employees`

`?search=` (nome, cargo, departamento) `?status=` `?department=` `?page=` `?limit=`

### Regras de negócio

- CPF e e-mail são únicos — retorna `ConflictError` 409 se duplicado
- `status` padrão é `ACTIVE` na criação
- `DELETE` é permanente (sem soft delete)

### Arquivos criados

| Camada | Arquivo |
|--------|---------|
| Domain | `src/domain/entities/Employee.ts` |
| Domain | `src/domain/repositories/IEmployeeRepository.ts` |
| Application | `src/application/dtos/EmployeeDTOs.ts` |
| Application | `src/application/mappers/employeeMapper.ts` |
| Application | `src/application/use-cases/CreateEmployee.ts` |
| Application | `src/application/use-cases/GetEmployee.ts` |
| Application | `src/application/use-cases/UpdateEmployee.ts` |
| Application | `src/application/use-cases/DeleteEmployee.ts` |
| Infrastructure | `src/infrastructure/repositories/PrismaEmployeeRepository.ts` |
| Interfaces | `src/interfaces/controllers/EmployeeController.ts` |
| Interfaces | `src/interfaces/routes/employeeRoutes.ts` |
| Prisma | `prisma/schema.prisma` → model `Employee` + enum `EmployeeStatus` |

---

## Cache Redis — Consultas (Appointments)

Implementado em 2026-04-20. Adiciona uma camada de cache Redis às operações de leitura de consultas, reduzindo latência e carga no banco para os endpoints mais acessados.

### Variável de Ambiente

| Variável | Descrição |
|----------|-----------|
| `REDIS_URL` | Connection string do Redis (padrão: `redis://localhost:6379`) |

### Padrão: Cache-Aside (Lazy Loading) com Decorator

O `CachedAppointmentRepository` implementa `IAppointmentRepository` e envolve o `PrismaAppointmentRepository`. Os casos de uso e o domínio **não foram alterados** — recebem a interface sem saber do cache.

```
GET /appointments/:id
  → Controller → GetAppointment (use case)
      → CachedAppointmentRepository.findById(id)
          ↓ Redis.get("appt:id:{id}")
          ├── HIT  → deserializa JSON → retorna
          └── MISS → PrismaRepository.findById → Redis.set (EX 300s) → retorna
```

### Chaves e TTL

| Operação | Chave Redis | TTL |
|----------|-------------|-----|
| `findById` | `appt:id:{id}` | 300s (5 min) |
| `findByIdWithRelations` | `appt:id-rel:{id}` | 300s (5 min) |
| `findByPatientId` (sem filtros) | `appt:patient:{patientId}` | 120s (2 min) |
| `findByUserId` (sem filtros) | `appt:user:{userId}` | 120s (2 min) |
| `findAll` / `count` | **não cacheado** | — |

> Listas com filtros (`status`, `dateStart`, `dateEnd`) também **não são cacheadas** — a variação de parâmetros tornaria a invalidação complexa sem ganho proporcional.

### Invalidação nas mutações

| Operação | Chaves invalidadas |
|----------|--------------------|
| `create` | `appt:patient:{pid}`, `appt:user:{uid}` |
| `update` | `appt:id:{id}`, `appt:id-rel:{id}`, `appt:patient:{pid}`, `appt:user:{uid}` |
| `delete` | lê o appointment do cache → invalida `appt:id:{id}`, `appt:id-rel:{id}`, `appt:patient:{pid}`, `appt:user:{uid}` |

### Degradação graciosa

Todo acesso ao Redis é envolto em `try/catch`. Se o Redis estiver fora do ar, o sistema continua funcionando normalmente — todas as leituras e escritas caem silenciosamente para o banco sem lançar erros para o cliente.

### Arquivos criados/modificados

| Tipo | Arquivo |
|------|---------|
| Novo | `src/infrastructure/cache/RedisClient.ts` — singleton `ioredis` com reconexão automática |
| Novo | `src/infrastructure/cache/CachedAppointmentRepository.ts` — decorator com lógica de cache |
| Modificado | `src/interfaces/controllers/AppointmentController.ts` — usa `CachedAppointmentRepository` |
6. **App**: registre a rota em `src/interfaces/http/app.ts`
