# Delegacao de autenticacao para o user-service

O ADQPAL mantem os endpoints publicos existentes, mas identidade, senha, sessoes, refresh e 2FA sao processados pelo gateway do PaperlessBoleto. O banco clinico continua sendo a fonte de roles, especialidades e relacionamentos medicos.

## Fluxo

```text
Frontend -> ADQPAL /users/* -> API Gateway /auth/* -> user-service
                         |
                         +-> banco clinico por userId
```

Os UUIDs foram preservados durante a importacao. O `sub` retornado pelo servico de identidade e usado diretamente para carregar o usuario clinico local.

## Endpoints de compatibilidade

- `POST /users/register` encaminha o cadastro e cria a projecao clinica com o UUID externo.
- `POST /users/login` encaminha credenciais e mantem o formato legado da resposta.
- `POST /users/verify-2fa` traduz o bearer `tempToken` para `challengeToken`.
- `POST /users/verify-2fa/resend` reenvia o codigo usando o desafio opaco.
- `GET /users/csrf` e `GET /users/csrf-token` emitem o cookie/token CSRF.
- `POST /users/refresh` rotaciona access e refresh tokens.
- `POST /users/logout` revoga a sessao externa e remove cookies antigos.
- `POST /password/forgot` continua emitindo o link pelo ADQPAL.
- `POST /password/reset` valida o token local e troca a senha autoritativa no `user-service` antes de concluir localmente.

As rotas clinicas protegidas chamam `GET /auth/me` para validar assinatura, expiracao e revogacao da sessao. Depois carregam a role no banco ADQPAL. Nunca use `role_id=1` do banco de identidade como role clinica.

## Cookies

O gateway emite `pb_session`, `pb_refresh` e `pb_csrf`. Como a fachada publica usa `/users`, o ADQPAL reescreve apenas `Path=/auth` do refresh para `Path=/users`. Cabecalhos `Set-Cookie` permanecem separados.

O cookie legado `adqpal_token` e aceito temporariamente como bearer externo para facilitar transicao de clientes. `adqpal_trusted_device` e limpo no login: refresh token e dispositivo confiavel possuem semanticas diferentes e nao devem ser tratados como equivalentes.

## Configuracao

- `IDENTITY_GATEWAY_URL`: URL do gateway, sem barra final.
- `IDENTITY_GATEWAY_TIMEOUT_MS`: timeout HTTP; default 5000 ms.
- `BOLETO_GATEWAY_TIMEOUT_MS`: timeout da fachada de boletos; default 60000 ms para permitir a criacao sincrona de carnes na Efi.
- `IDENTITY_SERVICE_TOKEN`: segredo compartilhado usado apenas pela sincronizacao de senha.

Em desenvolvimento Docker, o gateway padrao e `http://host.docker.internal:3000`. Em producao, URL e token sao obrigatorios. O mesmo valor de `IDENTITY_SERVICE_TOKEN` deve estar em `CLINICAL_IDENTITY_TOKEN` no API Gateway. Use um secret manager e pelo menos 32 bytes aleatorios.

## Limites operacionais

- O gateway e dependencia sincrona para rotas autenticadas; indisponibilidade falha fechada com HTTP 503.
- Registro cria primeiro a identidade e depois a projecao clinica. Se a segunda etapa falhar, repetir os mesmos dados e a mesma senha recupera idempotentemente o UUID externo e tenta a projecao novamente.
- Alteracao de email pelo endpoint clinico e bloqueada ate existir operacao equivalente no servico de identidade.
- Alteracao de senha em `PUT /users/:id` e reset por token atualizam primeiro o `user-service`.
- O codigo local antigo permanece para rollback e historico, mas as rotas publicas nao o executam.
