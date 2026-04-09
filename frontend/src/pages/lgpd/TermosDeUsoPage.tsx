import { LgpdLayout } from "../../components/ui/LgpdLayout";

const sections = [
  {
    title: "Aceitação dos termos",
    content:
      "Ao acessar e utilizar a plataforma ADQPAL, você declara ter lido, compreendido e concordado com estes Termos de Uso. O uso da plataforma por profissionais menores de 18 anos é vedado. Caso não concorde com alguma cláusula, interrompa imediatamente o uso e entre em contato conosco.",
  },
  {
    title: "Descrição do serviço",
    content:
      "O ADQPAL é um sistema de gestão clínica destinado exclusivamente a profissionais de saúde habilitados e instituições médicas. A plataforma permite o cadastro de pacientes, agendamento de consultas, registro de prontuários eletrônicos e comunicação com pacientes via canais autorizados.",
  },
  {
    title: "Elegibilidade e cadastro",
    content: [
      "O uso é restrito a profissionais de saúde com registro ativo em seus respectivos Conselhos (CRM, CRO, CRN, etc.) e a funcionários administrativos autorizados pela instituição contratante.",
      "Cada usuário é responsável pela veracidade das informações cadastradas e pela confidencialidade de suas credenciais de acesso.",
      "A instituição contratante é responsável pela gestão dos perfis de acesso de seus colaboradores.",
      "O compartilhamento de credenciais é expressamente vedado.",
    ],
  },
  {
    title: "Responsabilidades do usuário",
    content: [
      "Utilizar a plataforma exclusivamente para fins clínicos legítimos.",
      "Garantir a precisão e atualização das informações inseridas.",
      "Respeitar o sigilo médico e a confidencialidade dos dados dos pacientes.",
      "Comunicar imediatamente qualquer acesso não autorizado à conta ao suporte técnico.",
      "Cumprir as normas do CFM, CFF e demais conselhos profissionais aplicáveis.",
      "Obter o consentimento adequado do paciente antes de registrar dados sensíveis de saúde.",
    ],
  },
  {
    title: "Usos proibidos",
    content: [
      "Acessar dados de pacientes sem autorização clínica ou legal.",
      "Utilizar os dados para fins comerciais, de marketing ou não relacionados ao atendimento clínico.",
      "Tentar burlar mecanismos de segurança ou autenticação.",
      "Realizar engenharia reversa, descompilação ou cópia não autorizada do software.",
      "Transmitir vírus, malware ou qualquer código malicioso.",
      "Utilizar a plataforma em desacordo com a legislação vigente, especialmente a LGPD e o CFM.",
    ],
  },
  {
    title: "Prontuário eletrônico e responsabilidade clínica",
    content:
      "O profissional de saúde é exclusivamente responsável pelo conteúdo clínico registrado nos prontuários. O Instituto ADQPAL fornece a infraestrutura tecnológica, mas não interfere nem valida as decisões clínicas. O sistema não substitui o julgamento clínico do profissional habilitado.",
  },
  {
    title: "Disponibilidade e atualizações",
    content:
      "O Instituto ADQPAL envidará esforços razoáveis para manter a plataforma disponível 24/7, mas não garante disponibilidade ininterrupta. Manutenções programadas serão comunicadas com antecedência mínima de 24 horas. Reservamo-nos o direito de atualizar, modificar ou descontinuar funcionalidades mediante aviso prévio.",
  },
  {
    title: "Propriedade intelectual",
    content:
      "Todo o conteúdo da plataforma (código-fonte, interface, logotipos, metodologias) é propriedade do Instituto ADQPAL e protegido por direitos autorais. Os dados inseridos pelos usuários e pacientes pertencem à instituição contratante, que concede ao ADQPAL licença limitada para processá-los conforme a Política de Privacidade.",
  },
  {
    title: "Limitação de responsabilidade",
    content:
      "O Instituto ADQPAL não se responsabiliza por danos decorrentes de: (i) uso inadequado da plataforma pelo usuário; (ii) decisões clínicas baseadas em dados incorretos inseridos pelo próprio usuário; (iii) falhas de conectividade de terceiros; (iv) eventos de força maior. Nossa responsabilidade máxima é limitada ao valor pago pelo serviço nos últimos 3 meses.",
  },
  {
    title: "Rescisão",
    content:
      "A instituição contratante pode rescindir o contrato a qualquer momento com aviso de 30 dias. Após a rescisão, os dados poderão ser exportados por 90 dias e serão eliminados após esse prazo, respeitadas as obrigações legais de retenção de prontuários.",
  },
  {
    title: "Lei aplicável e foro",
    content:
      "Estes Termos são regidos pelas leis brasileiras. Para dirimir controvérsias, fica eleito o foro da comarca de São Paulo/SP, com renúncia expressa a qualquer outro, por mais privilegiado que seja.",
  },
];

export default function TermosDeUsoPage() {
  return (
    <LgpdLayout
      title="Termos de Uso"
      lastUpdated="09 de abril de 2026"
      sections={sections}
    />
  );
}
