// =============================================================================
// SEED — ADQPAL Backend
// Popula: Roles, Especialidades, Usuários, Pacientes, Consultas e Prontuários
//
// Execução: npm run seed
// Idempotente: pode rodar múltiplas vezes sem duplicar dados.
// Senha padrão de todos os usuários: Teste@123
// =============================================================================

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── Roles ────────────────────────────────────────────────────────────────────

const ROLES = [
  { id: 1, name: "ADMIN" },
  { id: 2, name: "RECEPTIONIST" },
  { id: 3, name: "DOCTOR" },
  { id: 4, name: "IT_SUPPORT" },
];

// ─── Especialidades ───────────────────────────────────────────────────────────

const ESPECIALIDADES = [
  "Clínica Geral",
  "Cardiologia",
  "Neurologia",
  "Endocrinologia",
  "Pneumologia",
  "Reumatologia",
];

// ─── Usuários (médicos) ───────────────────────────────────────────────────────

const USUARIOS = [
  {
    username: "drmarcos",
    email: "drmarcos@adqpal.com",
    cpf: "111.111.111-01",
    roleId: 3,
  },
  {
    username: "drafernanda",
    email: "drafernanda@adqpal.com",
    cpf: "111.111.111-02",
    roleId: 3,
  },
  {
    username: "admin",
    email: "admin@adqpal.com",
    cpf: "111.111.111-03",
    roleId: 1,
  },
];

// ─── Pacientes fictícios ───────────────────────────────────────────────────────

