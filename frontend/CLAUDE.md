# CLAUDE.md - Documentação do Design System ADQPAL

Este documento descreve os componentes reutilizáveis do design system da aplicação ADQPAL.

> **Regra de projeto**: toda alteração de arquitetura ou convenção deve ser anotada neste arquivo na seção correspondente.

---

## Padrão de Loading com Skeleton

**Regra obrigatória:** nunca usar texto de carregamento (ex: "Carregando..."). Sempre usar skeletons animados com `animate-pulse`.

### Componente base: `FieldSkeleton`

**Arquivo:** `src/components/ui/FieldSkeleton.tsx`

Usado em listas de cards/formulários (ex: `ProntuariosList`).

```tsx
import { FieldSkeleton } from "@/components/ui/FieldSkeleton";

{isLoading && (
  <div className="flex flex-col gap-4 p-6">
    {Array.from({ length: 5 }).map((_, i) => <FieldSkeleton key={i} />)}
  </div>
)}
```

### Skeleton para tabelas

Tabelas devem renderizar `<thead>` real + `<tbody>` com linhas skeleton. As células devem espelhar as colunas da tabela para evitar layout shift.

```tsx
{isLoading ? (
  <table className="w-full text-sm">
    <thead>{/* cabeçalho real */}</thead>
    <tbody>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-5 py-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#E2E8F0] dark:bg-[#334155] shrink-0" />
              <div className="h-4 w-32 bg-[#E2E8F0] dark:bg-[#334155] rounded" />
            </div>
          </td>
          {/* demais células */}
        </tr>
      ))}
    </tbody>
  </table>
) : (/* tabela real */)}
```

### Cores dos skeletons

| Tema | Cor |
|------|-----|
| Light | `bg-[#E2E8F0]` |
| Dark | `dark:bg-[#334155]` |

### Referências implementadas

| Arquivo | Tipo |
|---------|------|
| `src/components/Prontuarios/ProntuariosList.tsx` | Cards com `FieldSkeleton` |
| `src/pages/configuracao/UsersTable.tsx` | Skeleton de tabela |
| `src/pages/rh/RhTable.tsx` | Skeleton de tabela |

---

## Arquitetura de Formulários

### Visão geral

Todos os formulários do projeto seguem um padrão único baseado em três camadas:

| Camada | Ferramenta | Responsabilidade |
|--------|-----------|------------------|
| Validação | **Zod** (`src/validate/`) | Schema tipado com mensagens em PT-BR |
| Estado do form | **react-hook-form** via `useZodForm` | Registro de campos, erros, submit |
| Integração HTTP | **TanStack Query** (`useMutation`) | Chamada à API, loading, erros de servidor |

### Hook base: `useZodForm`

**Arquivo:** `src/hooks/useZodForm.ts`

Wrapper sobre `useForm` do react-hook-form com `zodResolver` já configurado.

```ts
import { useZodForm } from "@/hooks/useZodForm";
import { meuSchema } from "@/validate/meu.schema";

const { register, handleSubmit, formState: { errors } } = useZodForm(meuSchema, {
  defaultValues: { campo: "" },
});
```

**Retorna:** o objeto completo do `useForm` — `register`, `handleSubmit`, `formState`, `reset`, `watch`, `setValue`, etc.

### Schemas Zod (`src/validate/`)

Cada formulário possui um schema dedicado nomeado `<contexto>.schema.ts`:

| Arquivo | Schema | Tipo inferido |
|---------|--------|---------------|
| `login.schema.ts` | `loginSchema` | `LoginInput` |
| `forgotPassword.schema.ts` | `forgotPasswordSchema` | `ForgotPasswordInput` |
| `novoPaciente.schema.ts` | `novoPacienteSchema` | `NovoPacienteInput` |
| `seguranca.schema.ts` | `segurancaSchema` | `SegurancaInput` |
| `perfil.schema.ts` | `perfilSchema` | `PerfilInput` |

### Como criar um novo formulário

**1. Crie o schema em `src/validate/`:**

```ts
// src/validate/novoForm.schema.ts
import { z } from "zod";

export const novoFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
});

export type NovoFormInput = z.infer<typeof novoFormSchema>;
```

**2. Use `useZodForm` no hook ou componente:**

```ts
import { useZodForm } from "@/hooks/useZodForm";
import { novoFormSchema, type NovoFormInput } from "@/validate/novoForm.schema";

const { register, handleSubmit, formState: { errors } } = useZodForm(novoFormSchema, {
  defaultValues: { nome: "", email: "" },
});

const onSubmit = handleSubmit((data: NovoFormInput) => {
  // data é tipado e validado
});
```

**3. Conecte ao JSX:**

```tsx
<form onSubmit={onSubmit} noValidate>
  <input {...register("nome")} />
  {errors.nome && <p>{errors.nome.message}</p>}
</form>
```

### Erros de servidor (API)

Erros retornados pela API (ex: "e-mail já cadastrado") não são erros de schema — devem ser armazenados em estado separado:

```ts
const [generalError, setGeneralError] = useState<string | null>(null);

const mutation = useMutation({
  onError: (error) => setGeneralError(isAxiosError(error)
    ? error.response?.data?.message
    : "Erro ao conectar com o servidor."
  ),
});
```

### Padrão para componentes de form com `register`

Quando um componente de UI precisa receber campos de um form do pai, use os tipos do react-hook-form:

```ts
import { UseFormRegister, FieldErrors } from "react-hook-form";
import type { MeuFormInput } from "@/validate/meu.schema";

interface Props {
  register: UseFormRegister<MeuFormInput>;
  errors: FieldErrors<MeuFormInput>;
}
```

### Boas práticas

- **Nunca** use `useState` + validação manual — use sempre `useZodForm` + schema Zod
- **Nunca** chame `axios` diretamente em componentes — use `useMutation` + service layer
- Mensagens de erro sempre em **português**
- Campos opcionais sem validação: `z.string()` com `defaultValue: ""`
- Campos opcionais com validação condicional (ex: e-mail opcional): use `.refine()`
- Cross-field validation (ex: confirmar senha): use `.refine()` no objeto raiz com `path`
- Use `form.reset()` após submit bem-sucedido para limpar o formulário
- Passe `noValidate` no `<form>` para desabilitar a validação nativa do browser

### Inconsistências corrigidas na migração

- `LoginFormData` e `LoginFormErrors` foram removidos de `LoginPage.tsx` — os tipos agora vêm de `login.schema.ts` e do react-hook-form
- `PerfilSection` era um componente controlado puro sem validação — agora recebe `register` e `errors` do `ConfiguracaoPage`
- `SegurancaSection` tinha `form` inline com `useState` — extraído para `useZodForm` com `forwardRef` no `PasswordInput`
- `NovoPacientePage` tinha `validate()` manual inline — substituído por `novoPacienteSchema` e `useZodForm`
- Scroll manual para primeiro erro com `data-error` foi removido — react-hook-form faz `shouldFocusError: true` por padrão

---

## Arquitetura de Estado e Dados

### Divisão de responsabilidades

| Camada | Ferramenta | Responsabilidade |
|--------|-----------|------------------|
| Estado global de auth | **Redux Toolkit** (`src/store/authSlice.ts`) | Armazena `token` e `user` hidratados de cookie |
| Requisições e cache | **TanStack Query** (`@tanstack/react-query`) | Todas as chamadas à API — queries e mutations |
| HTTP | **Axios** (`src/services/api.ts`) | Instância configurada com interceptors de token e 401 |

### Fluxo de autenticação

```
LoginForm
  └─ useMutation(userService.login)   ← React Query gerencia loading/error
        onSuccess → dispatch(setCredentials) → Redux salva token+user em cookie
        onError   → setErrors no formulário
```

### Cookies de autenticação

- **`adqpal_token`** — JWT, 7 dias, `SameSite=Strict`
- **`adqpal_user`** — JSON do usuário, mesmas flags
- Helpers `getCookie / setCookie / deleteCookie` exportados de `src/store/authSlice.ts`
- `httpOnly` **requer configuração no servidor** (não é possível via JS)

