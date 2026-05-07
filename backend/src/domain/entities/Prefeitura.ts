
export type PrefeituraStatus = "erro" | "enviado" | "processado";

export interface PrefeituraNota {
  numero: string;
  url: string;
}

export interface PrefeituraProcessadoResponse {
  status: "processado";
  notas: Record<string, PrefeituraNota>;
}

export interface PrefeituraErroResponse {
  status: "erro";
  detalhes: string;
}

export interface PrefeituraEnviadoResponse {
  status: "enviado";
  detalhes: string;
}

export type PrefeituraResponse =
  | PrefeituraErroResponse
  | PrefeituraEnviadoResponse
  | PrefeituraProcessadoResponse;
