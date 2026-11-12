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
      "Cookies de sessão HttpOnly — Mantêm a autenticação e não podem ser lidos por scripts da página. São estritamente necessários para acessar a área restrita.",
      "adqpal_consent — Registra categorias escolhidas, versão da política e data da decisão. É necessário para respeitar e comprovar suas preferências.",
      "adqpal_theme — Armazena a preferência de tema apenas quando a categoria Personalização foi autorizada.",
    ],
  },
  {
    title: "Cookies de terceiros",
    content:
      "A plataforma não possui rastreadores de publicidade ou análise ativos nesta versão. Se uma tecnologia opcional for adicionada, seu script permanecerá bloqueado até a autorização da categoria correspondente. Integrações operacionais descritas na Política de Privacidade não são ativadas por cookies de marketing.",
  },
  {
    title: "Cookies essenciais x opcionais",
    content: [
      "Necessários: sessão, segurança, prevenção a fraude e registro das escolhas. Não dependem de consentimento quando indispensáveis à prestação e segurança do serviço.",
      "Análise, marketing e personalização: permanecem desativados até uma escolha afirmativa e podem ser retirados a qualquer momento.",
    ],
  },
  {
    title: "Como gerenciar cookies",
    content: [
      "Use o link Preferências de privacidade no rodapé para aceitar, rejeitar ou alterar categorias opcionais.",
      "A retirada da autorização não afeta tratamentos realizados de forma válida antes da mudança.",
      "A limpeza de cookies de sessão encerrará o acesso à área restrita.",
    ],
  },
  {
    title: "Local Storage",
    content:
      "O Local Storage é usado para registrar as preferências de consentimento e, quando autorizado, o tema visual. Tokens de acesso e rascunhos clínicos não são armazenados permanentemente no navegador.",
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
      lastUpdated="12 de novembro de 2026"
      sections={sections}
    />
  );
}
