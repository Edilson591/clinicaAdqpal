import { AlertCircle, Printer, Trash2 } from "lucide-react";
import { Header } from "../../components/Dashboard/Header";
import { Button } from "../../components/ui/Button";
import { DocumentSidebar } from "./components/DocumentSidebar";
import { DocumentForm } from "./components/DocumentForm";
import { PrintPreview } from "./components/PrintPreview";
import { administrativePrintStyles, useAdministrativoPage } from "./hooks/useAdministrativoPage";

export default function AdministrativoPage() {
  const {
    activeDocument,
    activeValues,
    errors,
    filteredDocuments,
    handleClear,
    handlePrint,
    handleSelectDocument,
    printContentRef,
    search,
    setSearch,
    updateValue,
  } = useAdministrativoPage();

  return (
    <main className="relative flex-1 min-w-0 overflow-y-auto bg-[#F8FAFC] dark:bg-[#0F172A]">
      <style>{administrativePrintStyles}</style>
      <div className="pointer-events-none absolute inset-0 z-0 bg-[url('/bg-fundo.jpeg')] bg-cover bg-center bg-no-repeat opacity-10 dark:bg-none" />
      <div className="relative p-4 sm:p-6 lg:p-8">
        <Header />

        <div className="mb-6 flex flex-col items-stretch justify-between gap-4 print:hidden sm:flex-row sm:items-start">
          <div>
            <h1 className="text-xl font-bold text-[#1E293B] dark:text-[#F1F5F9] sm:text-2xl">
              Documentacao Administrativa
            </h1>
            <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
              Primeira etapa da migracao: modelos componentizados, seguros e alinhados ao layout do sistema.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button
              variant="primary"
              onClick={handlePrint}
              className="bg-[#1565c0] from-[#1565c0] to-[#1565c0] hover:from-[#1250a0] hover:to-[#1250a0] h-10 px-4 flex items-center justify-center gap-2 shrink-0"
            >
              <Printer size={16} />
              Imprimir
            </Button>
            <Button variant="destructive" onClick={handleClear} className="h-10 px-4 flex items-center justify-center gap-2 shrink-0">
              <Trash2 size={16} />
              Limpar
            </Button>
          </div>
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20 print:hidden">
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
            <div>
              <p className="mb-1 text-sm font-bold text-red-700 dark:text-red-400">Corrija os erros abaixo antes de imprimir:</p>
              <ul className="list-none space-y-0.5 pl-0">
                {Object.values(errors).map((error, index) => (
                  <li key={`${error}-${index}`} className="text-sm text-red-600 dark:text-red-300">{error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)] print:block">
          <div className="min-w-0 print:hidden">
            <DocumentSidebar
              documents={filteredDocuments}
              activeId={activeDocument.id}
              search={search}
              onSearchChange={setSearch}
              onSelect={handleSelectDocument}
            />
          </div>

          <div className="min-w-0 space-y-6 print:space-y-0">
            <div className="print:hidden">
              <DocumentForm document={activeDocument} values={activeValues} errors={errors} onChange={updateValue} />
            </div>
            <div className="administrativo-print">
              <PrintPreview document={activeDocument} values={activeValues} contentRef={printContentRef} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
