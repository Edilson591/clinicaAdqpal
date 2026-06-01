import { Printer, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/Button";

interface ReceituarioToolbarProps {
  onPrint: () => void;
  onClear: () => void;
}

export function ReceituarioToolbar({ onPrint, onClear }: ReceituarioToolbarProps) {
  return (
    <div className="flex gap-2 no-print">
      <Button
        variant="primary"
        onClick={onPrint}
        className="bg-[#1565c0] from-[#1565c0] to-[#1565c0] hover:from-[#1250a0] hover:to-[#1250a0] h-10 px-4 flex items-center gap-2 shrink-0"
      >
        <Printer size={16} />
        Imprimir
      </Button>
      <Button
        variant="destructive"
        onClick={onClear}
        className="h-10 px-4 flex items-center gap-2 shrink-0"
      >
        <Trash2 size={16} />
        Limpar
      </Button>
    </div>
  );
}
