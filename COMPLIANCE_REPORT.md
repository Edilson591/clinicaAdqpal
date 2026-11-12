# Relatório técnico de privacidade, consumo e acessibilidade

Data da revisão: 12 de novembro de 2026.

Este documento descreve controles técnicos. Ele não substitui parecer jurídico, RIPD, inventário de operações, contratos com operadores, políticas internas ou validação do encarregado.

## Escopo analisado

- Frontend React 19/Vite, formulários clínicos, documentos, RH, financeiro e filiação.
- Backend Express/Prisma, PostgreSQL, Redis, BullMQ, autenticação delegada e SSE.
- Integrações de identidade, boletos, WhatsApp, SMS, SMTP, transcrição, NFSe, ViaCEP e bases públicas.
- Configuração Docker, Nginx, Vercel, GitHub Actions, testes e dependências.

## Implementado

### Consentimento e tecnologias opcionais

- Banner com aceitar, rejeitar e personalizar sem opções previamente marcadas.
- Categorias necessárias, análise, marketing e personalização.
- Registro local da versão da política e data da decisão.
- Alteração e retirada posterior pelo botão global `Privacidade`.
- Função `loadConsentedScript` bloqueia scripts opcionais antes da autorização.
- Tema só é persistido quando Personalização está autorizada.
- A aplicação não possui rastreadores de análise ou publicidade ativos nesta versão.

Arquivos principais: `frontend/src/privacy/consent.ts`, `frontend/src/context/ConsentProvider.tsx` e `frontend/src/components/privacy/`.

### Direitos dos titulares

- Formulário público em `/privacidade/solicitacao`.
- Protocolo aleatório e chave de acompanhamento exibida uma única vez.
- Chave armazenada no servidor apenas como SHA-256 de um segredo de 256 bits.
- Consulta de status exige protocolo e chave, com comparação resistente a timing.
- Gestão de solicitações e retenção exige ADMIN; resposta a incidentes permite ADMIN e IT_SUPPORT.
- Alterações geram eventos auditáveis próprios, sem copiar documentos ou dados clínicos.
- A verificação de identidade é humana e obrigatória antes de entregar ou modificar dados.

Endpoints:

- `POST /privacy/requests`
- `GET /privacy/requests/:protocol/status`
- `GET /privacy/admin/requests`
- `PATCH /privacy/admin/requests/:id`

### Retenção

- Políticas configuráveis por categoria, fundamento, critério, ação e prazo.
- Políticas são desabilitadas por padrão e não aceitam ativação sem prazo informado.
- Execução é sempre simulação por padrão.
- Exclusão real exige confirmação textual da categoria.
- Anonimização e revisão não são executadas genericamente em lote.
- Prontuários, pacientes, registros fiscais e trabalhistas não fazem parte do executor automático.
- Cada execução registra responsável, corte, quantidade, resultado e se foi simulação.

Categorias técnicas disponíveis: tokens de recuperação, outbox concluído/falho e logs de auditoria. Antes da ativação, o encarregado e as áreas jurídica, clínica, fiscal e trabalhista devem aprovar fundamento e prazo.

Endpoints:

- `GET /privacy/admin/retention`
- `PUT /privacy/admin/retention`
- `POST /privacy/admin/retention/:id/run`

### Incidentes

- Registro de ocorrência, descoberta, gravidade, impacto, categorias, titulares estimados, contenção, correção e referências de evidência.
- Prazo inicial de revisão calculado em três dias úteis, sem envio automático à ANPD ou aos titulares.
- Flags independentes para revisão de comunicação à ANPD e aos titulares.
- Revisão humana registra responsável e data.
- Histórico de alterações por incidente.

O cálculo automático exclui sábados e domingos. Feriados e exceções regulatórias devem ser revisados pelo responsável antes da comunicação.

Endpoints:

- `POST /privacy/admin/incidents`
- `GET /privacy/admin/incidents`
- `PATCH /privacy/admin/incidents/:id`

### Segurança

- JWT removido de `localStorage`; sessão normal usa cookie HttpOnly.
- Token temporário de 2FA permanece apenas em `sessionStorage` durante o desafio.
- Rascunhos APAC, AIH e receituários não são mais persistidos no navegador.
- Cache do TanStack Query e rascunhos legados são limpos no logout.
- Mutações autenticadas por cookie validam CSRF; o cliente obtém o token automaticamente.
- Token não é enviado na URL do SSE.
- SSE segmentado pelo médico responsável e pelos papéis operacionais autorizados.
- Suporte de TI não recebe acesso clínico implícito.
- Médicos só recebem pacientes, históricos e prontuários vinculados a seus atendimentos.
- Exclusão de paciente e prontuário foi restringida a ADMIN.
- HTML de documentos é sanitizado antes de impressão ou download.
- CSP, HSTS, Referrer-Policy, Permissions-Policy e proteção contra framing foram adicionados ao Nginx e Vercel.
- Criptografia nova usa AES-256-GCM autenticado e mantém leitura do formato CBC legado.
- Produção não inicia sem `ENCRYPTION_KEY` válida.
- Auditoria remove identificação, contato, endereço, saúde, salário, documentos e segredos dos snapshots.
- `SYNC_SECRET` ausente agora falha fechado.
- Cancelamento de boleto exige chave de idempotência determinística por cobrança/parcela.

