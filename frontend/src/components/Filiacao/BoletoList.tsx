import { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  CircleAlert,
  Download,
  FileText,
  Layers3,
  ReceiptText,
} from "lucide-react";
import type {
  BoletoGroup,
  BoletoListItem,
  BoletoStatus,
} from "../../types/boleto";

const STATUS_LABELS: Record<BoletoStatus, string> = {
  PENDING: "Pendente",
  PROCESSING: "Processando",
  REGISTERED: "Registrado",
  PDF_GENERATED: "PDF disponível",
  SENT: "Enviado",
  PAID: "Pago",
  CANCELLED: "Cancelado",
  FAILED: "Falhou",
  EXPIRED: "Vencido",
};

const STATUS_STYLES: Record<BoletoStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  PROCESSING: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  REGISTERED: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300",
  PDF_GENERATED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  SENT: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300",
  PAID: "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300",
  CANCELLED: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  FAILED: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  EXPIRED: "bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
};

function groupBoletos(items: BoletoListItem[]): BoletoGroup[] {
  const groups = new Map<string, BoletoListItem[]>();
  for (const item of items) {
    const group = groups.get(item.seriesId) ?? [];
    group.push(item);
    groups.set(item.seriesId, group);
  }

  return Array.from(groups, ([seriesId, installments]) => {
    installments.sort((left, right) => left.installmentNumber - right.installmentNumber);
    const first = installments[0];
    const isAnnual =
      installments.length > 1 ||
      first.installmentNumber > 1 ||
      first.seriesId !== first.id;
    return {
      seriesId,
      kind: isAnnual ? "ANNUAL_CARNET" : "SINGLE",
      installments,
    };
  });
}

function formatCurrency(amountCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amountCents / 100);
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR");
}

function StatusBadge({ status }: { status: BoletoStatus }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function InstallmentRow({ boleto, isAnnual }: { boleto: BoletoListItem; isAnnual: boolean }) {
  return (
    <div className="grid gap-3 border-t border-[#E2E8F0] px-4 py-3 dark:border-[#334155] sm:grid-cols-[80px_1fr_120px_130px] sm:items-center">
      <span className="text-xs font-semibold text-[#475569] dark:text-[#CBD5E1]">
        {isAnnual ? `${boleto.installmentNumber}/12` : "Única"}
      </span>
      <div className="flex min-w-0 items-center gap-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
        <CalendarDays size={14} className="shrink-0" />
        Vence em {formatDate(boleto.dueDate)}
      </div>
      <StatusBadge status={boleto.status} />
      {boleto.pdfUrl ? (
        <a
          href={boleto.pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2F855A] hover:text-[#276749]"
        >
          <Download size={14} />
          Abrir PDF
        </a>
      ) : (
        <span className="text-xs text-[#94A3B8]">PDF em processamento</span>
      )}
    </div>
  );
}

function BoletoGroupCard({ group }: { group: BoletoGroup }) {
  const [expanded, setExpanded] = useState(group.kind === "SINGLE");
  const first = group.installments[0];
  const isAnnual = group.kind === "ANNUAL_CARNET";
  const total = isAnnual ? first.amountCents * 12 : first.amountCents;
  const completed = group.installments.filter((item) => item.pdfUrl).length;

  return (
    <article className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm transition-shadow hover:shadow-md dark:border-[#334155] dark:bg-[#1E293B]">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full flex-col gap-4 p-4 text-left sm:flex-row sm:items-center sm:p-5"
        aria-expanded={expanded}
      >
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            isAnnual
              ? "bg-[#E6F5ED] text-[#2F855A] dark:bg-[#1A3A2A]"
              : "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300"
          }`}
        >
          {isAnnual ? <Layers3 size={21} /> : <ReceiptText size={21} />}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-bold text-[#1E293B] dark:text-[#F1F5F9]">
              {first.payerName}
            </h3>
            <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#64748B] dark:bg-[#334155] dark:text-[#CBD5E1]">
              {isAnnual ? "Carnê anual" : "Boleto individual"}
            </span>
          </div>
          <p className="mt-1 truncate text-xs text-[#94A3B8]">
            {first.description || "Cobrança sem descrição"}
          </p>
          {isAnnual && (
            <p className="mt-1 text-[11px] font-medium text-[#38A169]">
              {completed}/12 PDFs disponíveis
            </p>
          )}
        </div>

        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
          <div className="sm:text-right">
            <p className="text-sm font-bold text-[#1E293B] dark:text-[#F1F5F9]">
              {formatCurrency(total)}
            </p>
            <p className="text-[11px] text-[#94A3B8]">
              {isAnnual ? `12x de ${formatCurrency(first.amountCents)}` : `Vence ${formatDate(first.dueDate)}`}
            </p>
          </div>
          <ChevronDown
            size={18}
            className={`text-[#94A3B8] transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {expanded && (
        <div className="bg-[#F8FAFC]/70 dark:bg-[#0F172A]/40">
          {group.installments.map((boleto) => (
            <InstallmentRow key={boleto.id} boleto={boleto} isAnnual={isAnnual} />
          ))}
        </div>
      )}
    </article>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-28 animate-pulse rounded-xl border border-[#E2E8F0] bg-white dark:border-[#334155] dark:bg-[#1E293B]"
        />
      ))}
    </div>
  );
}

interface BoletoListProps {
  items: BoletoListItem[];
  search: string;
  status: BoletoStatus | "";
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function BoletoList({ items, search, status, isLoading, isError, onRetry }: BoletoListProps) {
  if (isLoading) return <ListSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-red-200 bg-red-50 px-5 py-12 text-center dark:border-red-900 dark:bg-red-950/30">
        <CircleAlert className="mb-3 text-red-500" size={28} />
        <p className="text-sm font-semibold text-red-700 dark:text-red-300">Não foi possível carregar os boletos.</p>
        <button type="button" onClick={onRetry} className="mt-3 text-xs font-bold text-red-600 underline">
          Tentar novamente
        </button>
      </div>
    );
  }

  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  const groups = groupBoletos(items).filter((group) => {
    const matchesStatus = !status || group.installments.some((item) => item.status === status);
    const matchesSearch =
      !normalizedSearch ||
      group.installments.some((item) =>
        [item.id, item.seriesId, item.payerName, item.description ?? ""].some((value) =>
          value.toLocaleLowerCase("pt-BR").includes(normalizedSearch),
        ),
      );
    return matchesStatus && matchesSearch;
  });

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-[#CBD5E1] bg-white px-5 py-14 text-center dark:border-[#475569] dark:bg-[#1E293B]">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E6F5ED] text-[#38A169] dark:bg-[#1A3A2A]">
          <FileText size={23} />
        </span>
        <p className="text-sm font-bold text-[#334155] dark:text-[#E2E8F0]">Nenhuma cobrança encontrada</p>
        <p className="mt-1 text-xs text-[#94A3B8]">Os boletos e carnês emitidos aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <BoletoGroupCard key={group.seriesId} group={group} />
      ))}
    </div>
  );
}
