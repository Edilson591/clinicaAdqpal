import { useState } from "react";
import { X, Calendar, Clock, User, Stethoscope, FileText } from "lucide-react";
import type {
  AppointmentResponse,
  AppointmentStatus,
  PatientResponse,
  UserResponse,
} from "../../types/api";
import { useUpdateAppointment } from "../../hooks/useAppointments";
import { Button } from "../ui/Button";

interface Props {
  appointment: AppointmentResponse;
  patient: PatientResponse | undefined;
  doctor: UserResponse | undefined;
  showDoctor: boolean;
  onClose: () => void;
}

const STATUS_OPTIONS: {
  value: AppointmentStatus;
  label: string;
  bg: string;
  text: string;
}[] = [
  {
    value: "SCHEDULED",
    label: "Agendada",
    bg: "bg-[#DBEAFE]",
    text: "text-[#1D4ED8]",
  },
  {
    value: "CONFIRMED",
    label: "Confirmado",
    bg: "bg-[#DBEAFE]",
    text: "text-[#1D4ED8]",
  },
  {
    value: "COMPLETED",
    label: "Concluída",
    bg: "bg-[#DCFCE7]",
    text: "text-[#166534]",
  },
  {
    value: "CANCELLED",
    label: "Cancelada",
    bg: "bg-[#FEE2E2]",
    text: "text-[#991B1B]",
  },
];

export function AppointmentDetailModal({
  appointment,
  patient,
  doctor,
  showDoctor,
  onClose,
}: Props) {
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus>(
    appointment.status,
  );
  const updateMutation = useUpdateAppointment();

  const scheduledDate = new Date(appointment.scheduledAt);

  const dateStr = scheduledDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const timeStr = scheduledDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });

  const currentStatus = STATUS_OPTIONS.find(
    (s) => s.value === appointment.status,
  )!;

  // console.log(appointment);
  // console.log(STATUS_OPTIONS);
  const handleSave = () => {
    if (selectedStatus === appointment.status) {
      onClose();
      return;
    }

    updateMutation.mutate(
      { id: appointment.id, data: { status: selectedStatus } },
      { onSuccess: onClose },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0] dark:border-[#334155]">
          <h2 className="text-lg font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
            Detalhes da Consulta
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0 text-[#94A3B8] hover:opacity-80 transition-colors"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Status atual */}
          <span
            className={`self-start px-3 py-1 rounded-full text-xs font-medium ${currentStatus.bg} ${currentStatus.text}`}
          >
            {currentStatus.label}
          </span>

          {/* Paciente */}
          <div className="flex items-start gap-3">
            <User size={18} className="text-[#64748B] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Paciente
              </p>
              <p className="text-sm font-medium text-[#1E293B] dark:text-[#F1F5F9]">
                {patient?.name ?? "—"}
              </p>
            </div>
          </div>

          {/* Médico (condicional por role) */}
          {showDoctor && (
            <div className="flex items-start gap-3">
              <Stethoscope
                size={18}
                className="text-[#64748B] mt-0.5 shrink-0"
              />
              <div>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  Médico
                </p>
                <p className="text-sm font-medium text-[#1E293B] dark:text-[#F1F5F9]">
                  {doctor?.username ?? "—"}
                </p>
              </div>
            </div>
          )}

          {/* Data */}
          <div className="flex items-start gap-3">
            <Calendar size={18} className="text-[#64748B] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Data</p>
              <p className="text-sm font-medium text-[#1E293B] dark:text-[#F1F5F9]">
                {dateStr}
              </p>
            </div>
          </div>

          {/* Horário */}
          <div className="flex items-start gap-3">
            <Clock size={18} className="text-[#64748B] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Horário
              </p>
              <p className="text-sm font-medium text-[#1E293B] dark:text-[#F1F5F9]">
                {timeStr}
              </p>
            </div>
          </div>

          {/* Observações */}
          {appointment.notes && (
            <div className="flex items-start gap-3">
              <FileText size={18} className="text-[#64748B] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  Observações
                </p>
                <p className="text-sm text-[#1E293B] dark:text-[#F1F5F9]">
                  {appointment.notes}
                </p>
              </div>
            </div>
          )}

          {/* Alterar status */}
          <div className="border-t border-[#E2E8F0] dark:border-[#334155] pt-4">
            <p className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8] mb-3">
              Alterar status
            </p>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedStatus(opt.value)}
                  className={`flex-1 py-2 cursor-pointer rounded-lg text-xs font-medium border transition-colors ${
                    selectedStatus === opt.value
                      ? `${opt.bg} ${opt.text} border-transparent`
                      : "border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F8FAFC] dark:hover:bg-[#263548]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-11 px-6 flex-1 rounded-lg text-sm font-medium border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:opacity-80 disabled:opacity-50 transition-all cursor-pointer"
          >
            Fechar
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="bg-[#38A169] flex-1 from-[#38A169] to-[#38A169] hover:from-[#2F9259] hover:to-[#2F9259] h-11 px-5"
          >
            {updateMutation.isPending ? "Salvando..." : "Confirmar"}
          </Button>
          {/* <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="flex-1 py-2.5 rounded-lg bg-[#38A169] hover:bg-[#2F9259] disabled:opacity-60 text-sm font-medium text-white transition-colors"
          >
            {updateMutation.isPending ? "Salvando..." : "Confirmar"}
          </button> */}
        </div>
      </div>
    </div>
  );
}