Observação criptográfica: para preservar buscas exatas em colunas já criptografadas, o nonce GCM atual é derivado do conteúdo e revela igualdade. A evolução recomendada é nonce aleatório com blind indexes separados para CPF/e-mail e rotação versionada de chaves.

### Acessibilidade

- Skip link global e destino de foco no conteúdo principal.
- Campos compartilhados associam label, erro, `aria-invalid`, `aria-describedby` e região de alerta.
- Botão de exibir senha voltou à ordem de teclado e possui nome/estado acessíveis.
- Alvos e foco visível dos botões foram ampliados.
- Preferência `prefers-reduced-motion` é respeitada globalmente.
- Banner e painel de privacidade possuem semântica, foco inicial, fechamento por Escape e controles nativos.
- Formulário de direitos usa HTML semântico, autocomplete e mensagens acessíveis.

É necessária uma rodada manual com NVDA/JAWS/VoiceOver, teclado, zoom de 200%/400%, contraste e dispositivos móveis. WCAG não pode ser validada integralmente apenas por testes unitários.

### CDC

- Não foram encontrados contadores promocionais, escassez artificial ou descontos simulados.
- Termos deixaram de impor limitação geral de responsabilidade, foro obrigatório e prazos de rescisão/retenção não comprovados.
- Cancelamentos administrativos de boletos são idempotentes.
- Não foi criado fluxo de arrependimento/reembolso: o projeto não demonstra contratação remota completa, data de assinatura/recebimento nem API de estorno. A filiação precisa ser classificada juridicamente e funcionalmente antes dessa integração.

## Migração e operação

1. Fazer backup testado do PostgreSQL.
2. Aplicar `backend/prisma/migrations/20261112120000_add_privacy_compliance/migration.sql` com `prisma migrate deploy`.
3. Confirmar cookies `pb_session`, `pb_refresh` e `pb_csrf` com `HttpOnly`, `Secure` e `SameSite` adequados no serviço de identidade.
4. Rotacionar credenciais locais e mover segredos para o gerenciador do ambiente.
5. Não habilitar políticas de retenção antes da aprovação jurídica documentada.
6. Definir responsáveis e rotina de monitoramento de incidentes e solicitações.
7. Testar CSRF e cookies no domínio real do frontend/API antes do deploy.
8. Planejar migração/recriptografia do conteúdo CBC legado e blind indexes.

## Pendências obrigatórias

- Validar bases legais, textos e períodos com jurídico/DPO e responsáveis clínicos.
- Concluir inventário/RoPA e RIPD de dados de saúde.
- Formalizar contratos, suboperadores, retenção e transferências internacionais dos terceiros.
- Criar política de backup, criptografia, expurgo, restauração, RPO/RTO e legal hold.
- Rotacionar todos os segredos identificados nos arquivos `.env` locais.
- Remover assinatura profissional embutida no bundle e substituí-la por assinatura aplicada no servidor após autorização.
- Eliminar dados clínicos descriptografados do Redis ou adotar criptografia, TLS e isolamento adequados.
- Criar painel administrativo para os endpoints de incidentes/retenção, caso Swagger/API não seja suficiente para a operação.
- Implementar alerta interno por canal corporativo monitorado, sem disparo automático para ANPD/titulares.
- Validar se filiação constitui contratação fora do estabelecimento e, se aplicável, integrar protocolo, prazo, cancelamento e estorno ao provedor.
- Implementar segregação por organização antes de uso multi-clínica.

## Dependências

O `npm audit fix` compatível reduziu o backend de 18 para 4 vulnerabilidades de produção e removeu a vulnerabilidade crítica transitiva do frontend ao excluir `html2pdf.js`, que não era utilizado. Permanecem:

- Backend: 4 avisos de produção em `adm-zip`, `nodemailer`, `qs` e Zod 3, exigindo atualização incompatível ou correção da cadeia.
- Frontend: 9 avisos de produção, sem correção compatível disponível no registro utilizado durante esta revisão.

Não foi usado `npm audit fix --force`. As atualizações restantes exigem branch de migração, testes de regressão e nova auditoria.

## Validação executada

- Prisma schema validado e client gerado.
- Backend TypeScript compilado.
- Frontend TypeScript/Vite compilado.
- ESLint do frontend sem erros.
- Backend: 218 testes aprovados.
- Frontend: 258 testes aprovados.
- Testes adicionados para consentimento, bloqueio de script, sanitização de HTML, sessão sem JWT em storage, limpeza de rascunhos, DTOs de privacidade, retenção segura, incidentes, SSE segmentado e idempotência de cancelamento.
