import { Bell } from "lucide-react";
import { Toggle } from "./Toggle";

interface NotificacoesSectionProps {
  lembretes: boolean;
  pacientes: boolean;
  sistema: boolean;
  onLembretesChange: (v: boolean) => void;
  onPacientesChange: (v: boolean) => void;
  onSistemaChange: (v: boolean) => void;
}

interface NotifRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function NotifRow({ label, description, checked, onChange }: NotifRowProps) {
  return (
    // pen: 06R3S / 7rawr / y4LZo · space_between · alignItems center
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm text-[#1E293B] dark:text-[#F1F5F9]">{label}</p>
        {description && (
          <p className="text-xs text-[#94A3B8] dark:text-[#64748B] mt-0.5">{description}</p>
        )}
      </div>
      <Toggle checked={checked} onChange={onChange} ariaLabel={label} />
    </div>
  );
}

export function NotificacoesSection({
  lembretes,
  pacientes,
  sistema,
  onLembretesChange,
  onPacientesChange,
  onSistemaChange,
}: NotificacoesSectionProps) {
  return (
    <section className="flex flex-col gap-2">
      {/* pen: FkCZf */}
      <div className="flex items-center gap-2 mb-2">
        <Bell size={18} className="text-[#38A169]" />
        <h2 className="text-lg font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
          Notificações
        </h2>
      </div>

      {/* pen: 06R3S · "Lembretes de consultas" */}
      <NotifRow
        label="Lembretes de consultas"
        description="Receber alertas antes das consultas agendadas"
        checked={lembretes}
        onChange={onLembretesChange}
      />

      <div className="h-px bg-[#F1F5F9] dark:bg-[#334155]" />

      {/* pen: 7rawr · "Novos pacientes" */}
      <NotifRow
        label="Novos pacientes"
        description="Notificar ao cadastrar novos pacientes"
        checked={pacientes}
        onChange={onPacientesChange}
      />

      <div className="h-px bg-[#F1F5F9] dark:bg-[#334155]" />

      {/* pen: y4LZo · "Alertas de sistema" */}
      <NotifRow
        label="Alertas de sistema"
        description="Avisos sobre manutenção e atualizações"
        checked={sistema}
        onChange={onSistemaChange}
      />
    </section>
  );
}