const PACIENTES = [
  {
    name: "Beatriz Nunes",
    email: "beatriz.nunes@email.com",
    phone: "(11) 91234-5678",
    cpf: "555.555.555-01",
    dateOfBirth: new Date("1992-05-20"),
    gender: "feminino",
    street: "Rua Harmonia",
    streetNumber: "456",
    city: "São Paulo",
    state: "SP",
    zipCode: "05435-000",
    agreement: "Unimed",
    additionalInfo: "Alergia a frutos do mar. Epipen prescrito.",
  },
  {
    name: "Thiago Martins",
    email: "thiago.martins@email.com",
    phone: "(21) 92345-6789",
    cpf: "555.555.555-02",
    dateOfBirth: new Date("1988-09-03"),
    gender: "masculino",
    street: "Rua Visconde de Pirajá",
    streetNumber: "123",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22410-000",
    agreement: "Amil",
    additionalInfo: "Asma grave. Uso diário de bombinha.",
  },
  {
    name: "Camila Rocha",
    email: "camila.rocha@email.com",
    phone: "(31) 93456-7890",
    cpf: "555.555.555-03",
    dateOfBirth: new Date("2001-12-15"),
    gender: "feminino",
    street: "Rua Pium-í",
    streetNumber: "789",
    city: "Belo Horizonte",
    state: "MG",
    zipCode: "30310-050",
    agreement: "Bradesco Saúde",
    additionalInfo: "TDAH. Acompanhamento neuropediátrico.",
  },
  {
    name: "Lucas Pereira",
    email: "lucas.pereira@email.com",
    phone: "(51) 94567-8901",
    cpf: "555.555.555-04",
    dateOfBirth: new Date("1995-07-08"),
    gender: "masculino",
    street: "Rua Padre Chagas",
    streetNumber: "321",
    city: "Porto Alegre",
    state: "RS",
    zipCode: "90570-080",
    agreement: "Particular",
    additionalInfo: "Doador de sangue regular.",
  },
  {
    name: "Aline Castro",
    email: "aline.castro@email.com",
    phone: "(85) 95678-9012",
    cpf: "555.555.555-05",
    dateOfBirth: new Date("1983-03-25"),
    gender: "feminino",
    street: "Rua Barão do Rio Branco",
    streetNumber: "567",
    city: "Fortaleza",
    state: "CE",
    zipCode: "60010-020",
    agreement: "Hapvida",
    additionalInfo: "Hipotireoidismo. Uso de levotiroxina.",
  },
  {
    name: "Rafael Silveira",
    email: "rafael.silveira@email.com",
    phone: "(41) 96789-0123",
    cpf: "555.555.555-06",
    dateOfBirth: new Date("1977-11-12"),
    gender: "masculino",
    street: "Rua Itupava",
    streetNumber: "890",
    city: "Curitiba",
    state: "PR",
    zipCode: "80030-100",
    agreement: "SulAmérica",
    additionalInfo: "Ex-fumante. Check-up anual.",
  },
  {
    name: "Juliana Freitas",
    email: "juliana.freitas@email.com",
    phone: "(71) 97890-1234",
    cpf: "555.555.555-07",
    dateOfBirth: new Date("1998-02-28"),
    gender: "feminino",
    street: "Rua da Graça",
    streetNumber: "432",
    city: "Salvador",
    state: "BA",
    zipCode: "40150-060",
    agreement: "NotreDame Intermédica",
    additionalInfo: "Migrânea menstrual. Uso de anticoncepcional.",
  },
  {
    name: "Bruno Cardoso",
    email: "bruno.cardoso@email.com",
    phone: "(61) 98901-2345",
    cpf: "555.555.555-08",
    dateOfBirth: new Date("1991-06-18"),
    gender: "masculino",
    street: "SQS 308",
    streetNumber: "Bloco K",
    city: "Brasília",
    state: "DF",
    zipCode: "70355-080",
    agreement: "Unimed",
    additionalInfo: "Rinite alérgica. Dessensibilização em andamento.",
  },
  {
    name: "Vanessa Mendonça",
    email: "vanessa.mendonca@email.com",
    phone: "(11) 99012-3456",
    cpf: "555.555.555-09",
    dateOfBirth: new Date("2002-10-05"),
    gender: "feminino",
    street: "Rua Treze de Maio",
    streetNumber: "789",
    city: "São Paulo",
    state: "SP",
    zipCode: "01323-000",
    agreement: "Amil",
    additionalInfo: "Anemia ferropriva. Suplementação de ferro.",
  },
  {
    name: "Felipe Aragão",
    email: "felipe.aragao@email.com",
    phone: "(21) 90123-4567",
    cpf: "555.555.555-10",
    dateOfBirth: new Date("1980-04-22"),
    gender: "masculino",
    street: "Rua São Clemente",
    streetNumber: "654",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22260-000",
    agreement: "Bradesco Saúde",
    additionalInfo: "Diabetes tipo 2. Metformina 850mg.",
  },
  {
    name: "Letícia Barros",
    email: "leticia.barros@email.com",
    phone: "(31) 91234-5678",
    cpf: "555.555.555-11",
    dateOfBirth: new Date("1996-08-14"),
    gender: "feminino",
    street: "Av. do Contorno",
    streetNumber: "987",
    city: "Belo Horizonte",
    state: "MG",
    zipCode: "30110-060",
    agreement: "Particular",
    additionalInfo: "Síndrome do ovário policístico.",
  },
  {
    name: "Rodrigo Neves",
    email: "rodrigo.neves@email.com",
    phone: "(51) 92345-6789",
    cpf: "555.555.555-12",
    dateOfBirth: new Date("1987-01-30"),
    gender: "masculino",
    street: "Av. Goethe",
    streetNumber: "123",
    city: "Porto Alegre",
    state: "RS",
    zipCode: "90430-001",
    agreement: "SulAmérica",
    additionalInfo: "Hérnia de disco. Fisioterapia 2x/semana.",
  },
  {
    name: "Tainá Xavier",
    email: "taina.xavier@email.com",
    phone: "(85) 93456-7890",
    cpf: "555.555.555-13",
    dateOfBirth: new Date("2004-03-09"),
    gender: "feminino",
    street: "Av. Santos Dumont",
    streetNumber: "111",
    city: "Fortaleza",
    state: "CE",
    zipCode: "60150-160",
    agreement: "Hapvida",
    additionalInfo: "Responsável: Sra. Márcia Xavier.",
  },
  {
    name: "Leonardo Campos",
    email: "leonardo.campos@email.com",
    phone: "(41) 94567-8901",
    cpf: "555.555.555-14",
    dateOfBirth: new Date("1973-12-20"),
    gender: "masculino",
    street: "Rua Buenos Aires",
    streetNumber: "456",
    city: "Curitiba",
    state: "PR",
    zipCode: "80250-070",
    agreement: "Unimed",
    additionalInfo: "Cirurgia de revascularização em 2020.",
  },
  {
    name: "Sabrina Lopes",
    email: "sabrina.lopes@email.com",
    phone: "(71) 95678-9012",
    cpf: "555.555.555-15",
    dateOfBirth: new Date("1994-05-17"),
    gender: "feminino",
    street: "Av. Oceânica",
    streetNumber: "200",
    city: "Salvador",
    state: "BA",
    zipCode: "40170-010",
    agreement: "NotreDame Intermédica",
    additionalInfo: "Lúpus eritematoso sistêmico.",
  },
  {
    name: "André Moraes",
    email: "andre.moraes@email.com",
    phone: "(61) 96789-0123",
    cpf: "555.555.555-16",
    dateOfBirth: new Date("1984-09-27"),
    gender: "masculino",
    street: "SGAN 910",
    streetNumber: "Bloco E",
    city: "Brasília",
    state: "DF",
    zipCode: "70790-100",
    agreement: "Amil",
    additionalInfo: "Prática de triatlo. Condicionamento físico excelente.",
  },
  {
    name: "Priscila Andrade",
    email: "priscila.andrade@email.com",
    phone: "(11) 97890-1234",
    cpf: "555.555.555-17",
    dateOfBirth: new Date("1999-11-11"),
    gender: "feminino",
    street: "Rua dos Pinheiros",
    streetNumber: "345",
    city: "São Paulo",
    state: "SP",
    zipCode: "05422-000",
    agreement: "Bradesco Saúde",
    additionalInfo: "Enxaqueca com aura. Sumatriptano SOS.",
  },
  {
    name: "Marcelo Duarte",
    email: "marcelo.duarte@email.com",
    phone: "(21) 98901-2345",
    cpf: "555.555.555-18",
    dateOfBirth: new Date("1970-07-02"),
    gender: "masculino",
    street: "Rua Almirante Alexandrino",
    streetNumber: "567",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "20241-260",
    agreement: "Particular",
    additionalInfo: "DPOC. Uso de oxigênio domiciliar.",
  },
  {
    name: "Nathalia Sales",
    email: "nathalia.sales@email.com",
    phone: "(31) 99012-3456",
    cpf: "555.555.555-19",
    dateOfBirth: new Date("2005-01-23"),
    gender: "feminino",
    street: "Rua Diamantina",
    streetNumber: "789",
    city: "Belo Horizonte",
    state: "MG",
    zipCode: "30220-110",
    agreement: "Unimed",
    additionalInfo: "Menor. Acompanhamento pediátrico.",
  },
  {
    name: "Gustavo Henrique",
    email: "gustavo.h@email.com",
    phone: "(51) 90123-4567",
    cpf: "555.555.555-20",
    dateOfBirth: new Date("1997-04-03"),
    gender: "masculino",
    street: "Rua 24 de Outubro",
    streetNumber: "890",
    city: "Porto Alegre",
    state: "RS",
    zipCode: "90510-000",
    agreement: "SulAmérica",
    additionalInfo: "Tabagista. Em programa de cessação.",
  },
];

