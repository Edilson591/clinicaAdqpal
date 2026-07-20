# Auth migration: fase 1

Este corte prepara o backend clinico para delegar autenticacao ao `user-service` sem manter vulnerabilidades conhecidas durante a transicao.

## Alteracoes

- Cadastro publico nao aceita `roleId`; novas contas recebem a role publica `2` no servidor.
- JWTs possuem finalidade obrigatoria: `PRE_AUTH`, `ACCESS` ou `TRUSTED_DEVICE`.
- Middlewares HTTP e SSE aceitam somente tokens `ACCESS`.
- O endpoint de 2FA aceita somente tokens `PRE_AUTH`.
- Trusted device nao funciona como access token.
- Logout verifica e revoga access e trusted-device tokens e remove os dois cookies.
- OTP e gerado com `crypto.randomInt`, armazenado como HMAC-SHA-256 e consumido atomicamente.
- O desafio 2FA e bloqueado e removido depois de cinco codigos incorretos.
- Verificacao e reenvio de 2FA usam o rate limit de autenticacao.
- Auditoria remove senha, hash, CPF, CNPJ, tokens, segredos e codigos, inclusive em objetos aninhados.

## Configuracao

Defina uma chave aleatoria exclusiva para o HMAC dos OTPs:

```text
AUTH_OTP_PEPPER=<segredo-aleatorio-longo>
```

Desenvolvimento possui fallback temporario para `JWT_SECRET`. Producao deve definir `AUTH_OTP_PEPPER` separadamente.

## Impacto operacional

Tokens emitidos antes desta alteracao nao possuem `tokenUse` e deixam de ser aceitos. O deploy deve informar aos usuarios que um novo login sera necessario.

O fluxo HTTP permanece:

1. `POST /users/login` valida senha e retorna `tempToken`.
2. `POST /users/verify-2fa` valida o OTP e cria cookies de acesso e dispositivo confiavel.
3. Login posterior com trusted device ainda valida a senha, mas dispensa o OTP.
4. `POST /users/logout` revoga e remove ambos os tokens.

## Proximo corte

A fase seguinte move essas capacidades para o `user-service`: sessoes persistidas, refresh rotativo, 2FA, trusted devices, recuperacao de senha e compatibilidade temporaria com bcrypt. O monolito passara a receber identidade autenticada pelo gateway e manter apenas memberships e perfis profissionais locais.
