import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LgpdFooter } from "./LgpdFooter";

interface Section {
  title: string;
  content: string | string[];
}

interface LgpdLayoutProps {
  title: string;
  lastUpdated: string;
  sections: Section[];
}

export function LgpdLayout({ title, lastUpdated, sections }: LgpdLayoutProps) {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-8"
      style={{
        background:
          "linear-gradient(135deg, #1a365d 0%, #2d3748 50%, #38a169 100%)",
      }}
    >
      <div className="w-full max-w-3xl bg-white rounded-2xl p-6 sm:p-12 my-4 sm:my-8"
        style={{ boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.25)" }}
      >
        {/* Voltar */}
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-sm text-[#718096] hover:text-[#1a365d] transition-colors mb-6 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38a169] rounded"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Voltar
        </button>

        {/* Header */}
        <div className="mb-8 pb-6 border-b border-[#E2E8F0]">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a365d] mb-2">
            {title}
          </h1>
          <p className="text-sm text-[#718096]">
            Última atualização: {lastUpdated}
          </p>
        </div>

        {/* Seções */}
        <div className="flex flex-col gap-8">
          {sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-base font-semibold text-[#1a365d] mb-3">
                {i + 1}. {section.title}
              </h2>
              {Array.isArray(section.content) ? (
                <ul className="flex flex-col gap-2 pl-4">
                  {section.content.map((item, j) => (
                    <li key={j} className="flex gap-2 text-sm text-[#4A5568] leading-relaxed">
                      <span className="text-[#38a169] mt-1 shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#4A5568] leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              )}
            </section>
          ))}
        </div>

        {/* Contato */}
        <div className="mt-10 p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
          <p className="text-sm text-[#166534]">
            <span className="font-semibold">Dúvidas?</span> Entre em contato com nosso Encarregado de Dados (DPO):{" "}
            <a
              href="mailto:privacidade@adqpal.com.br"
              className="underline hover:text-[#38a169] transition-colors"
            >
              privacidade@adqpal.com.br
            </a>
          </p>
        </div>

        <LgpdFooter />
      </div>
    </div>
  );
}