// ─── Prontuários fictícios ─────────────────────────────────────────────────────
// Indexado pelo CPF do paciente. Cada entrada define diagnosis, prescription e notes.

const PRONTUARIOS: Record<
  string,
  { diagnosis: string; prescription: string; notes: string }
> = {
  "555.555.555-01": {
    diagnosis:
      "Reação alérgica leve após contato acidental com camarão. Urticária generalizada sem angioedema. Sem comprometimento respiratório no momento da consulta.",
    prescription:
      "Loratadina 10mg — 1 comprimido/dia por 7 dias.\nHidrocortisona creme 1% — aplicar nas áreas afetadas 2x/dia por 5 dias.\nManter Epipen disponível. Orientado sobre leitura de rótulos alimentares.",
    notes:
      "Paciente relata ingestão inadvertida em restaurante. Evolução favorável com anti-histamínico. Retorno em 15 dias ou em caso de piora. Encaminhada para alergologia para avaliação de imunoterapia.",
  },
  "555.555.555-02": {
    diagnosis:
      "Crise asmática moderada. Broncoespasmo com sibilância bilateral. SpO₂ 94% na admissão. Sem cianose.",
    prescription:
      "Salbutamol spray 100mcg — 2 jatos a cada 4h por 5 dias, após reduzir conforme sintomas.\nPrednisolona 20mg — 1 comprimido/dia por 5 dias.\nManter budesonida/formoterol inalatória contínua conforme protocolo anterior.\nReavaliar SpO₂ em 48h.",
    notes:
      "Desencadeante provável: exposição a poeira doméstica. SpO₂ 98% na alta após nebulização. Orientado sobre técnica correta de inalação e limpeza do ambiente. Plano de ação escrito entregue.",
  },
  "555.555.555-03": {
    diagnosis:
      "TDAH — tipo combinado. Reavaliação trimestral. Bom controle dos sintomas com medicação atual. Relato de melhora no desempenho escolar.",
    prescription:
      "Metilfenidato LA 20mg — 1 cápsula pela manhã (dias letivos).\nManter acompanhamento psicopedagógico semanal.\nRetorno em 3 meses com relatório escolar.",
    notes:
      "Paciente acompanhada pela mãe. Sem efeitos adversos significativos. Apetite preservado. Sono adequado. Professora relatou melhora na concentração. Solicitado hemograma e perfil lipídico de rotina.",
  },
  "555.555.555-04": {
    diagnosis:
      "Check-up anual. Exame físico sem alterações. PA 118/76 mmHg. FC 62 bpm. IMC 23,4. Boa saúde geral.",
    prescription:
      "Nenhuma medicação necessária.\nOrientado sobre ingestão hídrica adequada pré e pós-doação de sangue.\nManter atividade física regular (min. 150 min/semana).",
    notes:
      "Paciente doador de sangue regular, última doação há 4 meses. Hemograma dentro dos valores de referência. Colesterol e glicemia normais. Próximo check-up em 12 meses.",
  },
  "555.555.555-05": {
    diagnosis:
      "Hipotireoidismo primário em controle. TSH 3,2 mUI/L (referência 0,4–4,0). T4 livre 1,1 ng/dL. Dosagem atual adequada.",
    prescription:
      "Levotiroxina 75mcg — 1 comprimido em jejum 30min antes do café da manhã.\nRetorno em 6 meses com novo TSH e T4 livre.",
    notes:
      "Paciente refere estar bem, sem sintomas de hipo ou hipertireoidismo. Peso estável. Orientada sobre interação medicamentosa com cálcio e ferro. Exames de controle solicitados.",
  },
  "555.555.555-06": {
    diagnosis:
      "Check-up anual. Ex-fumante há 8 anos. Espirometria normal. Radiografia de tórax sem alterações. PA 124/80 mmHg.",
    prescription:
      "Suplementação de vitamina D 2000 UI/dia — manutenção.\nOrientado sobre manutenção de abstinência tabágica.\nAAS 100mg/dia como prevenção primária (risco cardiovascular moderado).",
    notes:
      "Exames laboratoriais: glicemia 98 mg/dL, colesterol total 198 mg/dL, LDL 118 mg/dL, HDL 52 mg/dL. Risco cardiovascular calculado em 8% em 10 anos pelo escore de Framingham. Retorno em 12 meses.",
  },
  "555.555.555-07": {
    diagnosis:
      "Migrânea sem aura, episódica de alta frequência (≥8 dias/mês). Associação com ciclo hormonal confirmada. Ausência de sinais de alarme.",
    prescription:
      "Sumatriptano 50mg — 1 comprimido ao início da crise (máx. 2 comprimidos/dia).\nTopiramate 25mg — 1 comprimido à noite por 4 semanas, após avaliar aumento para 50mg.\nManter anticoncepcional oral conforme ginecologista.\nDiário de cefaleia para monitoramento.",
    notes:
      "Paciente relata piora nos 3 dias anteriores à menstruação. Fotofobia e náusea presentes. Sem vômitos. Orientada sobre gatilhos (privação de sono, jejum prolongado). Retorno em 60 dias com diário preenchido.",
  },
  "555.555.555-08": {
    diagnosis:
      "Rinite alérgica persistente moderada-grave. Em protocolo de imunoterapia subcutânea — dose de manutenção fase 3. Controle parcial dos sintomas.",
    prescription:
      "Continuar imunoterapia conforme esquema do alergologista.\nMometasona spray nasal 50mcg — 2 jatos em cada narina 1x/dia.\nLoratadina 10mg — 1 comprimido/dia nos períodos de maior exposição.\nSolução salina nasal isotônica — lavagem 2x/dia.",
    notes:
      "Paciente relata melhora de 60% em relação ao início da imunoterapia. Sem reações adversas às últimas aplicações. Evitar tapetes e bichos de pelúcia no quarto. Capa anti-ácaro no travesseiro. Retorno em 4 semanas.",
  },
  "555.555.555-09": {
    diagnosis:
      "Anemia ferropriva leve (Hb 10,8 g/dL, ferritina 8 ng/mL). Sem causa aparente de sangramento. Investigação de perda menstrual aumentada em andamento.",
    prescription:
      "Sulfato ferroso 40mg de ferro elementar — 1 comprimido 2x/dia (em jejum ou com vitamina C).\nVitamina C 500mg — junto com o ferro para melhorar absorção.\nRetorno em 60 dias com hemograma e ferritina de controle.",
    notes:
      "Paciente relata cansaço e queda de cabelo. Dieta pobre em ferro verificada. Orientada sobre alimentos ricos em ferro heme e não-heme. Encaminhada à ginecologia para avaliação de fluxo menstrual. Evitar chá e café junto com suplemento.",
  },
  "555.555.555-10": {
    diagnosis:
      "Diabetes mellitus tipo 2 — controle inadequado. HbA1c 8,4% (meta <7%). Glicemia de jejum 184 mg/dL. Sem complicações macrovasculares detectadas.",
    prescription:
      "Metformina 850mg — 1 comprimido 2x/dia (almoço e jantar).\nEmpagliflozina 10mg — 1 comprimido pela manhã (adicionado ao esquema).\nMonitorização glicêmica em casa 2x/dia — registrar no diário.\nRetorno em 3 meses com HbA1c.",
    notes:
      "Paciente refere dificuldade com dieta. IMC 29,8 (pré-obesidade). Encaminhado para nutricionista. PA 138/88 mmHg — solicitar monitorização ambulatorial. Exame de fundo de olho e microalbuminúria solicitados. Orientado sobre atividade física e hipoglicemia.",
  },
  "555.555.555-11": {
    diagnosis:
      "Síndrome dos ovários policísticos (SOP). Irregularidade menstrual (ciclos 45–90 dias). Hiperandrogenismo clínico (acne e hirsutismo leves). USG com ovários em colar de pérolas.",
    prescription:
      "Anticoncepional oral combinado (etinilestradiol 0,03mg + drospirenona 3mg) — 1 comprimido/dia por 21 dias, pausa 7 dias.\nMetformina 500mg — 1 comprimido/dia com jantar (aumentar para 2x/dia em 4 semanas).\nRetorno em 3 meses.",
    notes:
      "Paciente com IMC 26,1. Perfil hormonal: testosterona livre elevada, LH/FSH > 2. Glicemia e insulina de jejum solicitadas para avaliar resistência insulínica. Orientada sobre perda de peso de 5–10% para melhora do quadro. Encaminhada para nutricionista.",
  },
  "555.555.555-12": {
    diagnosis:
      "Lombociatalgia por hérnia de disco L4-L5 com compressão radicular leve à direita. Sem déficit motor. Lasègue positivo a 60° à direita.",
    prescription:
      "Ibuprofeno 600mg — 1 comprimido 3x/dia por 7 dias (com alimento).\nCiclobenzaprina 5mg — 1 comprimido à noite por 5 dias.\nManter fisioterapia 2x/semana — exercícios de estabilização lombar.\nEvitar levantamento de peso e posições que aumentem a dor.",
    notes:
      "Paciente refere melhora de 40% com fisioterapia. Dor irradiada para face posterior da coxa direita. Força muscular preservada. Solicitar nova RM lombossacra em 3 meses. Orientado sobre ergonomia no trabalho (trabalha sentado 8h/dia). Retorno em 30 dias.",
  },
  "555.555.555-13": {
    diagnosis:
      "Adolescente saudável. Consulta de rotina pediátrica. Desenvolvimento puberal Tanner III/IV. Vacinação em dia.",
    prescription:
      "Suplementação de vitamina D 1000 UI/dia (nível sérico limítrofe: 28 ng/mL).\nOrientações nutricionais para adolescentes.\nVacina HPV 2ª dose agendada.",
    notes:
      "Paciente acompanhada pela mãe Sra. Márcia Xavier. Peso 52 kg, altura 163 cm, IMC 19,6. Pressão arterial normal. Menarca há 8 meses, ciclos regulares. Orientada sobre saúde reprodutiva. Retorno anual ou conforme necessidade.",
  },
  "555.555.555-14": {
    diagnosis:
      "Pós-operatório tardio de cirurgia de revascularização do miocárdio (2020). Avaliação cardiológica de rotina. ECG com bloqueio de ramo direito (preexistente). Sem angina ou dispneia.",
    prescription:
      "Continuar AAS 100mg/dia.\nAtovastatina 40mg — 1 comprimido à noite.\nMetoprolol succinato 25mg — 1 comprimido pela manhã.\nRamipril 5mg — 1 comprimido à noite.\nRetorno em 6 meses com ecocardiograma e perfil lipídico.",
    notes:
      "PA 126/78 mmHg. FC 64 bpm. LDL 62 mg/dL (meta atingida <70 mg/dL). Fração de ejeção 58% no último ecocardiograma. Paciente ativo, caminha 30 min/dia. Orientado sobre sinais de alerta para nova síndrome coronariana. Retorno em 6 meses.",
  },
  "555.555.555-15": {
    diagnosis:
      "Lúpus eritematoso sistêmico — fase de atividade leve (SLEDAI 4). Artralgia em mãos e joelhos. Sem comprometimento renal ou neurológico atual.",
    prescription:
      "Hidroxicloroquina 400mg/dia — manter dose.\nPrednisona 10mg/dia — reduzir 2,5mg a cada 2 semanas conforme controle clínico.\nProtetor solar FPS 60+ — uso diário obrigatório.\nSuplemento de cálcio 600mg + vitamina D 800 UI — para proteção óssea.",
    notes:
      "C3 e C4 consumidos. Anti-dsDNA 1:160. Hemograma com leucopenia leve (3800 leucócitos). Urina rotina normal. Orientada sobre evitar exposição solar. Encaminhada para reumatologia para ajuste do esquema. Retorno em 30 dias ou em caso de febre/piora articular.",
  },
  "555.555.555-16": {
    diagnosis:
      "Atleta de alta performance (triatleta). Consulta de medicina esportiva. Sem queixas. ECG dentro dos limites para atleta (bradicardia sinusal 48 bpm, normal para o perfil).",
    prescription:
      "Suplementação proteica (1,6 g/kg/dia) conforme orientação nutricional.\nHidratação isotônica durante treinos >60 min.\nReavaliação cardiológica com ergométrico em 12 meses.",
    notes:
      "IMC 22,8. VO₂ máx estimado 58 mL/kg/min. Hemograma, ferritina, vitamina D e perfil hormonal normais. Sem lesões musculoesqueléticas ativas. Orientado sobre periodização do treino e janela anabólica. Retorno em 12 meses para avaliação de aptidão.",
  },
  "555.555.555-17": {
    diagnosis:
      "Enxaqueca com aura visual, episódica de baixa frequência (3–4 crises/mês). Ausência de fatores de risco cardiovascular. Aura típica com escotoma cintilante.",
    prescription:
      "Sumatriptano 50mg — 1 comprimido ao início da crise (máx. 200mg/dia).\nPropranol 40mg — 1 comprimido 2x/dia como profilaxia.\nAcetaminofeno 750mg + metoclopramida 10mg — para crises leves.\nDiário de cefaleia mensal.",
    notes:
      "Paciente relata que as crises duram 12–24h sem medicação. Fotofobia e fonofobia presentes. Aura visual precede a crise em 20 min. Propranolol iniciado hoje — orientada sobre hipotensão postural inicial. Evitar gatilhos: vinho tinto, jejum e privação de sono. Retorno em 45 dias.",
  },
  "555.555.555-18": {
    diagnosis:
      "DPOC GOLD III (grave). FEV₁ 42% do previsto. Exacerbação recente com necessidade de antibiótico. Dependente de oxigênio domiciliar (1,5 L/min em repouso).",
    prescription:
      "Tiotrópio 18mcg — 1 inalação/dia (LAMA).\nFormoterol 12mcg — 2 inalações 2x/dia (LABA).\nBudesonida/formoterol 320/9mcg — 2 inalações 2x/dia nos dias de piora.\nOxigênio domiciliar 1,5–2 L/min por ≥15h/dia.\nVacina influenza e pneumocócica atualizadas.",
    notes:
      "PA 132/84 mmHg. SpO₂ 90% em ar ambiente. Paciente com limitação funcional importante, desce apenas 1 lance de escada. Encaminhado para reabilitação pulmonar. Suporte nutricional necessário (desnutrição leve). Familiar orientado sobre reconhecimento de exacerbações. Retorno em 30 dias.",
  },
  "555.555.555-19": {
    diagnosis:
      "Criança saudável, 19 anos. Acompanhamento pediátrico de transição para clínico geral. Vacinação completa para a idade. Desenvolvimento normal.",
    prescription:
      "Vitamina D 1000 UI/dia — 3 meses (níveis limítrofes).\nOrientações sobre alimentação saudável e atividade física.\nEncaminhamento para clínico geral para dar continuidade ao acompanhamento.",
    notes:
      "Paciente e responsável orientados sobre transição para serviço de adultos. Peso 58 kg, altura 165 cm, IMC 21,3. PA 110/70 mmHg. Sem queixas. Hemograma e bioquímica normais. Última consulta pediátrica — retorno ao clínico geral.",
  },
  "555.555.555-20": {
    diagnosis:
      "Tabagismo — 15 maços-ano. Em programa de cessação do tabagismo há 3 meses. Abstinência parcial (1–2 cigarros/dia). Sintomas de abstinência controlados.",
    prescription:
      "Vareniclina 1mg — 1 comprimido 2x/dia (manhã e noite com alimento) — manter por mais 12 semanas.\nReposição nicotínica (adesivo 14mg/24h) — usar nos dias de maior fissura.\nApoio psicológico — grupo de cessação 1x/semana.",
    notes:
      "Paciente motivado, reduziu de 20 para 1–2 cigarros/dia. Spirometria: leve obstrução (FEV₁/FVC 0,74 — GOLD 0). Orientado sobre benefícios da cessação total. Função pulmonar pode melhorar com abstinência completa. Retorno em 4 semanas para avaliação da fissura e adesão.",
  },
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Iniciando seed...\n");

  // 1. Roles
  console.log("🔑 Criando roles...");
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: {},
      create: role,
    });
    console.log(`   ✓ ${role.name}`);
  }

  // 2. Especialidades
  console.log("\n🏥 Criando especialidades...");
  const specialtyMap: Record<string, string> = {};
  for (const name of ESPECIALIDADES) {
    const specialty = await prisma.specialty.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    specialtyMap[name] = specialty.id;
    console.log(`   ✓ ${name}`);
  }

  // 3. Usuários
  console.log("\n👤 Criando usuários...");
  const passwordHash = await bcrypt.hash("Teste@123", 12);
  const userMap: Record<string, string> = {}; // email → id

  for (const u of USUARIOS) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        username: u.username,
        email: u.email,
        cpf: u.cpf,
        passwordHash,
        roleId: u.roleId,
      },
    });
    userMap[u.email] = user.id;
    console.log(`   ✓ ${u.username} (${u.email})`);
  }

  // Associar especialidades aos médicos
