import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { administrativeDocuments } from "../documents/configs";
import type { AdministrativeDocumentId, AdministrativeValues } from "../documents/types";
import { createAdministrativeDocumentSchema } from "../../../validate/administrativeDocument.schema";

const ACTIVE_DOCUMENT_STORAGE_KEY = "administrativo_active_document_id";

export const administrativePrintStyles = `@media print { @page { size: A4; margin: 12mm 15mm; } html, body, #root, main { height: auto !important; overflow: visible !important; } body * { visibility: hidden; } .administrativo-print, .administrativo-print * { visibility: visible; } .administrativo-print { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; height: auto !important; overflow: visible !important; } .administrativo-print article { min-height: auto !important; overflow: visible !important; } .administrativo-print .print-page-start { break-before: page; page-break-before: always; } }`;

function normalizeText(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getInitialActiveDocumentId(): AdministrativeDocumentId {
  const fallback = "termo-voluntario";
  const saved = localStorage.getItem(ACTIVE_DOCUMENT_STORAGE_KEY);
  return administrativeDocuments.some((doc) => doc.id === saved) ? saved ?? fallback : fallback;
}

function getDocumentPrintStyles() {
  return Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .filter((node) => !node.textContent?.includes("administrativo-print"))
    .map((node) => node.outerHTML)
    .join("\n");
}

export function useAdministrativoPage() {
  const printContentRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<AdministrativeDocumentId>(getInitialActiveDocumentId);
  const [search, setSearch] = useState("");
  const [valuesByDocument, setValuesByDocument] = useState<Record<string, AdministrativeValues>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredDocuments = useMemo(() => {
    const query = normalizeText(search.trim());
    if (!query) return administrativeDocuments;
    return administrativeDocuments.filter((doc) => normalizeText(`${doc.title} ${doc.description} ${doc.group}`).includes(query));
  }, [search]);

  const activeDocument = administrativeDocuments.find((doc) => doc.id === activeId) ?? administrativeDocuments[0];
  const activeValues = useMemo(() => valuesByDocument[activeDocument.id] ?? {}, [valuesByDocument, activeDocument.id]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_DOCUMENT_STORAGE_KEY, activeDocument.id);
  }, [activeDocument.id]);

  const updateValue = useCallback((name: string, value: string) => {
    setValuesByDocument((current) => ({
      ...current,
      [activeDocument.id]: {
        ...(current[activeDocument.id] ?? {}),
        [name]: value,
      },
    }));
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }, [activeDocument.id]);

  const validate = useCallback(() => {
    const formValues = activeDocument.fields.reduce<AdministrativeValues>((acc, field) => {
      acc[field.name] = activeValues[field.name] ?? field.defaultValue ?? "";
      return acc;
    }, {});

    const zodResult = createAdministrativeDocumentSchema(activeDocument).safeParse(formValues);
    const zodErrors = zodResult.success
      ? {}
      : zodResult.error.issues.reduce<Record<string, string>>((acc, issue) => {
          const fieldName = issue.path[0];
          if (typeof fieldName === "string" && !acc[fieldName]) acc[fieldName] = issue.message;
          return acc;
        }, {});

    const nextErrors = activeDocument.fields.reduce<Record<string, string>>((acc, field) => {
      if (zodErrors[field.name]) acc[field.name] = zodErrors[field.name];
      return acc;
    }, {});
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [activeDocument, activeValues]);

  const handlePrint = useCallback(() => {
    if (!validate()) return;
    const printable = printContentRef.current;
    if (!printable) return;

    const existingFrame = document.getElementById("administrativo-print-frame");
    existingFrame?.remove();

    const iframe = document.createElement("iframe");
    iframe.id = "administrativo-print-frame";
    iframe.style.position = "fixed";
    iframe.style.left = "-10000px";
    iframe.style.top = "0";
    iframe.style.width = "210mm";
    iframe.style.height = "297mm";
    iframe.style.border = "0";
    iframe.setAttribute("aria-hidden", "true");
    document.body.appendChild(iframe);

    const iframeDocument = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!iframeDocument) {
      window.print();
      return;
    }

    iframeDocument.open();
    iframeDocument.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <base href="${window.location.origin}/" />
    <title>${activeDocument.title}</title>
    ${getDocumentPrintStyles()}
    <style>
      @page { size: A4; margin: 12mm 15mm; }
      html, body { margin: 0; background: white; overflow: visible; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      article { width: auto !important; min-height: auto !important; margin: 0 auto !important; padding: 0 !important; box-shadow: none !important; overflow: visible !important; }
      article + article { margin-top: 0 !important; }
      .print-page-start { break-before: page; page-break-before: always; }
      tr { break-inside: avoid; page-break-inside: avoid; }
      * { visibility: visible !important; }
    </style>
  </head>
  <body>${printable.innerHTML}</body>
</html>`);
    iframeDocument.close();

    const printWhenReady = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    };
    iframe.contentWindow?.addEventListener("afterprint", () => iframe.remove(), { once: true });

    const images = Array.from(iframeDocument.images);
    Promise.all(
      images.map((image) => {
        if (image.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
          image.onload = () => resolve();
          image.onerror = () => resolve();
        });
      }),
    ).then(() => window.setTimeout(printWhenReady, 400));
  }, [activeDocument.title, validate]);

  const handleClear = useCallback(() => {
    setValuesByDocument((current) => ({ ...current, [activeDocument.id]: {} }));
    setErrors({});
  }, [activeDocument.id]);

  const handleSelectDocument = useCallback((id: AdministrativeDocumentId) => {
    setActiveId(id);
    setErrors({});
  }, []);

  return {
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
  };
}
