type EmailTemplateProps = {
  name: string;
  link: string;
  logoUrl?: string;
};

export default function resetPasswordTemplate({
  name,
  link,
  logoUrl,
}: EmailTemplateProps) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Redefinição de senha</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #E2E8F0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      color: #1E293B;
    }

    .wrapper {
      width: 100%;
      background-color: #E2E8F0;
      padding: 48px 16px;
      box-sizing: border-box;
    }

    .container {
      max-width: 520px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .header {
      padding: 40px 32px 24px;
      text-align: center;
    }

    .header img {
      max-width: 180px;
      height: auto;
    }

    .divider {
      height: 1px;
      background-color: #E2E8F0;
      margin: 0 32px;
    }

    .content {
      padding: 32px 32px 24px;
    }

    .content p {
      margin: 0 0 16px;
      font-size: 15px;
      line-height: 1.7;
      color: #475569;
    }

    .highlight {
      color: #1E293B;
      font-weight: 600;
    }

    .button-wrapper {
      text-align: center;
      margin: 32px 0;
    }

    .button {
      display: inline-block;
      padding: 14px 36px;
      border-radius: 10px;
      background-color: #38A169;
      color: #FFFFFF !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      letter-spacing: 0.3px;
    }

    .button:hover {
      background-color: #2F855A;
    }

    .warning {
      margin-top: 24px;
      padding: 16px;
      background-color: #FEF2F2;
      border-radius: 10px;
      font-size: 13px;
      color: #DC2626;
      text-align: center;
      line-height: 1.5;
    }

    .footer {
      padding: 24px 32px;
      text-align: center;
      background-color: #F8FAFC;
      border-top: 1px solid #E2E8F0;
      color: #94A3B8;
      font-size: 12px;
      line-height: 1.6;
    }

    .footer a {
      color: #38A169;
      text-decoration: none;
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <div class="container">

      <div class="header">
        ${logoUrl
          ? `<img src="${logoUrl}" alt="ADQPAL" />`
          : `<h1 style="margin:0;font-size:24px;font-weight:700;color:#1E293B;">ADQPAL</h1>`
        }
      </div>

      <div class="divider"></div>

      <div class="content">

        <p>
          Olá <span class="highlight">${name}</span>,
        </p>

        <p>
          Recebemos uma solicitação para redefinir sua senha da sua conta. 
          Clique no botão abaixo para criar uma nova senha.
        </p>

        <div class="button-wrapper">
          <a href="${link}" class="button">
            Redefinir senha
          </a>
        </div>

        <p style="font-size:13px;color:#94A3B8;text-align:center;">
          Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
        </p>
        <p style="font-size:12px;color:#94A3B8;text-align:center;word-break:break-all;margin-top:4px;">
          ${link}
        </p>

        <div class="warning">
          Se você não solicitou essa alteração, ignore este email. Sua conta permanece segura.
        </div>

      </div>

      <div class="footer">
        <p style="margin:0;">ADQPAL — Todos os direitos reservados</p>
        <p style="margin:6px 0 0;">
          Em caso de dúvidas, entre em contato com o <a href="mailto:suporte@adqpal.com">suporte</a>.
        </p>
      </div>

    </div>
  </div>
</body>
</html>
`;
}