//   const doctorEmails = ["drmarcos@adqpal.com", "drafernanda@adqpal.com"];
  const especialidadesDrMarcos = ["Clínica Geral", "Cardiologia"];
  const especialidadesDraFernanda = ["Neurologia", "Endocrinologia", "Pneumologia", "Reumatologia"];

  for (const esp of especialidadesDrMarcos) {
    await prisma.doctorSpecialty.upsert({
      where: {
        doctorId_specialtyId: {
          doctorId: userMap["drmarcos@adqpal.com"],
          specialtyId: specialtyMap[esp],
        },
      },
      update: {},
      create: {
        doctorId: userMap["drmarcos@adqpal.com"],
        specialtyId: specialtyMap[esp],
      },
    });
  }
  for (const esp of especialidadesDraFernanda) {
    await prisma.doctorSpecialty.upsert({
      where: {
        doctorId_specialtyId: {
          doctorId: userMap["drafernanda@adqpal.com"],
          specialtyId: specialtyMap[esp],
        },
      },
      update: {},
      create: {
        doctorId: userMap["drafernanda@adqpal.com"],
        specialtyId: specialtyMap[esp],
      },
    });
  }
  console.log("   ✓ Especialidades vinculadas aos médicos");

  // 4. Pacientes
  console.log("\n🧑‍⚕️ Criando pacientes...");
  const patientMap: Record<string, string> = {}; // cpf → id

  for (const p of PACIENTES) {
    const patient = await prisma.patient.upsert({
      where: { cpf: p.cpf },
      update: {},
      create: p,
    });
    patientMap[p.cpf] = patient.id;
    console.log(`   ✓ ${p.name}`);
  }

  // 5. Consultas + Prontuários
  console.log("\n📋 Criando consultas e prontuários...");

  // Distribui pacientes entre os dois médicos e especialidades
  const assignments: Array<{
    cpf: string;
    doctorEmail: string;
    specialtyName: string;
    daysAgo: number;
  }> = [
    { cpf: "555.555.555-01", doctorEmail: "drafernanda@adqpal.com", specialtyName: "Clínica Geral", daysAgo: 120 },
    { cpf: "555.555.555-02", doctorEmail: "drafernanda@adqpal.com", specialtyName: "Pneumologia", daysAgo: 90 },
    { cpf: "555.555.555-03", doctorEmail: "drafernanda@adqpal.com", specialtyName: "Neurologia", daysAgo: 30 },
    { cpf: "555.555.555-04", doctorEmail: "drmarcos@adqpal.com",    specialtyName: "Clínica Geral", daysAgo: 60 },
    { cpf: "555.555.555-05", doctorEmail: "drafernanda@adqpal.com", specialtyName: "Endocrinologia", daysAgo: 45 },
    { cpf: "555.555.555-06", doctorEmail: "drmarcos@adqpal.com",    specialtyName: "Clínica Geral", daysAgo: 15 },
    { cpf: "555.555.555-07", doctorEmail: "drafernanda@adqpal.com", specialtyName: "Neurologia", daysAgo: 10 },
    { cpf: "555.555.555-08", doctorEmail: "drmarcos@adqpal.com",    specialtyName: "Clínica Geral", daysAgo: 75 },
    { cpf: "555.555.555-09", doctorEmail: "drafernanda@adqpal.com", specialtyName: "Clínica Geral", daysAgo: 20 },
    { cpf: "555.555.555-10", doctorEmail: "drafernanda@adqpal.com", specialtyName: "Endocrinologia", daysAgo: 25 },
    { cpf: "555.555.555-11", doctorEmail: "drafernanda@adqpal.com", specialtyName: "Endocrinologia", daysAgo: 40 },
    { cpf: "555.555.555-12", doctorEmail: "drmarcos@adqpal.com",    specialtyName: "Clínica Geral", daysAgo: 55 },
    { cpf: "555.555.555-13", doctorEmail: "drmarcos@adqpal.com",    specialtyName: "Clínica Geral", daysAgo: 18 },
    { cpf: "555.555.555-14", doctorEmail: "drmarcos@adqpal.com",    specialtyName: "Cardiologia", daysAgo: 35 },
    { cpf: "555.555.555-15", doctorEmail: "drafernanda@adqpal.com", specialtyName: "Reumatologia", daysAgo: 12 },
    { cpf: "555.555.555-16", doctorEmail: "drmarcos@adqpal.com",    specialtyName: "Clínica Geral", daysAgo: 8 },
    { cpf: "555.555.555-17", doctorEmail: "drafernanda@adqpal.com", specialtyName: "Neurologia", daysAgo: 22 },
    { cpf: "555.555.555-18", doctorEmail: "drafernanda@adqpal.com", specialtyName: "Pneumologia", daysAgo: 5 },
    { cpf: "555.555.555-19", doctorEmail: "drmarcos@adqpal.com",    specialtyName: "Clínica Geral", daysAgo: 14 },
    { cpf: "555.555.555-20", doctorEmail: "drmarcos@adqpal.com",    specialtyName: "Clínica Geral", daysAgo: 7 },
  ];

  for (const a of assignments) {
    const patientId = patientMap[a.cpf];
    const userId    = userMap[a.doctorEmail];

    if (!patientId || !userId) {
      console.warn(`   ⚠ Pulando ${a.cpf} — paciente ou médico não encontrado`);
      continue;
    }

    const scheduledAt = new Date();
    scheduledAt.setDate(scheduledAt.getDate() - a.daysAgo);
    scheduledAt.setHours(9, 0, 0, 0);

    const prontuario = PRONTUARIOS[a.cpf];
    const paciente = PACIENTES.find((p) => p.cpf === a.cpf)!;

    // Verifica se já existe consulta para esse paciente nesse horário
    const existing = await prisma.appointment.findFirst({
      where: { patientId, userId, scheduledAt },
    });

    let appointmentId: string;

    if (existing) {
      appointmentId = existing.id;
      console.log(`   ~ Consulta já existe para ${paciente.name} — reaproveitando`);
    } else {
      const appointment = await prisma.appointment.create({
        data: {
          userId,
          patientId,
          scheduledAt,
          status: "COMPLETED",
          type: "IN_PERSON",
          roomId: "Consultório 01",
          specialtyId: specialtyMap[a.specialtyName],
          notes: `Consulta de ${a.specialtyName.toLowerCase()}.`,
        },
      });
      appointmentId = appointment.id;
      console.log(`   ✓ Consulta criada — ${paciente.name}`);
    }

    // Verifica se já existe prontuário para essa consulta
    const existingRecord = await prisma.medicalRecord.findUnique({
      where: { appointmentId },
    });

    if (existingRecord) {
      console.log(`   ~ Prontuário já existe para ${paciente.name} — pulando`);
    } else {
      await prisma.medicalRecord.create({
        data: {
          appointmentId,
          patientId,
          diagnosis: prontuario.diagnosis,
          prescription: prontuario.prescription,
          notes: prontuario.notes,
        },
      });
      console.log(`   ✓ Prontuário criado — ${paciente.name}`);
    }
  }

  console.log("\n✅ Seed concluído com sucesso!");
  console.log("\n📌 Credenciais de acesso:");
  console.log("   Médico 1:  drmarcos@adqpal.com      | Teste@123");
  console.log("   Médico 2:  drafernanda@adqpal.com   | Teste@123");
  console.log("   Admin:     admin@adqpal.com           | Teste@123");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
