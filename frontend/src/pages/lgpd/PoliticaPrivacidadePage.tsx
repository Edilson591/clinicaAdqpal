import { LgpdLayout } from "../../components/ui/LgpdLayout";

const sections = [
  {
    title: "Quem somos",
    content:
      "O Instituto ADQPAL é o controlador dos dados pessoais tratados por meio da plataforma ADQPAL, sistema de gestão clínica destinado a profissionais de saúde e estabelecimentos médicos. Nosso Encarregado de Dados (DPO) pode ser contatado pelo e-mail privacidade@adqpal.com.br.",
  },
  {
    title: "Dados que coletamos",
    content: [
      "Dados de identificação: nome completo, CPF, e-mail, telefone e data de nascimento de pacientes e usuários do sistema.",
      "Dados de saúde (dados sensíveis): diagnósticos, prescrições, prontuários, histórico de consultas e demais informações clínicas inseridas pelos profissionais de saúde.",
      "Dados de acesso: endereço IP, data e hora de acesso, dispositivo utilizado e registros de atividade na plataforma.",
      "Dados de endereço: logradouro, número, cidade, estado e CEP, utilizados para cadastro de pacientes.",
    ],
  },
  {
    title: "Finalidade e base legal",
    content: [
       "Gestão de pacientes e consultas — execução de contrato, procedimentos preliminares e, conforme o contexto, tutela da saúde.",
       "Registro de prontuários eletrônicos — tutela da saúde e cumprimento de obrigações legais e regulatórias aplicáveis.",
      "Autenticação e controle de acesso — legítimo interesse do controlador (LGPD, art. 7º, IX).",
      "Envio de notificações de consultas via WhatsApp — consentimento do paciente (LGPD, art. 7º, I).",
       "Tecnologias opcionais de análise, marketing ou personalização — somente após escolha específica quando o consentimento for a base aplicável.",
    ],
  },
  {
    title: "Dados sensíveis",
    content:
      "Os dados de saúde são tratados com base no art. 11, II, 'f' da LGPD, que autoriza o tratamento para a tutela da saúde por profissionais habilitados. O acesso é restrito exclusivamente aos profissionais de saúde cadastrados e autorizados pela instituição.",
  },
  {
    title: "Compartilhamento de dados",
    content: [
      "Não vendemos nem compartilhamos dados pessoais para fins comerciais.",
       "Dados podem ser compartilhados com prestadores de infraestrutura (hospedagem em nuvem) sob obrigações contratuais de confidencialidade.",
       "Integrações operacionais podem envolver Supabase/PostgreSQL, Vercel ou infraestrutura contratada, serviço de identidade, provedores de WhatsApp/SMS, SMTP, transcrição de áudio, emissão fiscal, boletos, ViaCEP e bases públicas de procedimentos/CID, conforme a funcionalidade utilizada.",
       "Áudio clínico só deve ser enviado ao provedor de transcrição após informação contextual ao usuário e observância da finalidade assistencial definida pela instituição.",
      "Dados podem ser divulgados a autoridades competentes quando exigido por lei ou ordem judicial.",
    ],
  },
  {
    title: "Retenção de dados",
    content:
      "Os prazos são definidos por categoria, finalidade e fundamento jurídico, considerando obrigações sanitárias, profissionais, fiscais, trabalhistas e de defesa de direitos. Políticas automáticas permanecem desabilitadas até aprovação documentada. Dados sujeitos a obrigação de conservação ou bloqueio jurídico não são eliminados apenas por solicitação; a decisão e sua justificativa são registradas.",
  },
  {
    title: "Segurança",
    content: [
      "Senhas armazenadas com hash bcrypt (12 rounds) — nunca em texto claro.",
      "Comunicação protegida por HTTPS/TLS.",
       "Sessão mantida em cookies HttpOnly, sem persistência do token em armazenamento acessível a JavaScript.",
      "Controle de acesso baseado em perfis (RBAC).",
      "Rate limiting para prevenção de ataques de força bruta.",
    ],
  },
  {
    title: "Seus direitos (LGPD, art. 18)",
    content: [
      "Confirmação da existência de tratamento e acesso aos dados.",
      "Correção de dados incompletos, inexatos ou desatualizados.",
      "Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos.",
      "Portabilidade dos dados a outro fornecedor de serviço.",
      "Eliminação dos dados tratados com consentimento.",
      "Informação sobre entidades com as quais os dados foram compartilhados.",
      "Revogação do consentimento a qualquer momento.",
       "Para exercer seus direitos, use a página /privacidade/solicitacao ou escreva para privacidade@adqpal.com.br. A identidade será verificada antes da entrega ou alteração de dados.",
    ],
  },
  {
    title: "Alterações nesta política",
    content:
      "Esta política pode ser atualizada periodicamente. Em caso de alterações relevantes, os usuários serão notificados por e-mail ou mediante aviso na plataforma com antecedência mínima de 15 dias.",
  },
];

export default function PoliticaPrivacidadePage() {
  return (
    <LgpdLayout
      title="Política de Privacidade"
      lastUpdated="12 de novembro de 2026"
      sections={sections}
    />
  );
}
