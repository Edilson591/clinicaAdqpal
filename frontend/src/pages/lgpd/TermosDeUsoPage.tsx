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
      "O Instituto ADQPAL adotará medidas razoáveis para manter a disponibilidade e segurança da plataforma. Níveis de serviço, janelas de manutenção e condições para alteração de funcionalidades serão os definidos no contrato aplicável e comunicados de forma clara.",
  },
  {
    title: "Propriedade intelectual",
    content:
      "O conteúdo próprio da plataforma é protegido pela legislação aplicável. Dados pessoais não são tratados como propriedade comercial: seu tratamento ocorre conforme as funções de controlador e operador, as finalidades informadas, o contrato e a legislação.",
  },
  {
    title: "Responsabilidades",
    content:
      "As responsabilidades serão apuradas conforme a legislação e o contrato aplicáveis. Nenhuma disposição destes Termos exclui direitos obrigatórios do consumidor, deveres de segurança, proteção de dados ou responsabilidade que não possa ser afastada por contrato.",
  },
  {
    title: "Rescisão",
    content:
      "As condições de rescisão, cancelamento, eventual restituição e transição de dados devem constar de forma destacada no contrato aplicável. Solicitações não eliminam registros sujeitos a conservação legal, regulatória ou necessária ao exercício de direitos.",
  },
  {
    title: "Lei aplicável e foro",
    content:
      "Estes Termos são regidos pelas leis brasileiras. O foro e os meios de solução de controvérsias observarão as regras legais aplicáveis, inclusive as garantias do consumidor e de acesso à Justiça.",
  },
];

export default function TermosDeUsoPage() {
  return (
    <LgpdLayout
      title="Termos de Uso"
      lastUpdated="12 de novembro de 2026"
      sections={sections}
    />
  );
}
