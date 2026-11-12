import { Link } from "react-router-dom";
import { useConsent } from "../../context/ConsentContext";

export function LgpdFooter() {
  const { openSettings } = useConsent();
  return (
    <div className="mt-8 pt-6 border-t border-[#E2E8F0] w-full text-center">
      <p className="text-xs text-[#718096] mb-3">
        Instituto ADQPAL © {new Date().getFullYear()}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <Link
          to="/politica-de-privacidade"
          className="text-xs text-[#38a169] hover:text-[#287a50] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38a169] rounded-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          Política de Privacidade
        </Link>
        <span className="text-[#CBD5E0] text-xs select-none">·</span>
        <Link
          to="/termos-de-uso"
          className="text-xs text-[#38a169] hover:text-[#287a50] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38a169] rounded-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          Termos de Uso
        </Link>
        <span className="text-[#CBD5E0] text-xs select-none">·</span>
        <Link
          to="/politica-de-cookies"
          className="text-xs text-[#38a169] hover:text-[#287a50] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38a169] rounded-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          Política de Cookies
        </Link>
        <span className="text-[#CBD5E0] text-xs select-none">·</span>
        <button type="button" onClick={openSettings} className="text-xs text-[#287a50] hover:text-[#38a169] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#287a50]">Preferências de privacidade</button>
        <span className="text-[#CBD5E0] text-xs select-none">·</span>
        <Link to="/privacidade/solicitacao" className="text-xs text-[#287a50] hover:text-[#38a169] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#287a50]">Exercer direitos</Link>
      </div>
    </div>
  );
}
