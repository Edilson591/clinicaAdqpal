import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { privacyService, type PrivacyRequestReceipt } from "../../services/Privacy";
import { Button } from "../../components/ui/Button";
import { InputGroup } from "../../components/ui/Input";

export default function PrivacyRequestPage() {
  const [receipt, setReceipt] = useState<PrivacyRequestReceipt | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      setReceipt(await privacyService.createRequest({
        requesterName: String(data.get("requesterName") ?? ""),
        requesterEmail: String(data.get("requesterEmail") ?? ""),
        subjectType: String(data.get("subjectType")) as "PATIENT",
        requestType: String(data.get("requestType")) as "ACCESS",
        description: String(data.get("description") ?? "") || undefined,
      }));
    } catch (requestError) {
      setError(isAxiosError(requestError) ? requestError.response?.data?.message ?? "Não foi possível registrar a solicitação." : "Não foi possível registrar a solicitação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-lg sm:p-10">
        <Link to="/politica-de-privacidade" className="text-sm font-semibold text-green-700 underline">Voltar à política de privacidade</Link>
        <h1 className="mt-5 text-3xl font-bold">Exercer direitos sobre dados pessoais</h1>
        <p className="mt-3 leading-7 text-slate-700">Registre sua solicitação. A identidade será validada antes de qualquer acesso, correção, portabilidade, anonimização ou exclusão. Obrigações legais podem impedir a eliminação imediata de determinados registros.</p>
        {receipt ? (
          <section aria-live="polite" className="mt-8 rounded-xl border border-green-200 bg-green-50 p-5">
            <h2 className="text-lg font-bold text-green-900">Solicitação registrada</h2>
            <p className="mt-2 text-sm">Protocolo: <strong>{receipt.protocol}</strong></p>
            <p className="mt-2 break-all text-sm">Chave de acompanhamento: <strong>{receipt.accessToken}</strong></p>
            <p className="mt-3 text-sm font-semibold text-red-800">Guarde esta chave em local seguro. Ela não será exibida novamente.</p>
          </section>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={submit} noValidate>
            <InputGroup label="Nome completo" required inputProps={{ name: "requesterName", required: true, autoComplete: "name" }} />
            <InputGroup label="E-mail para contato" required inputProps={{ name: "requesterEmail", type: "email", required: true, autoComplete: "email" }} />
            <label className="block text-sm font-semibold" htmlFor="subjectType">Relação com a instituição</label>
            <select id="subjectType" name="subjectType" required className="h-14 w-full rounded-lg border border-slate-400 bg-white px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700">
              <option value="PATIENT">Paciente</option><option value="USER">Usuário do sistema</option><option value="EMPLOYEE">Funcionário</option><option value="OTHER">Outra</option>
            </select>
            <label className="block text-sm font-semibold" htmlFor="requestType">Direito solicitado</label>
            <select id="requestType" name="requestType" required className="h-14 w-full rounded-lg border border-slate-400 bg-white px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700">
              <option value="ACCESS">Acesso/confirmacão</option><option value="CORRECTION">Correção</option><option value="PORTABILITY">Portabilidade</option><option value="DELETION">Eliminação</option><option value="ANONYMIZATION">Anonimização ou bloqueio</option><option value="CONSENT_REVOCATION">Revogação de consentimento</option><option value="SHARING_INFORMATION">Informações sobre compartilhamento</option><option value="OTHER">Outro</option>
            </select>
            <InputGroup label="Detalhes" helperText="Não informe senhas, laudos ou documentos completos neste campo." textarea textareaProps={{ name: "description", maxLength: 2000 }} />
            {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
            <Button type="submit" size="lg" disabled={loading} className="w-full">{loading ? "Registrando..." : "Registrar solicitação"}</Button>
          </form>
        )}
      </div>
    </main>
  );
}
