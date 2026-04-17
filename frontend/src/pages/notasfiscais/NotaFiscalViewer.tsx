import { useRef } from "react";
import { X, Printer, CheckCircle } from "lucide-react";
import type { NotaFiscalResponse } from "../../types/api";
import { Button } from "../../components/ui/Button";

interface PatientInfo {
  name: string;
  cpf: string | null;
}

interface NotaFiscalViewerProps {
  nf: NotaFiscalResponse;
  patient: PatientInfo;
  onClose: () => void;
}

// Dados fixos da clínica emissora
const CLINIC = {
  razaoSocial: "ADQPAL Clínica Médica Ltda",
  cnpj: "12.345.678/0001-90",
  inscricaoMunicipal: "123.456-7",
  endereco: "Av. Paulista, 1000 - Bela Vista",
  cidade: "São Paulo",
  estado: "SP",
  cep: "01310-100",
  telefone: "(11) 3000-0000",
  email: "contato@adqpal.com.br",
  codigoServico: "14.01", // Código CNAE para serviços de saúde
};

const ISS_ALIQUOTA = 0.05; // 5%

function formatCPF(cpf: string | null): string {
  if (!cpf) return "Não informado";
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11) return cpf;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function formatMoney(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function generateVerificationCode(id: string): string {
  return id.replace(/-/g, "").slice(0, 12).toUpperCase();
}

export function NotaFiscalViewer({
  nf,
  patient,
  onClose,
}: NotaFiscalViewerProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const valorBruto = nf.valor;
  const deducoes = 0;
  const baseCalculo = valorBruto - deducoes;
  const valorISS = baseCalculo * ISS_ALIQUOTA;
  const valorLiquido = valorBruto - valorISS;
  const dataEmissao = formatDate(nf.dataEmissao ?? nf.createdAt);
  const codigoVerificacao = generateVerificationCode(nf.id);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>NFS-e ${nf.numero}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 11px; color: #1E293B; background: #fff; padding: 20px; }
          .nf-wrapper { max-width: 700px; margin: 0 auto; border: 2px solid #1E293B; }
          .nf-header { background: #1E293B; color: #fff; text-align: center; padding: 12px; }
          .nf-header h1 { font-size: 14px; font-weight: bold; letter-spacing: 1px; }
          .nf-header p { font-size: 10px; margin-top: 2px; color: #94A3B8; }
          .nf-number-row { display: flex; justify-content: space-between; padding: 8px 12px; background: #F1F5F9; border-bottom: 1px solid #CBD5E1; }
          .nf-number-row span { font-size: 11px; }
          .nf-number-row strong { font-weight: bold; }
          .section { border-bottom: 1px solid #CBD5E1; padding: 10px 12px; }
          .section-title { font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #64748B; margin-bottom: 6px; }
          .section-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; }
          .field-label { font-size: 9px; color: #64748B; }
          .field-value { font-size: 11px; font-weight: 500; }
          .servico-desc { font-size: 11px; line-height: 1.6; }
          .values-table { width: 100%; }
          .values-table tr td:first-child { color: #64748B; font-size: 10px; }
          .values-table tr td:last-child { text-align: right; font-weight: 500; }
          .values-table tr.total td { font-weight: bold; font-size: 13px; border-top: 1px solid #CBD5E1; padding-top: 6px; }
          .values-table td { padding: 3px 0; }
          .nf-footer { background: #F8FAFC; padding: 8px 12px; text-align: center; }
          .nf-footer p { font-size: 9px; color: #64748B; }
          .status-badge { display: inline-block; background: #DCFCE7; color: #16A34A; padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: bold; }
          .verify-code { font-family: monospace; font-size: 11px; letter-spacing: 2px; color: #1E293B; background: #F1F5F9; padding: 2px 8px; border-radius: 4px; }
        </style>
      </head>
      <body>${content.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-[#1E293B] rounded-xl shadow-2xl w-full max-w-2xl border border-[#E2E8F0] dark:border-[#334155] my-4">
        {/* Topo do modal */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2E8F0] dark:border-[#334155]">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-[#38A169]" />
            <span className="text-sm font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
              Nota Fiscal Emitida
            </span>
            <span className="text-xs text-[#94A3B8] ml-1">{nf.numero}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* <Button
              variant="ghost"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E2E8F0] dark:border-[#334155] text-[#475569] dark:text-[#94A3B8] hover:bg-[#F8FAFC] dark:hover:bg-[#263548] transition-colors"
            >
              <Printer size={13} />
              Imprimir
            </Button> */}
            <Button
              variant="ghost"
              onClick={onClose}
               className="w-8 h-8 p-0 text-[#94A3B8] hover:opacity-80 transition-colors"
            >
              <X size={15} />
            </Button>
          </div>
        </div>

        {/* Conteúdo da NF */}
        <div className="p-5 overflow-y-auto max-h-[75vh]">
          <div
            ref={printRef}
            className="nf-wrapper border-2 border-[#1E293B] rounded-lg overflow-hidden text-[#1E293B]"
          >
            {/* Cabeçalho da NF */}
            <div className="bg-[#1E293B] text-white text-center py-3 px-4">
              <p className="text-[10px] tracking-widest text-[#94A3B8] uppercase">
                Prefeitura Municipal de São Paulo
              </p>
              <h1 className="text-sm font-bold tracking-wide mt-0.5">
                NOTA FISCAL DE SERVIÇOS ELETRÔNICA
              </h1>
              <p className="text-[11px] font-semibold text-[#38A169] mt-0.5">
                NFS-e
              </p>
            </div>

            {/* Número / Data / Status */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex-wrap gap-2">
              <div className="flex gap-6">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-[#64748B] font-bold">
                    Número
                  </p>
                  <p className="text-sm font-bold text-[#1E293B]">
                    {nf.numero}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-[#64748B] font-bold">
                    Série
                  </p>
                  <p className="text-sm font-bold text-[#1E293B]">001</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-[#64748B] font-bold">
                    Data de Emissão
                  </p>
                  <p className="text-sm font-bold text-[#1E293B]">
                    {dataEmissao}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-wider text-[#64748B] font-bold">
                  Status:
                </span>
                <span className="status-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#DCFCE7] text-[#16A34A]">
                  Emitida
                </span>
              </div>
            </div>

            {/* Código de verificação */}
            <div className="px-4 py-2 bg-[#F1F5F9] border-b border-[#E2E8F0] flex items-center gap-3">
              <p className="text-[9px] uppercase tracking-wider text-[#64748B] font-bold shrink-0">
                Código de Verificação:
              </p>
              <p className="font-mono text-xs tracking-widest text-[#1E293B] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                {codigoVerificacao}
              </p>
              <p className="text-[9px] text-[#94A3B8] ml-auto">
                Código CNAE: {CLINIC.codigoServico}
              </p>
            </div>

            {/* Prestador */}
            <div className="border-b border-[#E2E8F0]">
              <div className="px-4 py-1 bg-[#E8F5E9]">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#16A34A]">
                  Prestador de Serviços
                </p>
              </div>
              <div className="px-4 py-3 grid grid-cols-2 gap-x-6 gap-y-2">
                <div className="col-span-2">
                  <p className="text-[9px] text-[#64748B]">Razão Social</p>
                  <p className="text-sm font-bold">{CLINIC.razaoSocial}</p>
                </div>
                <div>
                  <p className="text-[9px] text-[#64748B]">CNPJ</p>
                  <p className="text-xs font-medium">{CLINIC.cnpj}</p>
                </div>
                <div>
                  <p className="text-[9px] text-[#64748B]">
                    Inscrição Municipal
                  </p>
                  <p className="text-xs font-medium">
                    {CLINIC.inscricaoMunicipal}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-[9px] text-[#64748B]">Endereço</p>
                  <p className="text-xs font-medium">
                    {CLINIC.endereco} — {CLINIC.cidade}/{CLINIC.estado} — CEP{" "}
                    {CLINIC.cep}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-[#64748B]">Telefone</p>
                  <p className="text-xs font-medium">{CLINIC.telefone}</p>
                </div>
                <div>
                  <p className="text-[9px] text-[#64748B]">E-mail</p>
                  <p className="text-xs font-medium">{CLINIC.email}</p>
                </div>
              </div>
            </div>

            {/* Tomador */}
            <div className="border-b border-[#E2E8F0]">
              <div className="px-4 py-1 bg-[#EFF6FF]">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#1D4ED8]">
                  Tomador dos Serviços
                </p>
              </div>
              <div className="px-4 py-3 grid grid-cols-2 gap-x-6 gap-y-2">
                <div className="col-span-2">
                  <p className="text-[9px] text-[#64748B]">
                    Nome / Razão Social
                  </p>
                  <p className="text-sm font-bold">{patient.name}</p>
                </div>
                <div>
                  <p className="text-[9px] text-[#64748B]">CPF / CNPJ</p>
                  <p className="text-xs font-medium">
                    {formatCPF(patient.cpf)}
                  </p>
                </div>
              </div>
            </div>

            {/* Discriminação dos Serviços */}
            <div className="border-b border-[#E2E8F0]">
              <div className="px-4 py-1 bg-[#FEF9C3]">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#854D0E]">
                  Discriminação dos Serviços
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-xs font-semibold">{nf.servico}</p>
                {nf.observacoes && !nf.observacoes.includes("[seed]") && (
                  <p className="text-xs text-[#64748B] mt-1">
                    {nf.observacoes}
                  </p>
                )}
                <p className="text-[10px] text-[#94A3B8] mt-2">
                  Código do Serviço: {CLINIC.codigoServico} — Atividades de
                  atenção à saúde humana
                </p>
              </div>
            </div>

            {/* Valores */}
            <div className="border-b border-[#E2E8F0]">
              <div className="px-4 py-1 bg-[#F1F5F9]">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#475569]">
                  Valores
                </p>
              </div>
              <div className="px-4 py-3">
                <table className="w-full text-xs">
                  <tbody>
                    <tr className="border-b border-[#F1F5F9]">
                      <td className="py-1.5 text-[#64748B]">
                        Valor Bruto dos Serviços
                      </td>
                      <td className="py-1.5 text-right font-medium">
                        {formatMoney(valorBruto)}
                      </td>
                    </tr>
                    <tr className="border-b border-[#F1F5F9]">
                      <td className="py-1.5 text-[#64748B]">Deduções</td>
                      <td className="py-1.5 text-right font-medium">
                        {formatMoney(deducoes)}
                      </td>
                    </tr>
                    <tr className="border-b border-[#F1F5F9]">
                      <td className="py-1.5 text-[#64748B]">
                        Base de Cálculo ISS
                      </td>
                      <td className="py-1.5 text-right font-medium">
                        {formatMoney(baseCalculo)}
                      </td>
                    </tr>
                    <tr className="border-b border-[#F1F5F9]">
                      <td className="py-1.5 text-[#64748B]">Alíquota ISS</td>
                      <td className="py-1.5 text-right font-medium">5,00%</td>
                    </tr>
                    <tr className="border-b border-[#F1F5F9]">
                      <td className="py-1.5 text-[#64748B]">Valor do ISS</td>
                      <td className="py-1.5 text-right font-medium text-[#EF4444]">
                        − {formatMoney(valorISS)}
                      </td>
                    </tr>
                    <tr>
                      <td className="pt-2.5 pb-1 font-bold text-sm border-t border-[#CBD5E1]">
                        Valor Líquido
                      </td>
                      <td className="pt-2.5 pb-1 text-right font-bold text-sm text-[#16A34A] border-t border-[#CBD5E1]">
                        {formatMoney(valorLiquido)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rodapé */}
            <div className="px-4 py-3 bg-[#F8FAFC] text-center">
              <p className="text-[9px] text-[#94A3B8] leading-relaxed">
                Esta Nota Fiscal de Serviços Eletrônica (NFS-e) foi gerada e
                autorizada pela Prefeitura Municipal de São Paulo.
                <br />
                Documento válido como recibo de pagamento. Guarde-o para fins
                fiscais e de declaração de imposto de renda.
                <br />
                <strong className="text-[#64748B]">
                  Natureza da Operação:
                </strong>{" "}
                Tributação no Município —{" "}
                <strong className="text-[#64748B]">
                  Regime de Tributação:
                </strong>{" "}
                Microempresa Municipal
              </p>
            </div>
          </div>
        </div>

        {/* Footer do modal */}
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-[#E2E8F0] dark:border-[#334155]">
          <Button
            onClick={handlePrint}
           className="bg-[#38A169] from-[#38A169] to-[#38A169] hover:from-[#2F9259] hover:to-[#2F9259] h-11 px-5"
          >
            <Printer size={14} />
            Imprimir NF
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-11 px-6 rounded-lg text-sm font-medium border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:opacity-80 disabled:opacity-50 transition-all cursor-pointer"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
