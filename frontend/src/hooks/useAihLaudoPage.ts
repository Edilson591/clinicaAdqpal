import { useCallback, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

export interface AihData {
  f1EstabelecimentoSolicitante: string;
  f2CnesSolicitante: string;
  f3EstabelecimentoExecutante: string;
  f4CnesExecutante: string;
  f5Paciente: string;
  f6Prontuario: string;
  f7Cns: string;
  f8Nascimento: string;
  f9Sexo: string;
  f10MaeResponsavel: string;
  f11Ddd: string;
  f11Telefone: string;
  f12Endereco: string;
  f13Municipio: string;
  f14Ibge: string;
  f15Uf: string;
  f16Cep: string;
  f17SinaisSintomas: string;
  f18Condicoes: string;
  f19Resultados: string;
  f20Diagnostico: string;
  f21CidPrincipal: string;
  f22CidSecundario: string;
  f23CidAssociado: string;
  f24Procedimento: string;
  f25CodigoProcedimento: string;
  f26Clinica: string;
  f27CaraterInternacao: string;
  f28DocumentoTipo: string;
  f29DocumentoProfissional: string;
  f30ProfissionalSolicitante: string;
  f31DataSolicitacao: string;
  f33AcidenteTransito: boolean;
  f34AcidenteTrabalhoTipico: boolean;
  f35AcidenteTrabalhoTrajeto: boolean;
  f36CnpjSeguradora: string;
  f37Bilhete: string;
  f38Serie: string;
  f39CnpjEmpresa: string;
  f40Cnae: string;
  f41Cbor: string;
  f42VinculoPrevidencia: string;
  f43ProfissionalAutorizador: string;
  f44OrgaoEmissor: string;
  f45DocumentoTipo: string;
  f46DocumentoAutorizador: string;
  f47DataAutorizacao: string;
  f49NumeroAih: string;
  _selectedPatientId: string;
  _selectedDoctorId: string;
}

const ESTABELECIMENTO =
  "ADQPAL-ASSOC. DOS DEPENDENTES QUÍMICOS E PORTADORES DE DOENÇAS PSIQUIÁTRICAS";

export function emptyAihData(): AihData {
  return {
    f1EstabelecimentoSolicitante: ESTABELECIMENTO,
    f2CnesSolicitante: "9033459",
    f3EstabelecimentoExecutante: ESTABELECIMENTO,
    f4CnesExecutante: "9033459",
    f5Paciente: "",
    f6Prontuario: "",
    f7Cns: "",
    f8Nascimento: "",
    f9Sexo: "",
    f10MaeResponsavel: "",
    f11Ddd: "",
    f11Telefone: "",
    f12Endereco: "",
    f13Municipio: "SÃO MIGUEL DOS CAMPOS",
    f14Ibge: "",
    f15Uf: "AL",
    f16Cep: "",
    f17SinaisSintomas: "",
    f18Condicoes: "",
    f19Resultados: "",
    f20Diagnostico: "",
    f21CidPrincipal: "",
    f22CidSecundario: "",
    f23CidAssociado: "",
    f24Procedimento: "",
    f25CodigoProcedimento: "",
    f26Clinica: "",
    f27CaraterInternacao: "",
    f28DocumentoTipo: "CPF",
    f29DocumentoProfissional: "",
    f30ProfissionalSolicitante: "",
    f31DataSolicitacao: "",
    f33AcidenteTransito: false,
    f34AcidenteTrabalhoTipico: false,
    f35AcidenteTrabalhoTrajeto: false,
    f36CnpjSeguradora: "",
    f37Bilhete: "",
    f38Serie: "",
    f39CnpjEmpresa: "",
    f40Cnae: "",
    f41Cbor: "",
    f42VinculoPrevidencia: "",
    f43ProfissionalAutorizador: "",
    f44OrgaoEmissor: "",
    f45DocumentoTipo: "CPF",
    f46DocumentoAutorizador: "",
    f47DataAutorizacao: "",
    f49NumeroAih: "",
    _selectedPatientId: "",
    _selectedDoctorId: "",
  };
}

export function useAihLaudoPage() {
  const [data, setData] = useState<AihData>(emptyAihData);
  const [errors, setErrors] = useState<string[]>([]);
  const formRef = useRef<HTMLDivElement>(null);

  const update = useCallback(
    (key: keyof AihData, value: AihData[keyof AihData]) => {
      setData((previous) => ({ ...previous, [key]: value }));
      setErrors([]);
    },
    [],
  );

  const print = useReactToPrint({
    contentRef: formRef,
    documentTitle: `Laudo AIH - ${data.f5Paciente || "ADQPAL"}`,
    pageStyle: `
      @page { size: A4 portrait; margin: 10mm 11mm 12mm; }
      body { background: white !important; margin: 0 !important; }
      #aih-form { width: 188mm !important; min-height: 0 !important; box-shadow: none !important; margin: 0 auto !important; }
      .no-print { display: none !important; }
      input:focus, textarea:focus { background: transparent !important; }
    `,
  });

  const handlePrint = useCallback(() => {
    const nextErrors: string[] = [];
    if (!data.f5Paciente.trim()) nextErrors.push("Informe o nome do paciente.");
    if (!data.f30ProfissionalSolicitante.trim()) {
      nextErrors.push("Informe o profissional solicitante.");
    }
    if (!data.f24Procedimento.trim() || !data.f25CodigoProcedimento.trim()) {
      nextErrors.push("Informe o procedimento solicitado.");
    }
    if (nextErrors.length) {
      setErrors(nextErrors);
      return;
    }
    print();
  }, [data, print]);

  const handleClear = useCallback(() => {
    if (confirm("Deseja limpar todos os campos do Laudo AIH?")) {
      setData(emptyAihData());
      setErrors([]);
    }
  }, []);

  return { data, errors, formRef, update, handlePrint, handleClear };
}
