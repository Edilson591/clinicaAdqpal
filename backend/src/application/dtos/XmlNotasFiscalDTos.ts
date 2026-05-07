// XMLNotaFiscalDTO.ts

export interface XMLNotaFiscalDTO {
  nota: {
    id: string;
    numero?: string;
    servico: string;
    valor: number;
    observacoes?: string | null;
    dataEmissao?: Date | null;
  };

  paciente: {
    nome: string;
    cpf?: string;
    cnpj?: string;
  };

  empresa: {
    razaoSocial: string;
    cnpj: string;
    inscricaoMunicipal: string;
    municipioCodigo: string;
  };
}