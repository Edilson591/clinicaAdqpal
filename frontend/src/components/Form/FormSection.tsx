import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface FormSectionProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}

export function FormSection({ icon: Icon, title, children }: FormSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-[#38A169]" />
        <h3 className="text-lg font-semibold text-[#1E293B] dark:text-[#F1F5F9]">{title}</h3>
      </div>
      {children}
    </div>
  );
}