### Interceptors do Axios (`src/services/api.ts`)

- **Request**: injeta `Authorization: Bearer <token>` lido do cookie
- **Response 401**: `store.dispatch(logout())` → limpa Redux + cookies → redireciona para `/login`

---

## Providers (ordem de inicialização)

```
main.tsx
  └─ QueryClientProvider (staleTime 5min, retry 1)
        └─ App
              └─ AuthProvider  (src/context/AuthProvider.tsx)
                    └─ Provider store={reduxStore}
                          └─ BrowserRouter + Routes
```

### Arquivos de contexto

| Arquivo | Exporta | Descrição |
|---------|---------|-----------|
| `src/context/AuthProvider.tsx` | `AuthProvider` | Wrapper do Redux store |
| `src/context/AuthContext.tsx` | `useAuth()` | Hook: `user`, `token`, `isAuthenticated`, `logout` |
| `src/context/useSidebarContext.ts` | `SidebarProvider`, `useSidebarContext()` | Estado da sidebar (isOpen, isHovered) |

---

## Padrão de hooks de dados (React Query + Axios)

Todos os hooks de dados seguem o padrão de `src/hooks/usePatients.ts`:

```ts
// Query (leitura)
export function usePatients() {
  return useQuery({
    queryKey: PATIENT_KEYS.all,
    queryFn: patientService.getAll,  // axios via service layer
  });
}

// Mutation (escrita)
export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => patientService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.all }),
  });
}
```

**Regra**: nunca chamar `axios` diretamente nos componentes — sempre via service layer (`src/services/`) + hook React Query.

---

## Redux Store (`src/store/`)

### `authSlice.ts` — actions disponíveis

| Action | Quando usar |
|--------|-------------|
| `setCredentials(LoginResponse)` | `onSuccess` do `useMutation` de login |
| `logout()` | Botão de sair, interceptor 401 |

**Não há async thunks** — toda lógica assíncrona fica em React Query.

---

## Estrutura do Projeto

- **Arquivo de Design (dashboard)**: `design/dashboard.pen` — Node ID: `neGQ1`
- **Arquivo de Design (components)**: `design/designAdqpal.pen`
- **Local dos Componentes**: Coordenadas (10921, 1289) em diante

---

## Componentes de Formulário

### 1. Label/Default
**ID**: `Zn839`

Componente base para labels de formulário.

**Estrutura**:
- Frame com layout vertical
- Texto com fonte Inter, 14px, semi-bold (600)
- Cor: `#2D3748` (gray-800)

**Uso**:
```javascript
// Instanciar
labelInstance=I(parent,{type:"ref",ref:"Zn839"})

// Customizar texto
U(labelInstance+"/ls54K",{content:"E-mail"})
```

**Filhos**:
- `ls54K` (labelText): Elemento de texto do label

---

### 2. Label/WithInfo
**ID**: `4zfBM`

Label com ícone de informação à direita.

