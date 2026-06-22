import type { AdministrativeDocumentConfig } from "./types";
import { AtaAssembleiaGeralPrint } from "./templates/AtaAssembleiaGeralPrint";
import { AtestadoMedicoPrint } from "./templates/AtestadoMedicoPrint";
import { DeclaracaoCebasArt7453Print } from "./templates/DeclaracaoCebasArt7453Print";
import { DeclaracaoCebasPrint } from "./templates/DeclaracaoCebasPrint";
import { DeclaracaoDesligamentoPrint } from "./templates/DeclaracaoDesligamentoPrint";
import { DoacaoCestaBasicaPrint } from "./templates/DoacaoCestaBasicaPrint";
import { DoacaoEnxovalGestantePrint } from "./templates/DoacaoEnxovalGestantePrint";
import { EditalConvocacaoAgePrint } from "./templates/EditalConvocacaoAgePrint";
import { EstatutoAdqpalPrint } from "./templates/EstatutoAdqpalPrint";
import { ConvitePrint } from "./templates/ConvitePrint";
import { FinancialEditablePrint } from "./templates/FinancialEditablePrint";
import { GenericEditableTextPrint } from "./templates/GenericEditableTextPrint";
import { ListaPresencaAgePrint } from "./templates/ListaPresencaAgePrint";
import { OficioPrint } from "./templates/OficioPrint";
import { PlanoAcaoPrint } from "./templates/PlanoAcaoPrint";
import { ReciboPrint } from "./templates/ReciboPrint";
import { RelatorioMedicoPrint } from "./templates/RelatorioMedicoPrint";
import { ProjetoSedeAdqpalPrint } from "./templates/ProjetoSedeAdqpalPrint";
import { ProcuracaoPrint } from "./templates/ProcuracaoPrint";
import { RelatorioAtividadesPrint } from "./templates/RelatorioAtividadesPrint";
import { RequerimentoPrint } from "./templates/RequerimentoPrint";
import { RequerimentoCebasPrint } from "./templates/RequerimentoCebasPrint";
import { TermoFomentoConvenioPrint } from "./templates/TermoFomentoConvenioPrint";
import { TermoVoluntarioPrint } from "./templates/TermoVoluntarioPrint";

const DECLARACAO_DESLIGAMENTO_BASE = `Declaro, para os devidos fins, que o(a) beneficiario(a) identificado(a) neste documento encontra-se desligado(a) dos registros e atividades desta instituicao.

O desligamento passa a produzir efeitos administrativos a partir da data informada, sem prejuizo de eventuais registros internos, documentos complementares ou comunicacoes necessarias.

Esta declaracao e emitida para que produza os efeitos legais e administrativos cabiveis.`;

const REQUERIMENTO_BASE = `Ao orgao competente,

A ADQPAL - Associacao dos Dependentes Quimicos e Portadores de Doencas Psiquiatricas de Sao Miguel dos Campos/AL, vem respeitosamente requerer a analise e deferimento da solicitacao apresentada.

Fundamenta o presente requerimento nas atividades institucionais desenvolvidas pela entidade, em sua finalidade estatutaria e na necessidade administrativa descrita neste documento.

Nestes termos, pede deferimento.`;

const TERMO_FOMENTO_BASE = `Pelo presente instrumento, a ADQPAL e o parceiro/convenente identificado ajustam o presente termo de fomento/convenio para execucao de atividades institucionais.

O objeto, valores, vigencia, responsabilidades e demais condicoes poderao ser adequados conforme o plano de trabalho, instrumento juridico ou exigencia do orgao concedente.

As partes comprometem-se a cumprir as obrigacoes assumidas, observando as normas legais, administrativas e financeiras aplicaveis.`;

const ESTATUTO_BASE = `CAPITULO I - DA DENOMINACAO, SEDE E FINALIDADE

A Associacao dos Dependentes Quimicos e Portadores de Doencas Psiquiatricas de Sao Miguel dos Campos, abreviadamente ADQPAL, e uma associacao civil sem fins lucrativos.

CAPITULO II - DOS OBJETIVOS

A entidade tem por finalidade promover a defesa de direitos, apoio social, cuidados em saude, acolhimento, orientacao e atividades voltadas aos seus assistidos e familiares.

CAPITULO III - DA ADMINISTRACAO

A administracao da entidade sera exercida conforme disposicoes estatutarias, assembleias e demais normas internas aplicaveis.`;

const ATA_ASSEMBLEIA_BASE = `Aos dias informados, reuniram-se os membros, associados e representantes da ADQPAL em Assembleia Geral, no local indicado neste documento.

Aberta a reuniao, foi apresentada a pauta para deliberacao. Apos discussao, os presentes deliberaram conforme registrado nesta ata.

Nada mais havendo a tratar, foi encerrada a assembleia, lavrando-se a presente ata para os devidos fins.`;

const PROJETO_SEDE_BASE = `O presente projeto tem por objetivo viabilizar a construcao, reforma ou estruturacao da sede da ADQPAL, fortalecendo a capacidade de atendimento institucional.

A iniciativa busca melhorar o acolhimento, ampliar os servicos oferecidos e garantir melhores condicoes de atendimento aos pacientes, familiares e comunidade.

A execucao podera envolver recursos publicos, emendas parlamentares, convenios, doacoes ou outras fontes legais de financiamento.`;

