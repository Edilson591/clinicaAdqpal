import { Link } from "react-router-dom";
import { useConsent } from "../../context/ConsentContext";
import { Button } from "../ui/Button";

export function ConsentBanner() {
  const { acceptAll, rejectOptional, openSettings } = useConsent();
  return (
    <section
      aria-labelledby="consent-title"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-2xl sm:p-6"
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 id="consent-title" className="text-lg font-bold text-slate-900">Suas escolhas de privacidade</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
            Usamos tecnologias necessárias para autenticação e segurança. Categorias opcionais só serão ativadas com sua escolha. Atualmente não há rastreadores de publicidade ativos.
          </p>
          <Link className="mt-2 inline-block text-sm font-semibold text-green-700 underline" to="/politica-de-cookies">
            Consultar política de cookies
          </Link>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
          <Button variant="outline" onClick={rejectOptional}>Rejeitar opcionais</Button>
          <Button variant="secondary" onClick={openSettings}>Personalizar</Button>
          <Button onClick={acceptAll}>Aceitar opcionais</Button>
        </div>
      </div>
    </section>
  );
}