**Estrutura**:
- Frame com layout horizontal (space_between)
- Texto do label (mesmo estilo do Label/Default)
- Ícone Info do Lucide (16x16px, cor #718096)

**Uso**:
```javascript
labelInfo=I(parent,{type:"ref",ref:"4zfBM"})
U(labelInfo+"/1qa8q",{content:"Senha"})
```

**Filhos**:
- `1qa8q` (labelText): Elemento de texto
- `lu1W4` (infoIcon): Ícone de informação

---

### 3. Input/Default
**ID**: `kZgUK`

Campo de input base para formulários.

**Estrutura**:
- Frame: 320x56px
- Background: `#FFFFFF`
- Border radius: 8px
- Stroke: 1px inside `#E2E8F0` (gray-200)
- Padding: 16px
- Layout vertical com justifyContent: center
- Placeholder: Inter 16px, cor `#A0AEC0`

**Uso**:
```javascript
input=I(parent,{type:"ref",ref:"kZgUK",width:"fill_container"})
U(input+"/lrdqh",{content:"seu@email.com"})
```

**Filhos**:
- `lrdqh` (placeholder): Texto placeholder

---

### 4. Input/WithIcon
**ID**: `wvbib`

Input com ícone à direita (ideal para senhas).

**Estrutura**:
- Frame: 320x56px
- Layout horizontal (space_between) com alignItems: center
- Placeholder à esquerda
- Ícone (eye) à direita - Lucide 20x20px
- Mesmas propriedades visuais do Input/Default

**Uso**:
```javascript
inputPassword=I(parent,{type:"ref",ref:"wvbib",width:"fill_container"})
U(inputPassword+"/lrrRN",{content:"••••••••"})
```

**Filhos**:
- `lrrRN` (placeholder): Texto placeholder
- `AWk4C` (eyeIcon): Ícone do olho

---

### 5. InputGroup/Default
**ID**: `Z52gh`

Componente combinado: Label + Input.

**Estrutura**:
- Frame: 320x82px
- Layout vertical com gap: 8px
- Instância de Label/Default
- Instância de Input/Default (fill_container)

**Uso**:
```javascript
// Instanciar o grupo completo
inputGroup=I(parent,{type:"ref",ref:"Z52gh",width:"fill_container"})

// Customizar label
U(inputGroup+"/TUZQk/ls54K",{content:"E-mail"})

// Customizar input
U(inputGroup+"/4OFPu/lrdqh",{content:"seu@email.com"})
```

**Filhos**:
- `TUZQk` (labelRef): Ref para Label/Default
- `4OFPu` (inputRef): Ref para Input/Default

---

## Componentes de Botão

### Button/Default
**ID**: `VSnC2` (já existente no design system)

**Uso**:
```javascript
button=I(parent,{type:"ref",ref:"VSnC2",width:"fill_container"})
U(button+"/buttonText",{content:"Entrar"})
```

---

## Tokens de Design

### Cores

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-primary` | `#2D3748` | Textos principais, títulos |
| `--color-secondary` | `#718096` | Subtítulos, textos secundários |
| `--color-accent` | `#38A169` | Links, ações positivas |
| `--color-border` | `#E2E8F0` | Bordas de inputs, divisores |
| `--color-placeholder` | `#A0AEC0` | Textos de placeholder |
| `--color-white` | `#FFFFFF` | Backgrounds |

### Tipografia

| Elemento | Fonte | Tamanho | Peso | Cor |
|----------|-------|---------|------|-----|
| Label | Inter | 14px | 600 (Semi-bold) | #2D3748 |
| Input | Inter | 16px | 400 (Normal) | #A0AEC0 |
| Botão | Inter | 16px | 600 (Semi-bold) | #FFFFFF |
| Título | Inter | 28px | 700 (Bold) | #1A365D |
| Subtítulo | Inter | 16px | 400 (Normal) | #718096 |

### Dimensões

| Elemento | Altura | Largura | Padding | Border Radius |
|----------|--------|---------|---------|---------------|
| Input | 56px | 320px / fill | 16px | 8px |
| Botão | 56px | fill | - | 8px |
| Label | 22px | auto | - | - |
| Input Group | 82px | 320px | - | - |

### Espaçamento

| Contexto | Valor |
|----------|-------|
| Gap Label → Input | 8px |
| Gap entre campos | 24px |
| Padding interno Input | 16px |
| Padding Card | 48px |
| Border Radius Card | 16px |
| Border Radius Input/Button | 8px |

---

## Exemplo de Uso Completo

```javascript
// Criar card de login
loginCard=I(document,{
  type:"frame",
  layout:"vertical",
  name:"Login Card",
  width:480,
  padding:48,
  gap:24,
  cornerRadius:16,
  fill:"#FFFFFF",
  x:363,y:129
})

// Adicionar título
title=I(loginCard,{type:"text",content:"Login",fill:"#1A365D",fontSize:28,fontWeight:"700",fontFamily:"Inter"})

// Adicionar InputGroup de E-mail
emailGroup=I(loginCard,{type:"ref",ref:"Z52gh",width:"fill_container"})
U(emailGroup+"/TUZQk/ls54K",{content:"E-mail"})
U(emailGroup+"/4OFPu/lrdqh",{content:"seu@email.com"})

// Adicionar InputGroup de Senha
passwordGroup=I(loginCard,{type:"ref",ref:"Z52gh",width:"fill_container"})
U(passwordGroup+"/TUZQk/ls54K",{content:"Senha"})
U(passwordGroup+"/4OFPu/lrdqh",{content:"••••••••"})
```

---

## Localização no Canvas

Os componentes estão organizados na seguinte posição:

| Componente | Posição (x, y) |
|------------|----------------|
| Label/Default | (10921, 1289) |
| Input/Default | (11150, 1289) |
| Label/WithInfo | (11400, 1289) |
| InputGroup/Default | (10921, 1370) |
| Input/WithIcon | (11150, 1370) |

---

## Notas

- Sempre usar `width: "fill_container"` quando o componente estiver dentro de um layout flexbox
- Para customizar textos em instâncias, usar o caminho completo do ID do descendente

---

## Controle de Permissões

Implementado em 2026-04-09. Controla acesso a áreas restritas por role do usuário.

### Arquitetura

```
PermissionsProvider (AppLayout)
  └─ usePermissions() → { canAccessFinanceiro }
       └─ FinanceiroGuard → <AcessoNegado /> ou <Outlet />
```

### `src/context/PermissionsContext.tsx`

- **`PermissionsProvider`**: envolve o `AppLayout`, lê `user.roleId` do Redux via `useAuth()` e computa permissões
- **`usePermissions()`**: hook para consumir permissões em qualquer componente dentro do layout

```ts
const { canAccessFinanceiro } = usePermissions();
```

### Permissões disponíveis

| Flag | Roles permitidos | IDs |
|------|-----------------|-----|
| `canAccessFinanceiro` | Administrador, Recepcionista, Suporte de TI | 1, 5, 9 |

### Componentes de guarda

| Arquivo | Descrição |
|---------|-----------|
| `src/components/ui/FinanceiroGuard.tsx` | Wrapper de rota: renderiza `<Outlet />` se autorizado, senão exibe `<AcessoNegado />` |
| `src/components/ui/AcessoNegado.tsx` | Tela de acesso negado com role atual do usuário e botão de retorno |

### Como usar o guard em rotas

```tsx
// PrivateRoutes.tsx
<Route element={<FinanceiroGuard />}>
  <Route path="/financeiro" element={<GestaoFinanceiraPage />} />
  <Route path="/financeiro/nova" element={<NovaTransacaoPage />} />
  <Route path="/financeiro/transacoes" element={<TransacoesPage />} />
</Route>
```

### Como adicionar nova permissão

1. Adicionar flag em `PermissionsContextValue` em `PermissionsContext.tsx`
2. Computar a flag no `PermissionsProvider` com os roles permitidos
3. Criar um guard component (ex.: `AgendaGuard.tsx`) que lê o novo flag
4. Envolver as rotas no novo guard em `PrivateRoutes.tsx`

---

## Módulo Financeiro

Implementado em 2026-04-09. Conectado ao backend via React Query + Axios.

### Páginas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/financeiro` | `GestaoFinanceiraPage` | Dashboard com KPIs reais do mês atual + gráfico + transações recentes |
| `/financeiro/nova` | `NovaTransacaoPage` | Formulário completo conectado à API |
| `/financeiro/transacoes` | `TransacoesPage` | Listagem com filtros, paginação e delete |

### Componentes (`src/components/Financeiro/`)

| Componente | Props | Descrição |
|-----------|-------|-----------|
| `FinanceiroHeader` | — | Título, mês atual dinâmico, tabs de navegação (Visão Geral / Transações), botão Nova Transação |
| `KPICard` | `title, value, trend, trendPositive, Icon, iconBg, iconColor` | Card de indicador financeiro |
| `TransacoesRecentes` | `transactions, totalIncome, totalExpense, isLoading` | Lista das 5 transações mais recentes com totais reais |
| `ReceitaDespesasChart` | `currentIncome?, currentExpense?` | Gráfico de barras: 5 meses históricos (ilustrativos) + mês atual com dados reais |

### Hooks (`src/hooks/useFinancial.ts`)

| Hook | Retorna |
|------|---------|
| `useFinancialAccounts(isActive?)` | Lista de contas |
| `useFinancialAccountById(id)` | Conta por ID |
| `useCreateFinancialAccount()` | Mutation de criação |
| `useUpdateFinancialAccount()` | Mutation de atualização |
| `useDeleteFinancialAccount()` | Mutation de deleção |
| `useFinancialCategories(type?, isActive?)` | Lista de categorias |
| `useCreateFinancialCategory()` | Mutation de criação |
| `useUpdateFinancialCategory()` | Mutation de atualização |
| `useDeleteFinancialCategory()` | Mutation de deleção |
| `useTransactions(filters?)` | `PaginatedResponse<TransactionResponse>` |
| `useTransactionById(id)` | Transação por ID |
| `useCreateTransaction()` | Mutation — invalida `transactions` e `accounts` |
| `useUpdateTransaction()` | Mutation — invalida `transactions` e `accounts` |
| `useDeleteTransaction()` | Mutation — invalida `transactions` e `accounts` |

### Serviços (`src/services/Financial.ts`)

- `FinancialAccountService` → `/financial/accounts`
- `FinancialCategoryService` → `/financial/categories`
- `TransactionService` → `/financial/transactions` (suporta filtros: `accountId`, `categoryId`, `patientId`, `type`, `status`, `paymentMethod`, `dateStart`, `dateEnd`, `search`, `page`, `limit`)

### Schema de Validação (`src/validate/novaTransacao.schema.ts`)

Campos do formulário Nova Transação:

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `type` | `"INCOME" \| "EXPENSE" \| "TRANSFER"` | sim |
| `accountId` | string (UUID) | sim |
| `categoryId` | string (UUID) | sim |
| `description` | string (1–200 chars) | sim |
| `amount` | string numérica > 0 | sim |
| `status` | `"PENDING" \| "CONFIRMED" \| "CANCELLED"` | sim |
| `paymentMethod` | `"CASH" \| "CREDIT_CARD" \| "DEBIT_CARD" \| "PIX" \| "BANK_TRANSFER" \| "INSURANCE" \| "OTHER"` | sim |
| `dueDate` | string ISO date | sim |
| `notes` | string | não |

### Tipos (`src/types/api.ts`)

```ts
type AccountType = "CHECKING" | "SAVINGS" | "CASH" | "CREDIT_CARD" | "INVESTMENT";
type CategoryType = "INCOME" | "EXPENSE" | "BOTH";
type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";
type TransactionStatus = "PENDING" | "CONFIRMED" | "CANCELLED";
type PaymentMethod = "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PIX" | "BANK_TRANSFER" | "INSURANCE" | "OTHER";
```

### Cores do módulo financeiro

| Significado | Background | Texto/Ícone |
|------------|-----------|-------------|
| Entrada (INCOME) | `#DCFCE7` | `#38A169` / `#166534` |
| Saída (EXPENSE) | `#FEE2E2` | `#EF4444` / `#991B1B` |
| Transferência (TRANSFER) | `#DBEAFE` | `#3B82F6` / `#1E40AF` |
| Status Confirmado | `#DCFCE7` | `#166534` |
| Status Pendente | `#FEF9C3` | `#854D0E` |
| Status Cancelado | `#FEE2E2` | `#991B1B` |

### Lógica de KPIs no Dashboard

Calculados a partir de `useTransactions({ dateStart, dateEnd, limit: 100 })` com datas do mês atual:
- **Receitas do Mês**: `type === "INCOME" && status === "CONFIRMED"` → soma dos `amount`
- **Despesas do Mês**: `type === "EXPENSE" && status === "CONFIRMED"` → soma dos `amount`
- **Resultado Líquido**: Receitas − Despesas
- **Consultas Pagas**: `type === "INCOME" && status === "CONFIRMED" && patientId !== null` → contagem
- Os ícones usam a fonte Lucide
- Todos os componentes seguem o padrão de cores e espaçamento do Tailwind/Shadcn

---

## Componentes React

### Arquivo: `src/components/ui/input.tsx`

#### Input
Componente de input com suporte a ícones, password toggle e variantes.

**Importação:**
```typescript
import { Input, InputGroup, Label } from "@/components/ui/input";
```

**Props:**
| Prop | Tipo | Descrição |
|------|------|-----------|
| `variant` | `"default" \| "error"` | Variação visual do input |
| `size` | `"default" \| "sm" \| "lg"` | Tamanho do input |
| `leftIcon` | `LucideIcon` | Ícone à esquerda |
| `rightIcon` | `LucideIcon` | Ícone à direita |
| `rightElement` | `ReactNode` | Elemento customizado à direita |

**Uso Básico:**
```tsx
<Input placeholder="Digite aqui..." />
```

**Input com Ícone:**
```tsx
import { Mail } from "lucide-react";

<Input leftIcon={Mail} placeholder="seu@email.com" />
```

**Input de Password:**
```tsx
<Input type="password" placeholder="Sua senha" />
// Mostra toggle de visibilidade automaticamente
```

**Input com Erro:**
```tsx
<Input variant="error" placeholder="Campo inválido" />
```

---

#### Label
Componente de label com suporte a required e info.

**Props:**
| Prop | Tipo | Descrição |
|------|------|-----------|
| `required` | `boolean` | Mostra asterisco indicando campo obrigatório |
| `info` | `string` | Texto para tooltip de informação |

**Uso:**
```tsx
<Label required info="Será usado para login">
  E-mail
</Label>
```

---

#### InputGroup
Componente combinado: Label + Input + Helper/Error Text.

**Props:**
| Prop | Tipo | Descrição |
|------|------|-----------|
| `label` | `string` | Texto do label |
| `required` | `boolean` | Campo obrigatório |
| `helperText` | `string` | Texto auxiliar abaixo do input |
| `error` | `string` | Mensagem de erro |
| `inputProps` | `InputProps` | Props passadas para o Input |
| `labelProps` | `LabelProps` | Props passadas para o Label |

**Uso:**
```tsx
<InputGroup
  label="E-mail"
  required
  helperText="Use seu e-mail corporativo"
  inputProps={{
    type: "email",
    placeholder: "seu@email.com",
    leftIcon: Mail,
  }}
/>
```

**Com Erro:**
```tsx
<InputGroup
  label="Senha"
  required
  error="Senha deve ter pelo menos 8 caracteres"
  inputProps={{
    type: "password",
    placeholder: "••••••••",
  }}
/>
```

---

### Exemplo Completo - Formulário de Login

```tsx
import { Input, InputGroup, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock } from "lucide-react";

export function LoginForm() {
  return (
    <form className="flex flex-col gap-6 w-full max-w-md">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-primary-dark">
          Bem-vindo ao ADQPAL
        </h1>
        <p className="text-muted-foreground">
          Acesse sua conta para gerenciar a clínica.
        </p>
      </div>

      <InputGroup
        label="E-mail"
        required
        inputProps={{
          type: "email",
          placeholder: "seu@email.com",
        }}
      />

      <InputGroup
        label="Senha"
        required
        inputProps={{
          type: "password",
          placeholder: "••••••••",
        }}
      />

      <Button size="lg" className="w-full">
        Entrar
      </Button>
    </form>
  );
}
```

---

---

## Páginas

### Página: Login

**Arquivo:** `src/pages/LoginPage.tsx`
**Rota:** `/login` (pública)

Combina `useLoginForm` (hook de lógica) com `LoginCard` (UI). Aplica background gradiente e redireciona para `/esqueceu-a-senha` ao clicar em "Esqueceu a senha?".

---

### Página: Esqueceu a Senha

**Arquivo:** `src/pages/ForgotPasswordPage.tsx`
**Rota:** `/esqueceu-a-senha` (pública)

**Componentes usados:**
- `InputGroup` + `Input` (campo de e-mail)
- `Button` (enviar instruções)
- `ErrorAlert` (feedback de erro)
- `SuccessAlert` (feedback de sucesso - `src/components/ui/SuccessAlert.tsx`)
- `LogoContainer`, `LoadingSpinner`
- `Link` do react-router-dom (botão voltar ao login)

**Hook:** `src/hooks/useForgotPasswordForm.ts`

Estado gerenciado:
- `formData.email`: string
- `errors.email?`, `errors.general?`: strings de erro
- `isLoading`: boolean
- `successMessage`: string | null

Comportamento:
- Valida formato de e-mail antes de submeter
- Exibe `SuccessAlert` após envio bem-sucedido e oculta o formulário
- Botão com `LoadingSpinner` durante requisição
- Link "Voltar para o login" sempre visível

```tsx
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";

// Rota:
<Route path="/esqueceu-a-senha" element={<ForgotPasswordPage />} />
```

---

### Componente: SuccessAlert

**Arquivo:** `src/components/ui/SuccessAlert.tsx`

Exibe mensagens de sucesso com ícone de check. Mesmo padrão visual do `ErrorAlert`, porém em verde.

```tsx
import SuccessAlert from "@/components/ui/SuccessAlert";

<SuccessAlert message="E-mail enviado com sucesso!" />
```

---

## Roteamento e Autenticação

**Biblioteca:** `react-router-dom`

**Provider:** `src/context/AuthProvider.tsx` — injeta Redux store
**Hook:** `useAuth()` em `src/context/AuthContext.tsx` — expõe `user`, `token`, `isAuthenticated`, `logout()`

> `login()` foi removido de `useAuth()`. O login é gerenciado pelo `useMutation` em `useLoginForm.ts`.

**Wrapper de rotas privadas:** `src/components/ui/ProtectedRoute.tsx`
- Redireciona para `/login` se `isAuthenticated === false`
- Renderiza `<Outlet />` caso contrário

**Estrutura de rotas em `src/App.tsx`:**

| Rota | Tipo | Componente |
|------|------|------------|
| `/login` | Pública | `LoginPage` |
| `/esqueceu-a-senha` | Pública | `ForgotPasswordPage` |
| `/dashboard` | Privada | `DashboardPage` |
| `/pacientes` | Privada | `PatientsPage` |
| `*` | — | Redireciona para `/login` |

```tsx
// Adicionar nova rota privada:
<Route element={<ProtectedRoute />}>
  <Route path="/nova-pagina" element={<NovaPagina />} />
</Route>
```

---

## Dashboard (`src/pages/DashboardPage.tsx`)

**Rota:** `/dashboard` (privada)
**Design:** `design/dashboard.pen` — Node `neGQ1` (1440×900px)

### Layout

```
DashboardPage
  └─ SidebarProvider
        ├─ Sidebar (260px, #1C2B3A)
        └─ main (flex-1, bg #F5F6FA, p-8)
              ├─ Header (greeting + search)
              ├─ Cards row (grid-cols-3, gap-6)
              │     ├─ ConsultasHojeCard
              │     ├─ NovosPacientesCard
              │     └─ ProximoAtendimentoCard
              └─ AgendaTable
```

### Componentes

| Arquivo | Props | Descrição |
|---------|-------|-----------|
| `components/Dashboard/Sidebar.tsx` | — | Nav lateral, colapsa para 64px via `useSidebarContext` |
| `components/Dashboard/Header.tsx` | — | "Olá, Dr. X" + search bar + toggle sidebar |
| `components/Dashboard/Cards/ConsultasHojeCard.tsx` | `total: number` | Card com número de consultas |
| `components/Dashboard/Cards/NovosPacientesCard.tsx` | `total: number` | Card com novos pacientes |
| `components/Dashboard/Cards/ProximoAtendimentoCard.tsx` | `paciente`, `horario` | Card com próximo atendimento |
| `components/Dashboard/AgendaTable.tsx` | — | Tabela "Agenda do Dia" com status badges e botão Ver Prontuário |

### Cores da dashboard

| Elemento | Cor |
|----------|-----|
| Sidebar bg | `#FFFFFF` (branco, borda direita `#E5E7EB`) |
| Main bg | `#F5F6FA` |
| Cards / Table bg | `#FFFFFF` |
| Borda cards | `#E5E7EB` |
| Nav item ativo | bg `#E6F5ED`, texto/ícone `#38A169` |
| Nav item hover | bg `#F3F4F6` |
| Status Confirmada | `#38A169` (verde) |
| Status Em Andamento | `#3B82F6` (azul) |
| Status Pendente | `#E5E7EB` (cinza) |

### Sidebar — comportamento

- **Desktop (lg+)**: posição in-flow, colapsável 260px → 64px via `toggleSidebar`
- **Mobile (<lg)**: drawer fixo, abre/fecha via `toggleMobile` no Header
- **Hover**: expande temporariamente quando `isOpen=false`
- **Colapso**: mostra só ícones e inicial do avatar

### User menu (sidebar — rodapé)

- Hover: bg `#F3F4F6`, avatar escala levemente
- Click: dropdown acima do user com opções **Perfil** e **Sair**
- Fecha ao clicar fora (listener `mousedown` no documento)
- Fecha ao colapsar a sidebar

### Responsividade

| Breakpoint | Comportamento |
|-----------|--------------|
| `sm` | Cards 2 colunas, search bar visível |
| `lg` | Cards 3 colunas, sidebar in-flow visível |
| `< sm` | Cards 1 coluna, search oculto, hamburger mobile |

---

## Página de Pacientes (`src/pages/PatientsPage.tsx`)

**Rota:** `/pacientes` (privada)
**Design:** `design/paciente.pen` — Node `uvh5p` (1440×900px)
**Tema:** Dark mode (fundo `#0F172A`)

### Layout

```
PatientsPage
  └─ SidebarProvider
        ├─ Sidebar (260px, #1C2B3A) — mesma sidebar do Dashboard
        └─ main (flex-1, bg #0F172A, p-8)
              ├─ Page Header (título + contagem de pacientes)
              ├─ Toolbar (SearchBar + FilterDropdown + botão Novo Paciente)
              ├─ Results count (exibido apenas durante busca ativa)
              └─ PatientTable ("Lista de Pacientes" + tabela dark)
```

### Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `src/pages/PatientsPage.tsx` | Página principal — monta layout e passa estado para componentes |
| `src/hooks/usePatientsPage.ts` | Hook de estado: busca + filtro derivados de `usePatients()` |
| `src/components/Patients/SearchBar.tsx` | Input de busca dark (nome, CPF ou e-mail) |
| `src/components/Patients/FilterDropdown.tsx` | Dropdown de filtro dark (Todos / Com CPF / Sem CPF / Com e-mail) |
| `src/components/Patients/PatientTable.tsx` | Tabela dark com avatar de inicial, colunas responsivas, botão Prontuário |

### Hook `usePatientsPage`

```ts
const { patients, total, isLoading, search, setSearch, filter, setFilter } = usePatientsPage();
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `patients` | `PatientResponse[]` | Lista filtrada e buscada |
| `total` | `number` | Total sem filtros (para contagem no header) |
| `isLoading` | `boolean` | Estado de carregamento |
| `search` | `string` | Texto da busca |
| `filter` | `PatientFilter` | Filtro ativo |

**Tipo `PatientFilter`:** `"all" | "with_cpf" | "without_cpf" | "with_email"`

### Toolbar

- **SearchBar**: busca simultânea por `name`, `cpf` e `email`
- **FilterDropdown**: label `"Cadastro"`, opções Todos / Com CPF / Sem CPF / Com e-mail
- **Novo Paciente**: botão verde (`#38A169`) com ícone `UserPlus`, alinhado à direita via `ml-auto`

### PatientTable — Colunas

| Coluna | Visibilidade | Campo |
|--------|-------------|-------|
| Nome (com avatar inicial) | sempre | `name` |
| CPF | `md+` | `cpf` |
| E-mail | `lg+` | `email` |
| Telefone | `lg+` | `phone` |
| Nascimento | `xl+` | `dateOfBirth` |
| Prontuário (botão) | sempre | — |

### Cores dark mode da página de pacientes

| Elemento | Cor |
|----------|-----|
| Main bg | `#0F172A` |
| Sidebar bg | `#1C2B3A` |
| Card/Tabela bg | `#1E293B` |
| Tabela header row | `#263548` |
| Borda tabela/inputs | `#334155` |
| Texto primário | `#F1F5F9` |
| Texto secundário | `#94A3B8` |
| Texto muted/placeholder | `#64748B` |
| Nav ativo bg | `#1E3A2F` |
| Nav ativo texto | `#38A169` |
| Avatar inicial bg | `#1E3A2F` |
| Avatar inicial texto | `#38A169` |
| Botão Prontuário | borda/texto `#38A169`, bg `#1E3A2F/60` |
| Botão Novo Paciente | bg `#38A169`, hover `#2F9259` |

### Componentes da página de pacientes

| Arquivo | Responsabilidade |
|---------|-----------------|
| `src/components/Patients/PatientsPageHeader.tsx` | Título + subtítulo + toggle dark/light + SearchBar + FilterDropdown + botão Novo Paciente |
| `src/components/Patients/PatientList.tsx` | Card "Lista de Pacientes" + thead + mapeia PatientCard |
| `src/components/Patients/PatientCard.tsx` | `<tr>` individual com avatar de inicial, dados e botão "Ver" |
| `src/components/Patients/SearchBar.tsx` | Input de busca com tema |
| `src/components/Patients/FilterDropdown.tsx` | Dropdown de filtro com tema |

### Sistema de Tema (`src/context/ThemeContext.tsx`)

**Escopo:** apenas a área de conteúdo da página de pacientes (sidebar permanece light).

```tsx
const { isDark, toggleTheme, colors } = useTheme();
```

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `isDark` | `boolean` | Estado atual |
| `toggleTheme` | `() => void` | Alterna dark ↔ light |
| `colors` | `typeof theme.dark` | Paleta ativa para usar em `style={}` |

**Persistência:** `localStorage` chave `adqpal_patients_theme`.

**Paleta dark (extraída do pen file):**

| Token | Valor |
|-------|-------|
| `bg` | `#0F172A` |
| `surface` | `#1E293B` |
| `surfaceAlt` | `#263548` |
| `border` | `#334155` |
| `textPrimary` | `#F1F5F9` |
| `textSecondary` | `#94A3B8` |
| `textMuted` | `#64748B` |
| `textFilter` | `#CBD5E1` |
| `inputBg` | `#1E293B` |
| `accent` | `#38A169` |

**Paleta light (original pen file antes da conversão):**

| Token | Valor |
|-------|-------|
| `bg` | `#F8FAFC` |
| `surface` | `#FFFFFF` |
| `surfaceAlt` | `#F1F5F9` |
| `border` | `#E2E8F0` |
| `textPrimary` | `#1E293B` |
| `textSecondary` | `#475569` |
| `textMuted` | `#94A3B8` |
| `textFilter` | `#475569` |
| `inputBg` | `#FFFFFF` |
| `accent` | `#38A169` |

**Padrão de uso em componentes:**
```tsx
const { colors } = useTheme();
// Usar style={} com as tokens:
<div style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
```

### Design — Nodes do pen file

| Node | ID | Descrição |
|------|----|-----------|
| Frame principal | `uvh5p` | 1440×900px, bg `#0F172A` |
| Sidebar | `D308G` | 260px, bg `#1C2B3A`, layout vertical |
| Main Content | `Km2zu` | fill_container, bg `#0F172A`, padding 32 |
| Header toolbar | `0XXGm` | space_between horizontal |
| Título header | `Wwtn2` | "Pacientes", fontSize 24, fontWeight 600 |
| Subtítulo | `yb09a` | fontSize 13, color `#64748B` |
| Search Bar | `AqIc8` | h:44, bg `#1E293B`, border `#334155`, padding [12,16] |
| Filter Dropdown | `Vd0Tk` | h:44, bg `#1E293B`, border `#334155`, padding [0,12] |
| Botão Novo | `r4nwu` | h:44, w:140, bg `#38a169`, gap 8 |
| Tabela card | `jBwnl` | bg `#1E293B`, border `#334155`, cornerRadius 12, padding 24 |
| Table Header row | `CYc32` | bg `#263548`, h:48, cornerRadius 8 |
| Row data 1/3 | `lV5VV`/`VI7gd` | bg `#1E293B`, h:56 |
| Row data 2 | `PhFNz` | bg `#263548`, h:56 |
| Botão "Ver" | `Xuvv4` | h:32, w:80, border `#38a169`, text `#38a169` |

---

## Design Tokens (CSS Variables)

Definidos em `src/index.css`:

| Token | Valor | Descrição |
|-------|-------|-----------|
| `--color-primary` | `#38A169` | Verde principal |
| `--color-primary-dark` | `#2D3748` | Cinza escuro (títulos) |
| `--color-primary-foreground` | `#FFFFFF` | Texto sobre primary |
| `--color-border-input` | `#D4D4D4` | Borda de inputs |
| `--color-muted-foreground` | `#737373` | Texto placeholder |
| `--color-surface` | `#FFFFFF` | Background inputs |
| `--color-ring` | `#38A169` | Cor do focus ring |

---

## Layout Compartilhado (`src/layout/`)

### `AppLayout.tsx`

**Arquivo:** `src/layout/AppLayout.tsx`

Layout das páginas privadas. Encapsula `SidebarProvider`, o `div` de estrutura e `Sidebar`. Usa `<Outlet />` do react-router-dom — **não recebe `children`**. É montado automaticamente via `PrivateRoutes` para todas as rotas privadas.

```
ProtectedRoute
  └─ AppLayout          ← SidebarProvider + Sidebar + <Outlet />
        └─ <página>     ← renderizada pelo Outlet
```

**Regra:** páginas privadas **não** instanciam `AppLayout` diretamente. O layout é aplicado pela árvore de rotas. Páginas públicas (`/login`, `/esqueceu-a-senha`) **não** usam `AppLayout`.

---

## Rotas (`src/routes/`)

As rotas estão separadas em dois arquivos e importadas pelo `App.tsx`:

| Arquivo | Exporta | Conteúdo |
|---------|---------|----------|
| `src/routes/PublicRoutes.tsx` | `publicRoutes` | `/login`, `/esqueceu-a-senha` |
| `src/routes/PrivateRoutes.tsx` | `privateRoutes` | Todas as rotas privadas dentro de `ProtectedRoute` + `AppLayout` |

### Adicionar nova rota privada

Edite apenas `src/routes/PrivateRoutes.tsx`:

```tsx
import NovaPagina from "../pages/NovaPagina";

// dentro do <Route element={<AppLayout />}>:
<Route path="/nova-pagina" element={<NovaPagina />} />
```

A página em si não precisa importar nem usar `AppLayout` — o `Outlet` cuida disso.

### Adicionar nova rota pública

Edite apenas `src/routes/PublicRoutes.tsx`:

```tsx
<Route path="/nova-publica" element={<NovaPaginaPublica />} />
```

---

## Página de Gestão Financeira (`src/pages/financeiro/GestaoFinanceiraPage.tsx`)

**Rota:** `/financeiro` (privada)
**Design:** `design/gestaoFinanceira.pen` — Node `sIXrY` (1440×900px)
**Tema:** Light (fundo `#F8FAFC`)

### Layout

```
GestaoFinanceiraPage
  └─ AppLayout (via Outlet)
        └─ main (flex-1, bg #F8FAFC, p-8)
              ├─ FinanceiroHeader (título + filtro de mês + botão Nova Transação)
              ├─ KPI Cards row (flex, gap-4)
              │     ├─ KPICard (Receita Total)
              │     ├─ KPICard (Despesas)
              │     ├─ KPICard (Saldo Líquido)
              │     └─ KPICard (Consultas Pagas)
              └─ Bottom Row (flex, gap-4, flex-1)
                    ├─ ReceitaDespesasChart (flex-1)
                    └─ TransacoesRecentes (width: 320px)
```

### Componentes

| Arquivo | Props | Descrição |
|---------|-------|-----------|
| `components/Financeiro/FinanceiroHeader.tsx` | `onNovaTransacao?` | Título + subtítulo mês + botão filtro + botão Nova Transação |
| `components/Financeiro/KPICard.tsx` | `title`, `value`, `trend`, `trendPositive`, `Icon`, `iconBg`, `iconColor` | Card KPI reutilizável com ícone, valor e tendência |
| `components/Financeiro/ReceitaDespesasChart.tsx` | — | Gráfico de barras Receita vs Despesas (6 meses, pure CSS) |
| `components/Financeiro/TransacoesRecentes.tsx` | — | Painel lateral com 5 transações recentes + resumo totais |

### KPICard — configurações por card

| Card | Icon | `iconBg` | `iconColor` | `trendPositive` |
|------|------|----------|-------------|-----------------|
| Receita Total | `TrendingUp` | `#DCFCE7` | `#38A169` | `true` |
| Despesas | `TrendingDown` | `#FEE2E2` | `#EF4444` | `false` |
| Saldo Líquido | `Wallet` | `#DBEAFE` | `#3B82F6` | `true` |
| Consultas Pagas | `Stethoscope` | `#F3E8FF` | `#A855F7` | `true` |

### Cores da página financeira

| Elemento | Cor |
|----------|-----|
| Main bg | `#F8FAFC` |
| Cards bg | `#FFFFFF` |
| Borda cards | `#E2E8F0` |
| Texto primário | `#1E293B` |
| Texto secundário | `#64748B` |
| Texto muted | `#94A3B8` |
| Verde (receita/positivo) | `#38A169` |
| Vermelho (despesa/negativo) | `#EF4444` |
| Azul (saldo) | `#3B82F6` |
| Roxo (consultas) | `#A855F7` |
| Barra receita no gráfico | `#38A169` |
| Barra despesa no gráfico | `#FCA5A5` |

### Gráfico (`ReceitaDespesasChart`)

Implementado com divs CSS puro (sem biblioteca externa). Dados estáticos com 6 meses (Out–Mar). Barras proporcionais com `MAX = 120` e `BAR_HEIGHT = 140px`.

### Transações (`TransacoesRecentes`)

5 transações estáticas. Ícone `ArrowDownLeft` (verde) para entradas, `ArrowUpRight` (vermelho) para saídas. Rodapé com totais de entradas e saídas.

### Responsividade (adicionada em 2026-04-04)

A página é totalmente responsiva com os seguintes breakpoints:

| Breakpoint | KPI Cards | Header | Bottom Row |
|-----------|-----------|--------|------------|
| `< sm` (< 640px) | 1 coluna | empilhado (título + botões) | coluna (chart → transactions) |
| `sm` (640px+) | 2 colunas | linha (justify-between) | coluna |
| `lg` (1024px+) | 4 colunas | linha | linha (chart flex-1 + transactions 320px) |

**Alterações realizadas:**

- `GestaoFinanceiraPage`: padding `p-4 sm:p-8`; KPIs de `flex` para `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`; bottom row de `flex` para `flex flex-col lg:flex-row`
- `FinanceiroHeader`: container de `flex justify-between` para `flex flex-col sm:flex-row sm:justify-between`
- `KPICard`: padding `p-4 sm:p-5`; removido `flex-1` (desnecessário em grid)
- `ReceitaDespesasChart`: adicionado `min-h-[280px]` para garantir altura mínima em coluna; padding `p-4 sm:p-5`
- `TransacoesRecentes`: substituído `style={{ width: 320 }}` fixo por `w-full lg:w-80 lg:min-w-[280px]`

---

## Testes (Vitest + React Testing Library)

Implementado em 2026-04-10. Cobertura de utils, schemas Zod, hooks e contextos.

### Configuração

| Item | Valor |
|------|-------|
| Framework | **Vitest** (`vitest run` / `vitest`) |
| Ambiente | `jsdom` |
| Setup | `src/__tests__/setup.ts` — importa `@testing-library/jest-dom` |
| Glob de inclusão | `src/__tests__/**/*.test.{ts,tsx}` |

Scripts:
```bash
npm test          # executa uma vez
npm run test:watch  # modo watch
```

### Estrutura dos testes

```
src/__tests__/
├── setup.ts
├── components/
│   └── ProtectedRoute.test.tsx
├── context/
│   └── PermissionsProvider.test.tsx
├── hooks/
│   ├── useAppointmentSSE.test.ts
│   ├── useAgendaPage.test.ts
│   ├── useDashboard.test.ts
│   ├── useFinancial.test.ts
│   ├── useMedicalRecords.test.ts
│   └── useZodForm.test.tsx
├── store/
│   └── authSlice.test.ts
├── types/
│   └── roles.test.ts
├── utils/
│   ├── formatCep.test.ts
│   ├── formatCpf.test.ts
│   ├── formatPhone.test.ts
│   └── formatTime.test.ts
└── validate/
    ├── loginSchema.test.ts
    ├── novaTransacaoSchema.test.ts
    └── patientHistorySchema.test.ts
```

### Convenções

**Mocking de `useAuth`**

`useAuth()` retorna `{ user, token, isAuthenticated, logout }`. Ao mockar, sempre envolva o objeto do usuário:

```ts
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// ✅ correto
mockUseAuth.mockReturnValue({ user: adminUser, token: 'tok', isAuthenticated: true, logout: vi.fn() });

// ❌ errado — user ficará undefined no hook
mockUseAuth.mockReturnValue(adminUser);
```

**Wrapper QueryClient para hooks React Query**

```ts
function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: qc }, children);
}

const { result } = renderHook(() => useMeuHook(), { wrapper: makeWrapper() });
```

**Datas locais em testes**

Evite `new Date('YYYY-MM-DD')` — é interpretado como UTC e sofre deslocamento de timezone. Use o construtor local:

```ts
// ✅ correto — não sofre deslocamento
const date = new Date(2026, 3, 10); // mês 0-indexed: 3 = abril

// ❌ evitar — UTC midnight vira dia anterior no Brasil
new Date('2026-04-10');
```

**Testes de formulário (react-hook-form)**

Erros do `formState` só aparecem para campos registrados. Para testar validação, renderize um componente com `register()`:

```tsx
function TestForm() {
  const { register, handleSubmit, formState: { errors } } = useZodForm(schema);
  return (
    <form onSubmit={handleSubmit(() => {})}>
      <input {...register('campo')} />
      {errors.campo && <p>{errors.campo.message}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

Para testar apenas API do hook (defaultValues, reset, getValues), `renderHook` é suficiente.

**Schemas Zod — teste direto**

Schemas podem ser testados diretamente com `.safeParse()`, sem necessidade de renderizar componentes:

```ts
const result = schema.safeParse(dados);
expect(result.success).toBe(true);
// ou
expect(result.error.issues[0].message).toBe('mensagem esperada');
```

---

## Página de Perfil (`src/pages/perfil/PerfilPage.tsx`)

**Rota:** `/perfil` (privada)
**Acesso:** dropdown do usuário na sidebar (botão "Perfil" em `UserSection`)

### Layout

```
PerfilPage
  └─ main (flex-1, bg #F5F6FA, p-6 sm:p-8)
        └─ max-w-2xl mx-auto
              ├─ Título ("Meu Perfil")
              ├─ AvatarHeader (avatar inicial + nome + subtítulo)
              ├─ PerfilSection (nome, e-mail, especialidade)
              └─ SegurancaSection (senha atual, nova senha, confirmar)
```

### Componentes internos

| Componente | Descrição |
|-----------|-----------|
| `AvatarHeader` | Card com avatar de inicial verde, nome e cargo |
| `PerfilSection` | Formulário com `perfilSchema` — campos nome, e-mail, especialidade |
| `SegurancaSection` | Formulário com `segurancaSchema` — campos senha atual, nova, confirmar |
| `FeedbackMessage` | Feedback inline de sucesso/erro (verde/vermelho com ícone) |

### Formulários

| Seção | Schema | Campos | Mutation |
|-------|--------|--------|---------|
| Perfil | `perfilSchema` | `nome`, `email`, `especialidade` | `userService.update(user.id, ...)` |
| Segurança | `segurancaSchema` | `atual`, `nova`, `confirma` | stub (adaptar quando endpoint existir) |

- Ambos usam `useZodForm` + `handleSubmit`
- Feedback inline com `FeedbackMessage` (não usa toast global)
- Botão mostra "Salvando..." / "Alterando..." durante `isPending`
- `SegurancaSection` chama `reset()` após sucesso

### Sidebar — integração

`UserSection.tsx` usa `useNavigate` para redirecionar ao clicar em "Perfil":

```tsx
onClick={() => {
  setMenuOpen(false);
  navigate("/perfil");
}}
```

### Cores

| Elemento | Cor |
|----------|-----|
| Page bg | `#F5F6FA` |
| Cards bg | `#FFFFFF` |
| Borda cards | `#E5E7EB` |
| Título / texto primário | `#1E293B` |
| Subtítulo | `#64748B` |
| Avatar bg | `#38A169` |
| Ícone perfil bg | `#DCFCE7` (verde claro) |
| Ícone segurança bg | `#EFF6FF` (azul claro) |

---

## Separação de Componentes por Página

### Regra obrigatória

Cada página em `src/pages/` deve ser organizada em arquivos separados. **Nunca coloque múltiplos componentes no mesmo arquivo de página.**

### Estrutura padrão

```
src/pages/<contexto>/
├── <Contexto>Page.tsx      # Orquestrador — só importa, monta o layout
├── <Contexto>Form.tsx      # Formulário — lógica de form + mutação
├── AvatarHeader.tsx        # Componente de display puro (sem lógica)
├── FeedbackMessage.tsx     # Componente de display puro (sem lógica)
└── ...
```

### Responsabilidades por camada

| Arquivo | O que contém | O que NÃO contém |
|---------|-------------|-----------------|
| `Page.tsx` | `<Header>`, título, layout, instancia componentes | `useState`, `useMutation`, `useQuery`, lógica de negócio |
| `use<Contexto>Page.ts` | `useQuery`, `useMutation`, `useState`, processamento de dados, stats | JSX de qualquer tipo |
| `use<Contexto>Form.ts` | `useZodForm`, `useMutation`, `useState` para feedback | JSX de qualquer tipo |
| Componentes de display | Apenas props + JSX | Qualquer hook de dados |

### Padrão de hook de página (`use<Contexto>Page.ts`)

Toda lógica da página fica isolada em um hook dedicado em `src/hooks/`. O hook:
- Chama os serviços via `useQuery` / `useMutation`
- Processa e filtra os dados (search, stats, mapeamentos)
- Expõe estado de UI (confirmações, loading, erros)
- **Não retorna JSX**

O componente de página apenas desestrutura o hook e distribui as props.

```ts
// src/hooks/useUsersPage.ts
export function useUsersPage() {
  const { data: raw = [] } = useUsers();
  const [search, setSearch] = useState("");
  // ... processamento, delete mutation, stats
  return { users, isLoading, search, setSearch, total, ... };
}

// src/pages/configuracao/UsersPage.tsx
export default function UsersPage() {
  const { users, isLoading, ... } = useUsersPage();
  return <main>...</main>;  // só JSX, zero lógica
}
```

### Exemplo — `pages/perfil`

```
src/hooks/usePerfilForm.ts   → useZodForm + useMutation + useSpecialties + feedback state
src/pages/perfil/
├── PerfilPage.tsx           → importa AvatarHeader + PerfilForm, monta layout
├── PerfilForm.tsx           → chama usePerfilForm(), distribui props no JSX
├── AvatarHeader.tsx         → recebe { username }, renderiza avatar
└── FeedbackMessage.tsx      → recebe { type, message }, renderiza alerta
```

### Exemplo — `pages/configuracao/usuarios`

```
src/hooks/useUsersPage.ts    → fetch + delete + search + stats calculados
src/pages/configuracao/
├── UsersPage.tsx            → chama useUsersPage(), monta layout
├── UsersStats.tsx           → recebe { total, totalDoctors, ... }, renderiza cards
└── UsersTable.tsx           → recebe { users, onRequestDelete, ... }, renderiza tabela
```

> **Por que?** Facilita leitura, teste e reutilização. Um arquivo de página com 300+ linhas misturando lógica e UI é difícil de manter.

---

## Módulo Notas Fiscais

Implementado em 2026-04-16. Emissão e controle de NFS-e (Nota Fiscal de Serviços Eletrônica) seguindo padrão brasileiro.

### Páginas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/notas-fiscais` | `NotasFiscaisPage` | Listagem paginada com filtros, KPIs, emissão e viewer |

### Arquivos

```
src/pages/notasfiscais/
├── NotasFiscaisPage.tsx       # Orquestrador — monta layout, instancia viewer
├── NotasFiscaisStats.tsx      # 4 KPI cards (emitidas, valor, pendentes, canceladas)
├── NotasFiscaisTable.tsx      # Tabela com filtros de status e ações inline
├── NovaNotaFiscalModal.tsx    # Modal de criação com useZodForm + useCreateNotaFiscal
└── NotaFiscalViewer.tsx       # Viewer NFS-e padrão brasileiro com impressão
```

### Componentes (`src/pages/notasfiscais/`)

| Componente | Props principais | Descrição |
|-----------|-----------------|-----------|
| `NotasFiscaisStats` | `totalEmitidas, valorTotal, totalPendentes, totalCanceladas, isLoading` | 4 cards de KPI com skeleton inline |
| `NotasFiscaisTable` | `notas, patientMap, onViewNF, onRequestEmitir, onRequestCancelar, onRequestDelete, ...` | Tabela com abas de filtro e confirm inline por ação |
| `NovaNotaFiscalModal` | `open, onClose` | Modal com SearchableSelect de paciente, servico, valor, observacoes |
| `NotaFiscalViewer` | `nf, patient, onClose` | Modal NFS-e com seções Prestador/Tomador/Valores e botão imprimir |

### Ações por status na tabela

| Status | Ações disponíveis |
|--------|-----------------|
| `PENDENTE` | Emitir (confirm inline), Excluir (confirm inline) |
| `EMITIDA` | Ver (abre viewer), Download (se pdfUrl), Cancelar (confirm inline) |
| `CANCELADA` | Excluir (confirm inline) |

### Hooks (`src/hooks/useNotasFiscais.ts`)

| Hook | Retorna |
|------|---------|
| `useNotasFiscaisPaginated(page, limit, search, status)` | `PaginatedResponse<NotaFiscalResponse>` |
| `useNotasFiscaisStats()` | `{ totalEmitidas, valorTotal, totalPendentes, totalCanceladas, isLoading }` |
| `useCreateNotaFiscal()` | Mutation de criação |
| `useEmitirNotaFiscal()` | Mutation — retorna `NotaFiscalResponse` emitida |
| `useCancelarNotaFiscal()` | Mutation de cancelamento |
| `useDeleteNotaFiscal()` | Mutation de exclusão |
| `useNotasFiscaisPage()` | Hook completo de página com todo estado de UI |

### Lógica de stats

Três queries paralelas (sem endpoint de agregação no backend):

| Query | `status` | `limit` | Uso |
|-------|----------|---------|-----|
| emitidas | `EMITIDA` | 500 | `totalEmitidas` + soma `valorTotal` |
| pendentes | `PENDENTE` | 1 | `totalPendentes` via `pagination.total` |
| canceladas | `CANCELADA` | 1 | `totalCanceladas` via `pagination.total` |

### Serviço (`src/services/NotaFiscal.ts`)

Base: `/fiscal/notas-fiscais`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `getAll(filters?)` | `GET /` | Lista paginada com search, status, patientId, datas |
| `getById(id)` | `GET /:id` | NF por ID |
| `create(data)` | `POST /` | Cria NF com status PENDENTE |
| `emitir(id)` | `POST /:id/emitir` | Emite NF — retorna objeto completo |
| `cancelar(id)` | `POST /:id/cancelar` | Cancela NF |
| `delete(id)` | `DELETE /:id` | Exclui NF (só PENDENTE ou CANCELADA) |

### Schema de Validação (`src/validate/notaFiscal.schema.ts`)

| Campo | Tipo | Regras |
|-------|------|--------|
| `patientId` | string | obrigatório, min 1 |
| `servico` | string | obrigatório, 2–255 chars |
| `valor` | string | obrigatório, numérico > 0 (aceita vírgula como decimal) |
| `observacoes` | string | opcional, max 2000 chars |

> `valor` é string no form e convertido para `Number` antes de chamar a API: `Number(valor.replace(",", "."))`.

### Tipos (`src/types/api.ts`)

```ts
type NotaFiscalStatus = "PENDENTE" | "EMITIDA" | "CANCELADA";

interface NotaFiscalResponse {
  id: string;
  numero: string;
  patientId: string;
  appointmentId: string | null;
  transactionId: string | null;
  createdBy: string;
  servico: string;
  valor: number;
  status: NotaFiscalStatus;
  dataEmissao: string | null;
  pdfUrl: string | null;
  observacoes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CreateNotaFiscalInput {
  patientId: string;
  servico: string;
  valor: number;
  observacoes?: string | null;
  appointmentId?: string | null;
  transactionId?: string | null;
}
```

### Viewer NFS-e (`NotaFiscalViewer.tsx`)

Segue o padrão brasileiro de Nota Fiscal de Serviços Eletrônica:

| Seção | Conteúdo |
|-------|---------|
| Cabeçalho | Nome da prefeitura, cidade, número e data de emissão |
| Código de verificação | Primeiros 12 chars do UUID sem hífens (maiúsculo) |
| Prestador | Razão social, CNPJ, endereço, inscrição municipal da clínica |
| Tomador | Nome e CPF do paciente (lookup via `patientDetailsMap`) |
| Discriminação | Descrição do serviço prestado + observações |
| Valores | Valor bruto, deduções (R$ 0,00), base de cálculo, ISS (5%), valor líquido |

**Impressão**: `window.open()` com documento HTML completo gerado inline — não depende de CSS da aplicação.

**Constante CLINIC**: dados da clínica hardcoded em `NotaFiscalViewer.tsx`. Atualizar ao mudar dados cadastrais.

### Nome do paciente na NF

O backend retorna apenas `patientId`. O frontend resolve o nome em `NotasFiscaisPage`:

```tsx
const patientMap = useMemo(
  () => Object.fromEntries(patients.map((p) => [p.id, p.name])),
  [patients],
);
const patientDetailsMap = useMemo(
  () => Object.fromEntries(patients.map((p) => [p.id, { name: p.name, cpf: p.cpf }])),
  [patients],
);
```

### Cores do módulo

| Status | Background badge | Texto badge |
|--------|-----------------|-------------|
| `EMITIDA` | `#DCFCE7` | `#16A34A` |
| `PENDENTE` | `#FEF3C7` | `#D97706` |
| `CANCELADA` | `#FEE2E2` | `#DC2626` |

### Testes (`src/__tests__/`)

| Arquivo | Cobertura |
|---------|-----------|
| `validate/notaFiscalSchema.test.ts` | Todos os campos — valid/invalid, bordas de limite, vírgula decimal |
| `hooks/useNotasFiscais.test.ts` | Todas as queries/mutations + useNotasFiscaisPage (estado, viewer, confirms) |

### Sidebar

Item adicionado em `src/components/Dashboard/Sidebar.tsx`:

```ts
{ label: "Notas Fiscais", icon: Receipt, path: "/notas-fiscais" }
```

Posicionado entre **Financeiro** e **RH** no menu lateral.
