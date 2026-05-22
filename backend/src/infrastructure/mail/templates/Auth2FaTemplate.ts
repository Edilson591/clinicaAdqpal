type Auth2FAEmailProps = {
  name: string;
  code: string;
  logoUrl?: string;
};

export default function auth2FATemplate({
  name,
  code,
  logoUrl,
}: Auth2FAEmailProps) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Código de Verificação ADQPAL</title>
</head>

<body style="margin:0;padding:0;background-color:#E2E8F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#1E293B;">
  <div style="width:100%;background-color:#E2E8F0;padding:48px 16px;box-sizing:border-box;">
    <div style="max-width:520px;margin:0 auto;background-color:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

      <!-- HEADER -->
      <div style="padding:40px 32px 24px;text-align:center;">
        ${logoUrl
          ? `<img src="${logoUrl}" alt="ADQPAL" style="max-width:180px;height:auto;" />`
          : `<h1 style="margin:0;font-size:24px;font-weight:700;color:#1E293B;letter-spacing:1px;">ADQPAL</h1>`
        }
      </div>

      <div style="height:1px;background-color:#E2E8F0;margin:0 32px;"></div>

      <!-- CONTENT -->
      <div style="padding:32px 32px 24px;">
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#475569;">
          Olá, <span style="color:#1E293B;font-weight:600;">${name}</span>.
        </p>

        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#475569;">
          Uma tentativa de login foi realizada na sua conta. Use o código de verificação abaixo para concluir o acesso ao sistema:
        </p>

        <!-- CODE CONTAINER -->
        <div style="text-align:center;margin:32px 0;">
          <div style="display:inline-block;background-color:#F8FAFC;border:2px dashed #CBD5E1;border-radius:12px;padding:16px 40px;font-size:32px;font-weight:700;color:#38A169;letter-spacing:6px;">
            ${code}
          </div>
        </div>

        <div style="margin-top:24px;padding:16px;background-color:#FEF2F2;border-radius:10px;font-size:13px;color:#DC2626;text-align:center;line-height:1.5;">
          Este código é válido por <strong>15 minutos</strong>. Se você não solicitou este acesso, ignore este e-mail e altere sua senha por segurança.
        </div>
      </div>

      <!-- FOOTER -->
      <div style="padding:24px 32px;text-align:center;background-color:#F8FAFC;border-top:1px solid #E2E8F0;color:#94A3B8;font-size:12px;line-height:1.6;">
        <p style="margin:0;">ADQPAL — Todos os direitos reservados</p>
        <p style="margin:6px 0 0;">
          Em caso de dúvidas, entre em contato com o <a href="mailto:suporte@adqpal.com" style="color:#38A169;text-decoration:none;">suporte</a>.
        </p>
      </div>

    </div>
  </div>
</body>
</html>
`;
}