const RELATORIO_ATIVIDADES_BASE = `Este relatorio apresenta as principais atividades desenvolvidas pela ADQPAL no periodo informado.

Foram realizadas acoes de atendimento, orientacao, acompanhamento, encaminhamentos, atividades socioassistenciais e apoio aos pacientes e familiares atendidos pela instituicao.

Os resultados demonstram o compromisso institucional com a promocao de direitos, cuidado em saude, assistencia social e fortalecimento comunitario.`;

const DECLARACAO_CEBAS_BASE = `Declaramos, para os devidos fins, que a ADQPAL desenvolve atividades institucionais sem finalidade lucrativa, observando suas finalidades estatutarias.

A entidade atua em beneficio de seus assistidos, pacientes, familiares e comunidade, promovendo atividades de saude, assistencia social, apoio psicossocial, orientacao e encaminhamento.

Todos os recursos arrecadados sao aplicados na manutencao e desenvolvimento de suas finalidades institucionais.`;

const DECLARACAO_CEBAS_ART_BASE = `A ADQPAL declara, para os devidos fins, que atende aos requisitos legais aplicaveis ao processo de certificacao, mantendo finalidade nao lucrativa e aplicacao de recursos em seus objetivos institucionais.

Declara ainda que mantem registros administrativos, documentos institucionais e atividades compativeis com sua natureza beneficente, observadas as normas vigentes.`;

const genericEditableFields = (titulo: string, subtitulo: string, texto: string) => [
  { name: "titulo", label: "Titulo", placeholder: titulo, defaultValue: titulo, required: true, full: true },
  { name: "subtitulo", label: "Subtitulo", placeholder: subtitulo, defaultValue: subtitulo, full: true },
  { name: "texto", label: "Texto integral editavel", placeholder: "Edite o texto completo do documento", defaultValue: texto, type: "textarea" as const, required: true, full: true, rows: 18 },
  { name: "data", label: "Data", placeholder: "Sao Miguel dos Campos/AL, 20 de Junho de 2026", full: true },
  {
    name: "assinatura",
    label: "Incluir assinatura?",
    defaultValue: "sim",
    type: "select" as const,
    options: [
      { value: "sim", label: "Sim" },
      { value: "nao", label: "Não" },
    ],
  },
];

const financeiroFields = (titulo: string, periodo: string, linhas: string) => [
  { name: "titulo", label: "Titulo", placeholder: titulo, defaultValue: titulo, required: true, full: true },
  { name: "periodo", label: "Periodo", placeholder: periodo, defaultValue: periodo, full: true },
  { name: "intro", label: "Introducao", placeholder: "Texto introdutorio", type: "textarea" as const, full: true, rows: 6 },
  { name: "linhas", label: "Linhas da tabela (Descricao | Valor)", placeholder: "Receita | R$ 0,00", defaultValue: linhas, type: "textarea" as const, required: true, full: true, rows: 12 },
  { name: "reconhecimento", label: "Reconhecimento / observacoes", placeholder: "Texto final", type: "textarea" as const, full: true, rows: 5 },
  { name: "data", label: "Data", placeholder: "Sao Miguel dos Campos/AL, 20 de Junho de 2026", full: true },
];

