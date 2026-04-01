# CLAUDE.md — Backend ADQPAL

Documentação técnica do backend da aplicação ADQPAL.

---

## Stack

| Tecnologia | Versão | Papel |
|---|---|---|
| Node.js | 20+ | Runtime |
| TypeScript | 5.x | Linguagem (strict mode) |
| Express | 4.x | Framework HTTP |
| Prisma | 7.x | ORM |
| Supabase (PostgreSQL) | — | Banco de dados |
| bcryptjs | 2.x | Hash de senhas (12 rounds) |
| jsonwebtoken | 9.x | Autenticação JWT |
| Zod | 3.x | Validação de entrada |
| Morgan | 1.x | Logging de requisições |
| ts-node-dev | 2.x | Hot reload em dev |

---

## Estrutura do Projeto

```
backend/
├─ prisma/
│  └─ schema.prisma          # Schema do banco (modelos Prisma)
├─ src/
│  ├─ domain/                # CAMADA DE DOMÍNIO (sem dependências externas)
│  │  ├─ entities/
│  │  │  └─ User.ts          # Entidade User + tipos auxiliares
│  │  ├─ errors/
│  │  │  └─ DomainError.ts   # Hierarquia de erros tipados
│  │  ├─ repositories/
│  │  │  └─ IUserRepository.ts  # Port (interface) do repositório
│  │  └─ services/
│  │     ├─ IHashService.ts  # Port para hashing
│  │     └─ ITokenService.ts # Port para JWT
│  ├─ application/           # CAMADA DE APLICAÇÃO (casos de uso)
│  │  ├─ dtos/
│  │  │  └─ UserDTOs.ts      # Schemas Zod + tipos de entrada/saída
│  │  ├─ mappers/
│  │  │  └─ userMapper.ts    # Converte User → UserResponseDTO
│  │  └─ use-cases/
│  │     ├─ RegisterUser.ts
│  │     ├─ LoginUser.ts
│  │     ├─ GetUser.ts
│  │     ├─ UpdateUser.ts
│  │     └─ DeleteUser.ts
│  ├─ infrastructure/        # CAMADA DE INFRAESTRUTURA (implementações concretas)
│  │  ├─ database/
│  │  │  └─ prismaClient.ts  # Singleton do PrismaClient
│  │  ├─ repositories/
│  │  │  └─ PrismaUserRepository.ts  # Implementação com Prisma
│  │  └─ services/
│  │     ├─ BcryptHashService.ts
│  │     └─ JwtTokenService.ts
│  └─ interfaces/            # CAMADA DE INTERFACES (HTTP)
│     ├─ controllers/
│     │  └─ UserController.ts
│     ├─ middlewares/
│     │  ├─ authMiddleware.ts    # Valida JWT, popula req.userId
│     │  ├─ errorMiddleware.ts   # Tratamento global de erros
│     │  └─ validateBody.ts      # Validação de body via Zod
│     ├─ routes/
│     │  └─ userRoutes.ts
│     └─ http/
│        └─ app.ts              # Express app (middlewares + rotas)
└─ server.ts                    # Entry point (listen)
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

### Onde obter a DATABASE_URL no Supabase

1. Acesse [supabase.com](https://supabase.com) → seu projeto
2. Vá em **Settings → Database → Connection string**
3. Selecione **URI** e copie
4. Substitua `[YOUR-PASSWORD]` pela senha do banco

---

## Scripts

```bash
npm run dev           # Servidor em modo watch (ts-node-dev)
npm run build         # Compila TypeScript → dist/
npm run start         # Executa dist/server.js
npm run prisma:migrate   # Aplica migrações (cria/altera tabelas)
npm run prisma:studio    # Interface visual do banco (Prisma Studio)
npm run prisma:generate  # Regenera o Prisma Client
```

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

### Schema atual (`prisma/schema.prisma`)

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

---

## Rotas da API

### Base URL: `http://localhost:3333`

### Rotas Públicas

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/users/register` | Criar usuário |
| `POST` | `/users/login` | Autenticar usuário |

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

Variáveis de ambiente necessárias:

| Variável                   | Descrição                                       |
|----------------------------|-------------------------------------------------|
| `WHATSAPP_PHONE_NUMBER_ID` | ID do número no Meta Business                   |
| `WHATSAPP_TOKEN`           | Token permanente da API                         |
| `WHATSAPP_API_VERSION`     | Versão da API (padrão: `v17.0`)                 |

Obtenha em: [developers.facebook.com](https://developers.facebook.com) → seu app → WhatsApp → API Setup

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

## Adicionando Novas Entidades

Para adicionar, por exemplo, `Paciente`:

1. **Domain**: `src/domain/entities/Paciente.ts` + `src/domain/repositories/IPacienteRepository.ts`
2. **Prisma**: adicione o model em `prisma/schema.prisma` → `npm run prisma:migrate`
3. **Infrastructure**: `src/infrastructure/repositories/PrismaPacienteRepository.ts`
4. **Application**: `src/application/use-cases/` (CRUD do paciente) + DTOs
5. **Interfaces**: controller + rotas em `src/interfaces/`
6. **App**: registre a rota em `src/interfaces/http/app.ts`
