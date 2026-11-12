import { useEffect, useRef, useState } from "react";
import { useConsent } from "../../context/ConsentContext";
import { Button } from "../ui/Button";

const categories = [
  { key: "analytics" as const, title: "Análise", description: "Medição de uso e desempenho. Nenhum serviço está ativo atualmente." },
  { key: "marketing" as const, title: "Marketing", description: "Publicidade e campanhas. Nenhum serviço está ativo atualmente." },
  { key: "personalization" as const, title: "Personalização", description: "Memorização de preferências opcionais, como tema visual." },
];

export function ConsentSettings() {
  const { consent, closeSettings, savePreferences } = useConsent();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [values, setValues] = useState({
    analytics: consent?.analytics ?? false,
    marketing: consent?.marketing ?? false,
    personalization: consent?.personalization ?? false,
  });

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSettings();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeSettings]);

  return (
    <div className="fixed inset-0 z-[110] grid place-items-center bg-slate-950/70 p-4" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeSettings()}>
      <section role="dialog" aria-modal="true" aria-labelledby="consent-settings-title" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 text-slate-900 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="consent-settings-title" className="text-xl font-bold">Preferências de privacidade</h2>
            <p className="mt-1 text-sm text-slate-600">Nenhuma opção é selecionada previamente.</p>
          </div>
          <button ref={closeRef} type="button" aria-label="Fechar preferências" onClick={closeSettings} className="min-h-11 min-w-11 rounded-lg text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600">×</button>
        </div>
        <div className="mt-6 space-y-3">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex justify-between gap-4"><strong>Necessários</strong><span className="text-sm font-semibold text-green-700">Sempre ativos</span></div>
            <p className="mt-1 text-sm text-slate-600">Autenticação, segurança, prevenção a fraude e registro das suas escolhas.</p>
          </div>
          {categories.map((category) => (
            <label key={category.key} className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-slate-200 p-4">
              <span><strong>{category.title}</strong><span className="mt-1 block text-sm text-slate-600">{category.description}</span></span>
              <input
                type="checkbox"
                className="mt-1 h-6 w-6 accent-green-700"
                checked={values[category.key]}
                onChange={(event) => setValues((current) => ({ ...current, [category.key]: event.target.checked }))}
              />
            </label>
          ))}
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={closeSettings}>Cancelar</Button>
          <Button onClick={() => savePreferences(values)}>Salvar escolhas</Button>
        </div>
      </section>
    </div>
  );
}