export const administrativeDocuments: AdministrativeDocumentConfig[] = [
  {
    id: "termo-voluntario",
    title: "Termo de Voluntario",
    description: "Declaracao simples para formalizar atividade voluntaria.",
    group: "Documentos Administrativos",
    Template: TermoVoluntarioPrint,
    fields: [
      { name: "nome", label: "Nome do voluntario", placeholder: "Nome completo", required: true },
      { name: "cpf", label: "CPF", placeholder: "000.000.000-00", required: true },
      { name: "estadoCivil", label: "Estado civil", placeholder: "Solteiro(a), casado(a)..." },
      { name: "profissao", label: "Profissao", placeholder: "Profissao / conselho" },
      { name: "endereco", label: "Endereco completo", placeholder: "Rua, numero, bairro, cidade", full: true },
      { name: "data", label: "Data", placeholder: "Sao Miguel dos Campos/AL, 20 de Junho de 2026", full: true },
    ],
  },
  {
    id: "atestado-medico",
    title: "Atestado Medico",
    description: "Modelo inicial de atestado com medico, paciente e afastamento.",
    group: "Saude e Relatorios",
    Template: AtestadoMedicoPrint,
    fields: [
      { name: "nome", label: "Paciente", placeholder: "Nome completo", required: true },
      { name: "rg", label: "RG", placeholder: "Documento de identidade" },
      { name: "cpf", label: "CPF", placeholder: "000.000.000-00" },
      { name: "dias", label: "Dias de afastamento", placeholder: "UM (01) DIA", required: true },
      { name: "inicio", label: "A partir de", placeholder: "22/05/2026", required: true },
      { name: "cid", label: "CID", placeholder: "Opcional" },
      { name: "medico", label: "Medico", placeholder: "Nome do medico", required: true },
      { name: "crm", label: "CRM", placeholder: "CRM/AL 0000", required: true },
      { name: "data", label: "Data", placeholder: "Sao Miguel dos Campos/AL, 20 de Junho de 2026", full: true },
    ],
  },
  {
    id: "declaracao-desligamento",
    title: "Declaracao de Desligamento",
    description: "Declaracao administrativa de desligamento de beneficiario ou vinculado.",
    group: "Documentos Administrativos",
    Template: DeclaracaoDesligamentoPrint,
    fields: [
      { name: "textoIntegral", label: "Texto integral editavel", placeholder: "Edite o texto completo da declaracao", defaultValue: DECLARACAO_DESLIGAMENTO_BASE, type: "textarea", required: true, full: true, rows: 12 },
      { name: "nome", label: "Nome", placeholder: "Nome completo", required: true },
      { name: "cpf", label: "CPF", placeholder: "000.000.000-00", required: true },
      { name: "dataDesligamento", label: "Data do desligamento", placeholder: "22/05/2026", required: true },
      { name: "motivo", label: "Motivo", placeholder: "por solicitacao do(a) interessado(a)", type: "textarea", full: true },
      { name: "data", label: "Data de emissao", placeholder: "Sao Miguel dos Campos/AL, 20 de Junho de 2026", full: true },
    ],
  },
  {
    id: "requerimento",
    title: "Requerimento",
    description: "Modelo base para requerimentos e solicitacoes administrativas.",
    group: "Documentos Administrativos",
    Template: RequerimentoPrint,
    fields: [
      { name: "textoIntegral", label: "Texto integral editavel", placeholder: "Edite o texto completo do requerimento", defaultValue: REQUERIMENTO_BASE, type: "textarea", required: true, full: true, rows: 14 },
      { name: "requerente", label: "Requerente", placeholder: "ADQPAL ou nome do requerente", required: true },
      { name: "destinatario", label: "Destinatario", placeholder: "Orgao, setor ou autoridade", required: true },
      { name: "assunto", label: "Assunto", placeholder: "Ex: renovacao, declaracao, cadastro", required: true, full: true },
      { name: "fundamentacao", label: "Fundamentacao", placeholder: "Descreva os fatos e fundamentos", type: "textarea", required: true, full: true },
      { name: "pedido", label: "Pedido", placeholder: "Descreva o pedido final", type: "textarea", required: true, full: true },
      { name: "data", label: "Data", placeholder: "Sao Miguel dos Campos/AL, 20 de Junho de 2026", full: true },
    ],
  },
  {
    id: "edital-convocacao-age",
    title: "Edital de Convocacao AGE",
    description: "Convocacao para Assembleia Geral Extraordinaria.",
    group: "Assembleia e Estatuto",
    Template: EditalConvocacaoAgePrint,
    fields: [
      { name: "gestao", label: "Gestao", placeholder: "2024/2027" },
      { name: "dataAssembleia", label: "Data da assembleia", placeholder: "10 de Janeiro de 2026", required: true },
      { name: "horario", label: "Horario", placeholder: "15h00", required: true },
      { name: "local", label: "Local", placeholder: "Sede da ADQPAL", required: true, full: true },
      { name: "pauta", label: "Pauta", placeholder: "Informe a pauta da assembleia", type: "textarea", required: true, full: true },
      { name: "data", label: "Data de emissao", placeholder: "Sao Miguel dos Campos/AL, 20 de Junho de 2026", full: true },
    ],
  },
  {
    id: "recibo",
    title: "Recibo",
    description: "Comprovante simples de recebimento.",
    group: "Financeiro e Contabil",
    Template: ReciboPrint,
    fields: [
      { name: "favorecido", label: "Favorecido", placeholder: "Quem recebe", required: true },
      { name: "pagador", label: "Pagador", placeholder: "Quem paga", required: true },
      { name: "cpf", label: "CPF do pagador", placeholder: "000.000.000-00" },
      { name: "valor", label: "Valor", placeholder: "500,00", required: true },
      { name: "referente", label: "Referente a", placeholder: "Servicos prestados, material...", type: "textarea", full: true },
      { name: "data", label: "Data", placeholder: "Sao Miguel dos Campos/AL, 20 de Junho de 2026", full: true },
    ],
  },
  {
    id: "doacao-cesta-basica",
    title: "Doacao de Cesta Basica",
    description: "Termo para registrar entrega de cesta basica.",
    group: "Doacoes e Beneficios",
    Template: DoacaoCestaBasicaPrint,
    fields: [
      { name: "nome", label: "Beneficiario", placeholder: "Nome completo", required: true },
      { name: "cpf", label: "CPF", placeholder: "000.000.000-00" },
      { name: "endereco", label: "Endereco", placeholder: "Rua, numero, bairro", full: true },
      { name: "itens", label: "Itens doados", placeholder: "1 kg Arroz\n1 kg Feijao\n1 Oleo de soja", type: "textarea", full: true },
      { name: "observacoes", label: "Observacoes", placeholder: "Informacoes adicionais", type: "textarea", full: true },
      { name: "data", label: "Data", placeholder: "Sao Miguel dos Campos/AL, 20 de Junho de 2026", full: true },
    ],
  },
  {
    id: "doacao-enxoval-gestante",
    title: "Doacao de Enxoval Gestante",
    description: "Termo para registrar entrega de enxoval a gestante.",
    group: "Doacoes e Beneficios",
    Template: DoacaoEnxovalGestantePrint,
    fields: [
      { name: "nome", label: "Gestante", placeholder: "Nome completo", required: true },
      { name: "cpf", label: "CPF", placeholder: "000.000.000-00" },
      { name: "endereco", label: "Endereco", placeholder: "Rua, numero, bairro", full: true },
      { name: "previsaoParto", label: "DUM / Previsao do parto", placeholder: "15/08/2026" },
      { name: "itens", label: "Itens do enxoval", placeholder: "3 bodies manga curta\n2 macacoes\n1 cobertor", type: "textarea", full: true },
      { name: "data", label: "Data", placeholder: "Sao Miguel dos Campos/AL, 20 de Junho de 2026", full: true },
    ],
  },
  {
    id: "relatorio-medico",
    title: "Relatorio Medico",
    description: "Relatorio clinico com historico, conduta e parecer.",
    group: "Saude e Relatorios",
    Template: RelatorioMedicoPrint,
    fields: [
      { name: "nome", label: "Paciente", placeholder: "Nome completo", required: true },
      { name: "nascimento", label: "Data de nascimento", placeholder: "DD/MM/AAAA" },
      { name: "diagnostico", label: "Diagnostico / CID", placeholder: "Ex: Hipertensao arterial / CID I10", required: true, full: true },
      { name: "historico", label: "Historico clinico", placeholder: "Descreva o historico do paciente", type: "textarea", full: true },
      { name: "conduta", label: "Conduta / Tratamento", placeholder: "Descreva a conduta adotada", type: "textarea", full: true },
      { name: "conclusao", label: "Conclusao / Parecer", placeholder: "Conclusao medica", type: "textarea", full: true },
      { name: "medico", label: "Medico", placeholder: "Nome do medico", required: true },
      { name: "crm", label: "CRM", placeholder: "CRM/AL 0000", required: true },
      { name: "data", label: "Data", placeholder: "Sao Miguel dos Campos/AL, 20 de Junho de 2026", full: true },
    ],
  },
  {
    id: "oficio",
    title: "Oficio",
    description: "Comunicacao formal para orgaos, entidades e parceiros.",
    group: "Documentos Administrativos",
    Template: OficioPrint,
    fields: [
      { name: "numero", label: "Numero do oficio", placeholder: "59", required: true },
      { name: "destinatario", label: "Destinatario", placeholder: "Nome ou cargo", required: true, full: true },
      { name: "orgao", label: "Orgao / Organizacao", placeholder: "Camara Municipal, Secretaria...", full: true },
      { name: "assunto", label: "Assunto", placeholder: "Finalidade do oficio", required: true, full: true },
      { name: "corpo", label: "Texto do oficio", placeholder: "Descreva o conteudo do oficio", type: "textarea", required: true, full: true },
      { name: "contato", label: "Contato", placeholder: "(82) 9.9303-4593" },
      { name: "data", label: "Data", placeholder: "Sao Miguel dos Campos/AL, 20 de Junho de 2026", full: true },
    ],
  },
  {
    id: "procuracao",
    title: "Procuracao",
    description: "Instrumento de poderes para representacao administrativa.",
    group: "Documentos Administrativos",
    Template: ProcuracaoPrint,
    fields: [
      { name: "outorgante", label: "Outorgante", placeholder: "Naedja Silva Melo", required: true },
      { name: "outorganteCpf", label: "CPF da outorgante", placeholder: "000.000.000-00", required: true },
      { name: "outorganteRg", label: "RG da outorgante", placeholder: "RG / orgao emissor" },
      { name: "outorganteEndereco", label: "Endereco da outorgante", placeholder: "Endereco completo", full: true },
      { name: "procurador", label: "Procurador", placeholder: "Nome completo", required: true },
      { name: "procuradorCpf", label: "CPF do procurador", placeholder: "000.000.000-00", required: true },
      { name: "procuradorRg", label: "RG do procurador", placeholder: "RG / orgao emissor" },
      { name: "procuradorEndereco", label: "Endereco do procurador", placeholder: "Endereco completo", full: true },
      { name: "poderes", label: "Poderes concedidos", placeholder: "Descreva os poderes", type: "textarea", required: true, full: true },
      { name: "validade", label: "Validade", placeholder: "Indeterminado" },
      { name: "data", label: "Data", placeholder: "Sao Miguel dos Campos/AL, 20 de Junho de 2026", full: true },
    ],
  },
  {
    id: "termo-fomento-convenio",
    title: "Termo de Fomento/Convenio",
    description: "Modelo base para parceria, convenio ou termo de fomento.",
    group: "Convenios e Parcerias",
    Template: TermoFomentoConvenioPrint,
    fields: [
      { name: "titulo", label: "Titulo", placeholder: "Termo de Fomento/Convenio", required: true, full: true },
      { name: "textoIntegral", label: "Texto integral editavel", placeholder: "Edite o texto completo do termo", defaultValue: TERMO_FOMENTO_BASE, type: "textarea", required: true, full: true, rows: 14 },
      { name: "parceiro", label: "Parceiro / Convenente", placeholder: "Nome do parceiro", required: true, full: true },
      { name: "objeto", label: "Objeto", placeholder: "Descreva o objeto da parceria", type: "textarea", required: true, full: true },
      { name: "valor", label: "Valor", placeholder: "R$ 0,00" },
      { name: "vigencia", label: "Vigencia", placeholder: "12 meses" },
      { name: "responsabilidades", label: "Responsabilidades", placeholder: "Responsabilidades das partes", type: "textarea", full: true },
      { name: "data", label: "Data", placeholder: "Sao Miguel dos Campos/AL, 20 de Junho de 2026", full: true },
    ],
  },
  {
    id: "lista-presenca-age",
    title: "Lista de Presenca AGE",
    description: "Lista para coleta de presenca em Assembleia Geral Extraordinaria.",
    group: "Assembleia e Estatuto",
    Template: ListaPresencaAgePrint,
    fields: [
      { name: "numero", label: "Numero da AGE", placeholder: "001/2026" },
      { name: "dataAssembleia", label: "Data da assembleia", placeholder: "10 de Junho de 2026", required: true },
      { name: "horario", label: "Horario", placeholder: "18h00" },
      { name: "local", label: "Local", placeholder: "Sede da ADQPAL", full: true },
      { name: "pauta", label: "Pauta", placeholder: "Prestacao de contas e deliberacoes", full: true },
      { name: "linhas", label: "Numero de linhas", placeholder: "20" },
    ],
  },
  {
    id: "requerimento-cebas",
    title: "Requerimento CEBAS",
    description: "Pedido de concessao ou renovacao de certificacao CEBAS.",
    group: "CEBAS e Ministerio",
    Template: RequerimentoCebasPrint,
    fields: [
      { name: "cnpj", label: "CNPJ", placeholder: "16.920.069/0001-73" },
      { name: "certificacao", label: "Certificacao pleiteada", placeholder: "CEBAS Saude, CEBAS Assistencia Social", required: true, full: true },
      { name: "destinatario", label: "Destinatario / Orgao", placeholder: "Ministerio da Saude / CGOAS", required: true, full: true },
      { name: "fundamentacao", label: "Fundamentacao", placeholder: "Descreva as atividades da ADQPAL", type: "textarea", required: true, full: true },
      { name: "observacoes", label: "Observacoes", placeholder: "Informacoes adicionais", type: "textarea", full: true },
      { name: "data", label: "Data", placeholder: "Sao Miguel dos Campos/AL, 20 de Junho de 2026", full: true },
    ],
  },
  {
    id: "estatuto-adqpal",
    title: "Estatuto ADQPAL",
    description: "Modelo editavel para estatuto social ou trechos estatutarios.",
    group: "Assembleia e Estatuto",
    Template: EstatutoAdqpalPrint,
    fields: [
      { name: "titulo", label: "Titulo", placeholder: "Estatuto Social", required: true },
      { name: "associacao", label: "Nome da associacao", placeholder: "Associacao...", required: true, full: true },
      { name: "sigla", label: "Sigla", placeholder: "ADQPAL" },
      { name: "cnpj", label: "CNPJ", placeholder: "16.920.069/0001-73" },
      { name: "endereco", label: "Endereco", placeholder: "Endereco completo", full: true },
      { name: "texto", label: "Texto integral editavel do estatuto", placeholder: "Cole ou digite o texto do estatuto", defaultValue: ESTATUTO_BASE, type: "textarea", required: true, full: true, rows: 18 },
      { name: "data", label: "Data", placeholder: "Sao Miguel dos Campos/AL, 20 de Junho de 2026", full: true },
    ],
  },
  {
    id: "ata-assembleia-geral",
    title: "Ata da Assembleia Geral",
    description: "Registro editavel de assembleia, pauta e deliberacoes.",
    group: "Assembleia e Estatuto",
    Template: AtaAssembleiaGeralPrint,
    fields: [
      { name: "titulo", label: "Titulo", placeholder: "Ata da Assembleia Geral", required: true },
      { name: "gestao", label: "Gestao", placeholder: "2024/2028" },
      { name: "local", label: "Local", placeholder: "Sede da ADQPAL", full: true },
      { name: "dataAssembleia", label: "Data da assembleia", placeholder: "10 de Novembro de 2024", required: true },
      { name: "pauta", label: "Pauta", placeholder: "Pauta da assembleia", required: true, full: true },
      { name: "texto", label: "Texto integral editavel da ata", placeholder: "Conteudo completo da ata", defaultValue: ATA_ASSEMBLEIA_BASE, type: "textarea", required: true, full: true, rows: 16 },
      { name: "data", label: "Data de emissao", placeholder: "Sao Miguel dos Campos/AL, 20 de Junho de 2026", full: true },
    ],
  },
  {
    id: "projeto-sede-adqpal",
    title: "Projeto da Sede ADQPAL",
    description: "Projeto para construcao, reforma ou estruturacao da sede.",
    group: "Saude e Relatorios",
    Template: ProjetoSedeAdqpalPrint,
    fields: [
      { name: "titulo", label: "Titulo", placeholder: "Projeto para Construcao da Sede da ADQPAL", required: true, full: true },
      { name: "textoIntegral", label: "Texto integral editavel do projeto", placeholder: "Edite o texto completo do projeto", defaultValue: PROJETO_SEDE_BASE, type: "textarea", required: true, full: true, rows: 16 },
      { name: "ano", label: "Ano", placeholder: "2026" },
      { name: "valor", label: "Valor / Fonte", placeholder: "Emendas Parlamentares" },
      { name: "publico", label: "Publico alvo", placeholder: "Pacientes, familiares e comunidade", full: true },
      { name: "objetivo", label: "Objetivo", placeholder: "Objetivo do projeto", type: "textarea", required: true, full: true },
      { name: "justificativa", label: "Justificativa", placeholder: "Justificativa do projeto", type: "textarea", required: true, full: true },
      { name: "data", label: "Data", placeholder: "Sao Miguel dos Campos/AL, 2026", full: true },
    ],
  },
  {
    id: "relatorio-atividades",
    title: "Relatorio de Atividades",
    description: "Relatorio anual de atendimentos, acoes e resultados.",
    group: "Saude e Relatorios",
    Template: RelatorioAtividadesPrint,
    fields: [
      { name: "titulo", label: "Titulo", placeholder: "Relatorio de Atividades", required: true },
      { name: "textoIntegral", label: "Texto integral editavel do relatorio", placeholder: "Edite o texto completo do relatorio", defaultValue: RELATORIO_ATIVIDADES_BASE, type: "textarea", required: true, full: true, rows: 16 },
      { name: "ano", label: "Ano", placeholder: "2025" },
      { name: "atendimentos", label: "Atendimentos / beneficiarios", placeholder: "Ex: 500 atendimentos", full: true },
      { name: "resumo", label: "Resumo das atividades", placeholder: "Descreva as atividades", type: "textarea", required: true, full: true },
      { name: "resultados", label: "Resultados", placeholder: "Descreva os resultados", type: "textarea", full: true },
      { name: "data", label: "Data", placeholder: "Sao Miguel dos Campos/AL, 20 de Junho de 2026", full: true },
    ],
  },
  {
    id: "declaracao-cebas",
    title: "Declaracao CEBAS",
    description: "Declaracao institucional para processos de certificacao CEBAS.",
    group: "CEBAS e Ministerio",
    Template: DeclaracaoCebasPrint,
    fields: [
      { name: "titulo", label: "Titulo", placeholder: "Declaracao CEBAS", required: true },
      { name: "textoIntegral", label: "Texto integral editavel", placeholder: "Edite o texto completo da declaracao", defaultValue: DECLARACAO_CEBAS_BASE, type: "textarea", required: true, full: true, rows: 14 },
      { name: "ano", label: "Ano", placeholder: "2025" },
      { name: "declaracao", label: "Texto declaratorio", placeholder: "Declaramos...", type: "textarea", required: true, full: true },
      { name: "atividades", label: "Atividades", placeholder: "Atividades realizadas", type: "textarea", required: true, full: true },
      { name: "data", label: "Data", placeholder: "Sao Miguel dos Campos/AL, 20 de Junho de 2026", full: true },
    ],
  },
  {
    id: "declaracao-cebas-art7453",
    title: "Declaracao CEBAS Art. 74/53",
    description: "Declaracao de atendimento aos requisitos legais do decreto.",
    group: "CEBAS e Ministerio",
    Template: DeclaracaoCebasArt7453Print,
    fields: [
      { name: "anoDecreto", label: "Ano do decreto", placeholder: "2023" },
      { name: "inciso", label: "Inciso", placeholder: "Inciso II" },
      { name: "requisitos", label: "Texto integral editavel dos requisitos", placeholder: "Texto dos requisitos", defaultValue: DECLARACAO_CEBAS_ART_BASE, type: "textarea", required: true, full: true, rows: 14 },
      { name: "observacoes", label: "Observacoes", placeholder: "Observacoes complementares", type: "textarea", full: true },
      { name: "data", label: "Data", placeholder: "Sao Miguel dos Campos/AL, 20 de Junho de 2026", full: true },
    ],
  },
  {
    id: "documento-sinibref",
    title: "Documento SINIBREF",
    description: "Documento de convenio/parceria originalmente editavel por texto integral.",
    group: "Convenios e Parcerias",
    Template: GenericEditableTextPrint,
    fields: genericEditableFields("Documento SINIBREF", "ADQPAL - Fenatibref", "Edite aqui o texto integral do Documento SINIBREF."),
  },
  {
    id: "certificacao-cebas-saude",
    title: "Certificacao CEBAS-Saude",
    description: "Documento editavel para certificacao CEBAS na area da saude.",
    group: "CEBAS e Ministerio",
    Template: GenericEditableTextPrint,
    fields: genericEditableFields("Certificacao CEBAS-Saude", "ADQPAL - CEBAS-Saude", "Edite aqui o texto integral da certificacao CEBAS-Saude."),
  },
  {
    id: "solicitacao-ministerio-saude",
    title: "Solicitacao Ministerio da Saude",
    description: "Solicitacao editavel para encaminhamento ao Ministerio da Saude.",
    group: "CEBAS e Ministerio",
    Template: GenericEditableTextPrint,
    fields: genericEditableFields("Solicitacao Ministerio da Saude", "ADQPAL - Ministerio da Saude", "Edite aqui o texto integral da solicitacao ao Ministerio da Saude."),
  },
  {
    id: "demonstracao-exercicio",
    title: "Demonstracao do Exercicio",
    description: "Documento financeiro com linhas editaveis em formato tabela.",
    group: "Financeiro e Contabil",
    Template: FinancialEditablePrint,
    fields: financeiroFields("Demonstracao do Exercicio", "Exercicio encerrado em 31 de Dezembro", "Receitas operacionais | R$ 0,00\nDespesas operacionais | R$ 0,00\nSuperavit/Deficit do exercicio | R$ 0,00"),
  },
  {
    id: "balanco-patrimonial",
    title: "Balanco Patrimonial",
    description: "Balanco patrimonial com tabela editavel de ativo, passivo e patrimonio.",
    group: "Financeiro e Contabil",
    Template: FinancialEditablePrint,
    fields: financeiroFields("Balanco Patrimonial", "Saldo Atual", "Ativo circulante | R$ 0,00\nAtivo nao circulante | R$ 0,00\nPassivo circulante | R$ 0,00\nPatrimonio liquido | R$ 0,00"),
  },
  {
    id: "convite",
    title: "Convite",
    description: "Convite de evento com campos estruturados e texto editavel.",
    group: "Eventos e Convites",
    Template: ConvitePrint,
    fields: [
      { name: "titulo", label: "Titulo", placeholder: "Convite", defaultValue: "Convite", required: true },
      { name: "kicker", label: "Chamada", placeholder: "A ADQPAL tem a honra de convidar", defaultValue: "A ADQPAL tem a honra de convidar", full: true },
      { name: "temas", label: "Temas", placeholder: "Violencia Domestica e Sustentabilidade", full: true },
      { name: "texto", label: "Texto do convite", placeholder: "Texto do convite", type: "textarea", required: true, full: true, rows: 10 },
      { name: "dia", label: "Dia", placeholder: "20 de marco de 2026" },
      { name: "horario", label: "Horario", placeholder: "9 horas" },
      { name: "local", label: "Local", placeholder: "Local do evento", full: true },
      { name: "cidade", label: "Cidade", placeholder: "Sao Miguel dos Campos/AL", full: true },
    ],
  },
  {
    id: "notas-explicativas",
    title: "Notas Explicativas",
    description: "Notas explicativas das demonstracoes contabeis, texto integral editavel.",
    group: "Financeiro e Contabil",
    Template: GenericEditableTextPrint,
    fields: genericEditableFields("Notas Explicativas", "ADQPAL - Demonstracoes Contabeis", "Edite aqui as notas explicativas das demonstracoes contabeis."),
  },
  {
    id: "requerimento-cartorio",
    title: "Requerimento para Cartorio",
    description: "Requerimento editavel para cartorio, averbações e registros.",
    group: "Documentos Administrativos",
    Template: GenericEditableTextPrint,
    fields: genericEditableFields("Requerimento para Cartorio", "ADQPAL - Cartorio", "Edite aqui o texto integral do requerimento para cartorio."),
  },
  {
    id: "declaracao-comparecimento",
    title: "Declaracao de Comparecimento",
    description: "Declaracao editavel de comparecimento a procedimento ou atendimento.",
    group: "Documentos Administrativos",
    Template: GenericEditableTextPrint,
    fields: genericEditableFields("Declaracao de Comparecimento", "ADQPAL - Declaracao", "Declaro, para os devidos fins, que o(a) Sr(a). NOME, compareceu nesta Instituicao para realizacao de PROCEDIMENTO no dia DATA."),
  },
  {
    id: "plano-acao",
    title: "Plano de Acao",
    description: "Plano com texto integral e tabelas de metas/cronograma editaveis.",
    group: "Documentos Administrativos",
    Template: PlanoAcaoPrint,
    fields: [
      { name: "titulo", label: "Titulo", placeholder: "Plano de Acao Anual", defaultValue: "Plano de Acao Anual", required: true, full: true },
      { name: "texto", label: "Texto base do plano", placeholder: "Texto integral do plano", defaultValue: "Edite aqui o texto integral do plano de acao.", type: "textarea", required: true, full: true, rows: 14 },
      { name: "metas", label: "Tabela de metas (colunas separadas por |)", placeholder: "Meta | Indicador | Prazo", defaultValue: "Meta | Indicador | Prazo\nAmpliar atendimentos | Numero de beneficiarios | 12 meses", type: "textarea", full: true, rows: 8 },
      { name: "cronograma", label: "Cronograma (colunas separadas por |)", placeholder: "Atividade | Mes | Responsavel", defaultValue: "Atividade | Mes | Responsavel\nPlanejamento | Janeiro | Diretoria", type: "textarea", full: true, rows: 8 },
      { name: "data", label: "Data", placeholder: "Sao Miguel dos Campos/AL, 20 de Junho de 2026", full: true },
    ],
  },
  {
    id: "projeto-unidade-movel-bucal",
    title: "Projeto Unidade Movel Bucal",
    description: "Projeto editavel de aquisicao/implantacao de unidade movel bucal.",
    group: "Projetos e Aquisicoes",
    Template: GenericEditableTextPrint,
    fields: genericEditableFields("Projeto Unidade Movel Bucal", "ADQPAL - Projeto de Saude Bucal", "Edite aqui o texto integral do projeto de unidade movel bucal."),
  },
  {
    id: "edital-eleicao-2027",
    title: "Edital para Eleicao 2027",
    description: "Edital editavel para eleicao de diretoria e conselho fiscal.",
    group: "Assembleia e Estatuto",
    Template: GenericEditableTextPrint,
    fields: genericEditableFields("Edital para Eleicao 2027", "ADQPAL - Assembleia e Eleicao", "Edite aqui o texto integral do edital para eleicao 2027."),
  },
  {
    id: "projeto-veiculo-utilitario",
    title: "Projeto Veiculo Utilitario",
    description: "Projeto editavel de aquisicao de veiculo utilitario.",
    group: "Projetos e Aquisicoes",
    Template: GenericEditableTextPrint,
    fields: genericEditableFields("Projeto Veiculo Utilitario", "ADQPAL - Projeto de Aquisicao de Veiculo", "Edite aqui o texto integral do projeto de veiculo utilitario."),
  },
  {
    id: "projeto-equipamento-hospitalar",
    title: "Projeto Equipamento Hospitalar",
    description: "Projeto editavel de aquisicao de equipamento hospitalar.",
    group: "Projetos e Aquisicoes",
    Template: GenericEditableTextPrint,
    fields: genericEditableFields("Projeto Equipamento Hospitalar", "ADQPAL - Equipamentos Hospitalares", "Edite aqui o texto integral do projeto de equipamento hospitalar."),
  },
  {
    id: "contrato-labclin-2025",
    title: "Contrato LABCLIN 2025",
    description: "Contrato editavel de parceria com laboratorio de analises clinicas.",
    group: "Convenios e Parcerias",
    Template: GenericEditableTextPrint,
    fields: genericEditableFields("Contrato LABCLIN 2025", "ADQPAL - Contrato de Exames Laboratoriais", "Edite aqui o texto integral do contrato LABCLIN 2025."),
  },
  {
    id: "ata-reforma-estatutaria",
    title: "Ata da Reforma Estatutaria",
    description: "Ata editavel de assembleia para reforma/alteracao estatutaria.",
    group: "Assembleia e Estatuto",
    Template: GenericEditableTextPrint,
    fields: genericEditableFields("Ata da Reforma Estatutaria", "ADQPAL - Assembleia Geral Extraordinaria", "Edite aqui o texto integral da ata da reforma estatutaria."),
  },
  {
    id: "edital-alteracao-estatutaria",
    title: "Edital de Alteracao Estatutaria",
    description: "Edital editavel de convocacao para alteracao estatutaria.",
    group: "Assembleia e Estatuto",
    Template: GenericEditableTextPrint,
    fields: genericEditableFields("Edital de Alteracao Estatutaria", "ADQPAL - Alteracao do Estatuto Social", "Edite aqui o texto integral do edital de alteracao estatutaria."),
  },
  {
    id: "projeto-cultural",
    title: "Projeto Cultural",
    description: "Projeto cultural editavel para cursos, arte e inclusao social.",
    group: "Projetos e Aquisicoes",
    Template: GenericEditableTextPrint,
    fields: genericEditableFields("Projeto Cultural", "ADQPAL - Cultura, Arte e Inclusao Social", "Edite aqui o texto integral do projeto cultural."),
  },
  {
    id: "projeto-esporte-acao",
    title: "Projeto Esporte e Acao",
    description: "Projeto esportivo editavel para encaminhamento a orgaos publicos.",
    group: "Projetos e Aquisicoes",
    Template: GenericEditableTextPrint,
    fields: genericEditableFields("Projeto Esporte e Acao", "ADQPAL - Ministerio do Esporte", "Edite aqui o texto integral do projeto esporte e acao."),
  },
  {
    id: "projeto-cida-ministerio-esporte",
    title: "Projeto CIDA - Ministerio do Esporte",
    description: "Projeto CIDA editavel com foco em inclusao e acessibilidade.",
    group: "Projetos e Aquisicoes",
    Template: GenericEditableTextPrint,
    fields: genericEditableFields("Projeto CIDA - Ministerio do Esporte", "ADQPAL - Inclusao e Acessibilidade", "Edite aqui o texto integral do Projeto CIDA para o Ministerio do Esporte."),
  },
  {
    id: "projeto-ministerio-educacao",
    title: "Projeto - Ministerio da Educacao",
    description: "Projeto editavel para encaminhamento ao Ministerio da Educacao.",
    group: "Projetos e Aquisicoes",
    Template: GenericEditableTextPrint,
    fields: genericEditableFields("Projeto - Ministerio da Educacao", "ADQPAL - Ministerio da Educacao", "Edite aqui o texto integral do projeto para o Ministerio da Educacao."),
  },
  {
    id: "oficio-poder-legislativo",
    title: "Oficio ao Poder Legislativo",
    description: "Oficio editavel ao Poder Legislativo/Camara Municipal.",
    group: "Documentos Administrativos",
    Template: GenericEditableTextPrint,
    fields: genericEditableFields("Oficio ao Poder Legislativo", "ADQPAL - Camara Municipal", "Edite aqui o texto integral do oficio ao Poder Legislativo."),
  },
  {
    id: "conselho-municipal-saude",
    title: "Conselho Municipal de Saude",
    description: "Documento editavel para inscricao/representacao no Conselho Municipal de Saude.",
    group: "Saude e Relatorios",
    Template: GenericEditableTextPrint,
    fields: genericEditableFields("Conselho Municipal de Saude", "ADQPAL - Controle Social e Saude", "Edite aqui o texto integral do documento para Conselho Municipal de Saude."),
  },
  {
    id: "isencao-iptu-2027",
    title: "Isencao de IPTU 2027",
    description: "Requerimento editavel de isencao de IPTU.",
    group: "Documentos Administrativos",
    Template: GenericEditableTextPrint,
    fields: genericEditableFields("Requerimento de Isencao do IPTU 2027", "ADQPAL - Prefeitura Municipal", "Edite aqui o texto integral do requerimento de isencao de IPTU 2027."),
  },
  {
    id: "projeto-cultural-2",
    title: "Projeto Cultural 2",
    description: "Segundo modelo editavel de projeto cultural.",
    group: "Projetos e Aquisicoes",
    Template: GenericEditableTextPrint,
    fields: genericEditableFields("Projeto Cultural 2", "ADQPAL - Formacao Profissional, Arte e Reintegracao Social", "Edite aqui o texto integral do Projeto Cultural 2."),
  },
  {
    id: "projeto-ministerio-esporte",
    title: "Projeto - Ministerio do Esporte",
    description: "Projeto editavel para encaminhamento ao Ministerio do Esporte.",
    group: "Projetos e Aquisicoes",
    Template: GenericEditableTextPrint,
    fields: genericEditableFields("Projeto - Ministerio do Esporte", "ADQPAL - Ministerio do Esporte", "Edite aqui o texto integral do projeto para o Ministerio do Esporte."),
  },
];
