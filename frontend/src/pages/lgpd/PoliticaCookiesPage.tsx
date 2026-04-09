import { LgpdLayout } from "../../components/ui/LgpdLayout";

const sections = [
  {
    title: "O que são cookies",
    content:
      "Cookies são pequenos arquivos de texto armazenados no seu navegador quando você acessa uma página web. Eles permitem que o sistema reconheça seu dispositivo e mantenha informações entre as visitas, como sua sessão autenticada.",
  },
  {
    title: "Cookies que utilizamos",
    content: [
      "adqpal_token (sessão) — Armazena o token de autenticação JWT para manter você conectado durante a sessão. Essencial para o funcionamento do sistema. Expiração: conforme configuração da instituição (padrão: 7 dias). Não pode ser desativado.",
      "adqpal_theme (preferência) — Armazena sua preferência de tema claro ou escuro. Expiração: 1 ano. Pode ser redefinido nas configurações do sistema.",
    ],
  },
  {
    title: "Cookies de terceiros",
    content:
      "A plataforma ADQPAL não utiliza cookies de rastreamento de terceiros, pixels de publicidade, ferramentas de analytics externas nem redes sociais. Todo o processamento de dados ocorre exclusivamente em nossa infraestrutura.",
  },
  {
    title: "Cookies essenciais x opcionais",
    content: [
      "Cookies essenciais (adqpal_token): necessários para o funcionamento básico da autenticação. Sem eles, não é possível acessar o sistema. Base legal: execução de contrato (LGPD, art. 7º, V).",
      "Cookies de preferência (adqpal_theme): melhoram a experiência do usuário, mas não são obrigatórios. Base legal: legítimo interesse (LGPD, art. 7º, IX).",
    ],
  },
  {
    title: "Como gerenciar cookies",
    content: [
      "Você pode limpar os cookies a qualquer momento pelas configurações do seu navegador.",
      "A exclusão do cookie adqpal_token encerrará sua sessão imediatamente.",
      "A maioria dos navegadores permite configurar alertas antes de aceitar cookies — consulte a ajuda do seu navegador para instruções específicas.",
      "Em dispositivos móveis, as configurações de cookies estão disponíveis nos menus de privacidade do navegador instalado.",
    ],
  },
  {
    title: "Local Storage",
    content:
      "Além de cookies, utilizamos o Local Storage do navegador para armazenar preferências de interface (como filtros de página e configurações de exibição). Essas informações ficam armazenadas apenas no seu dispositivo e nunca são transmitidas a terceiros.",
  },
  {
    title: "Atualizações desta política",
    content:
      "Esta Política de Cookies pode ser atualizada para refletir mudanças na plataforma ou na legislação. Qualquer alteração será comunicada com antecedência mínima de 15 dias por e-mail ou mediante aviso na plataforma.",
  },
];

export default function PoliticaCookiesPage() {
  return (
    <LgpdLayout
      title="Política de Cookies"
      lastUpdated="09 de abril de 2026"
      sections={sections}
    />
  );
}
