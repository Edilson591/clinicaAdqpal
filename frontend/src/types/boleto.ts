export type BoletoKind = "SINGLE" | "ANNUAL_CARNET";

export type BoletoStatus =
  | "PENDING"
  | "PROCESSING"
  | "REGISTERED"
  | "PDF_GENERATED"
  | "SENT"
  | "PAID"
  | "CANCELLED"
  | "FAILED"
  | "EXPIRED";

export interface BoletoPayer {
  name: string;
  document: string;
  email?: string;
  phone?: string;
}

export interface CreateSingleBoletoRequest {
  kind: "SINGLE";
  payer: BoletoPayer;
  amountCents: number;
  dueDate: string;
  description?: string;
}

export interface CreateAnnualCarnetRequest {
  kind: "ANNUAL_CARNET";
  payer: BoletoPayer;
  amountCents: number;
  firstDueDate: string;
  installments: 12;
  description?: string;
}

export type CreateBoletoRequest =
  | CreateSingleBoletoRequest
  | CreateAnnualCarnetRequest;

export interface CreateBoletoResponse {
  success: boolean;
  message: string;
  data: {
    boletoId?: string;
    seriesId?: string;
    boletoIds?: string[];
    installments?: number;
    idempotentReplay: boolean;
  };
}

export interface BoletoListItem {
  id: string;
  seriesId: string;
  installmentNumber: number;
  payerName: string;
  amountCents: number;
  currency: string;
  dueDate: string;
  description?: string;
  status: BoletoStatus;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoletoFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: BoletoStatus;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export interface BoletoListResponse {
  items: BoletoListItem[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface BoletoGroup {
  seriesId: string;
  kind: BoletoKind;
  installments: BoletoListItem[];
}
