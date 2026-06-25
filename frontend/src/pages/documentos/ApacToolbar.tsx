import { Printer, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/Button";

interface ApacToolbarProps {
  onPrint: () => void;
  onClear: () => void;
}

export function ApacToolbar({ onPrint, onClear }: ApacToolbarProps) {
  return (
    <div className="flex flex-col gap-2 no-print sm:flex-row">
      <Button
        variant="primary"
        onClick={onPrint}
        className="bg-[#1565c0] from-[#1565c0] to-[#1565c0] hover:from-[#1250a0] hover:to-[#1250a0] h-10 px-4 flex items-center justify-center gap-2 shrink-0"
      >
        <Printer size={16} />
        Imprimir
      </Button>
      <Button
        variant="destructive"
        onClick={onClear}
        className="h-10 px-4 flex items-center justify-center gap-2 shrink-0"
      >
        <Trash2 size={16} />
        Limpar
      </Button>
    </div>
  );
}
