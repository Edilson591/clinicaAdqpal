type StatusType = "Confirmada" | "Em Andamento" | "Pendente";

interface Appointment {
  horario: string;
  paciente: string;
  status: StatusType;
}

const agendaData: Appointment[] = [
  { horario: "08:00", paciente: "Maria Oliveira", status: "Confirmada" },
  { horario: "09:40", paciente: "Carlos Pereira", status: "Em Andamento" },
  { horario: "11:00", paciente: "Ana Souza", status: "Pendente" },
  { horario: "14:30", paciente: "João Marcon", status: "Confirmada" },
  { horario: "12:30", paciente: "Fernanda Lima", status: "Pendente" },
];

// Status badge — Pendente muda no dark (pen: #334155 bg, #94A3B8 text)
const statusStyles: Record<StatusType, string> = {
  Confirmada: "bg-[#38A169] text-white",
  "Em Andamento": "bg-blue-500 text-white",
  Pendente:
    "bg-[#E5E7EB] text-[#6B7280] dark:bg-[#334155] dark:text-[#94A3B8]",
};

function StatusBadge({ status }: { status: StatusType }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-25 h-7 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

export function AgendaTable() {
  return (
    // pen: jBwnl · bg #FFFFFF light · #1E293B dark · border #E5E7EB/#334155
    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E5E7EB] dark:border-[#334155] overflow-hidden transition-colors duration-200">
      <div className="px-6 py-5 border-b border-[#E5E7EB] dark:border-[#334155]">
        <h2 className="text-base font-semibold text-[#1C2B3A] dark:text-[#F1F5F9]">
          Agenda do Dia
        </h2>
      </div>

      {/* Table header — pen: CYc32 · #F9FAFB light · #263548 dark */}
      <div className="grid grid-cols-[80px_1fr_120px_4px_140px] items-center px-6 py-3 bg-[#F9FAFB] dark:bg-[#263548] border-b border-[#E5E7EB] dark:border-[#334155]">
        {["Horário", "Paciente", "Status", "", "Ações"].map((col, i) => (
          <span
            key={i}
            className={`text-xs font-medium text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wide ${i >= 2 ? "text-center" : ""}`}
          >
            {col}
          </span>
        ))}
      </div>

      {/* Rows */}
      {agendaData.map((item, i) => (
        <div
          key={i}
          className="grid grid-cols-[80px_1fr_120px_4px_140px] items-center px-6 py-4 border-b border-[#F3F4F6] dark:border-[#334155] last:border-0 hover:bg-[#F9FAFB] dark:hover:bg-[#263548] transition-colors"
        >
          <span className="text-sm font-medium text-[#374151] dark:text-[#F1F5F9]">
            {item.horario}
          </span>
          <span className="text-sm text-[#374151] dark:text-[#CBD5E1]">
            {item.paciente}
          </span>
          <div className="flex justify-center">
            <StatusBadge status={item.status} />
          </div>
          <span />
          <div className="flex justify-center">
            <button className="text-xs font-medium text-[#38A169] border border-[#38A169] rounded-lg px-4 py-2 hover:bg-[#38A169] hover:text-white transition-colors whitespace-nowrap cursor-pointer">
              Ver Prontuário
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
