import { useState, useCallback } from "react";
import { Plus, RefreshCw, Trash2, Link2, AlertCircle, CheckCircle2 } from "lucide-react";
import { PluggyService, type PluggyItemResponse } from "../../services/Pluggy";
import { usePluggyItems, useSyncPluggyItem, useDeletePluggyItem } from "../../hooks/usePluggy";

// Carrega o widget Pluggy via CDN dinamicamente
function loadPluggyScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById("pluggy-connect-script")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = "pluggy-connect-script";
    script.src = "https://cdn.pluggy.ai/pluggy-connect/v2/pluggy-connect.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Falha ao carregar o widget Pluggy."));
    document.head.appendChild(script);
  });
}

// Abre o widget Pluggy Connect com o token fornecido
function openPluggyWidget(
  accessToken: string,
  onSuccess: (itemId: string) => void,
  onClose: () => void
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const PluggyConnect = (window as any).PluggyConnect;
  if (!PluggyConnect) {
    alert("Widget Pluggy não carregado. Tente novamente.");
    return;
  }

  const widget = new PluggyConnect({
    connectToken: accessToken,
    onSuccess: ({ item }: { item: { id: string } }) => {
      onSuccess(item.id);
    },
    onError: (error: unknown) => {
      console.error("Pluggy error:", error);
    },
    onClose,
  });

  widget.init();
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    UPDATED: { label: "Atualizado", color: "bg-[#DCFCE7] text-[#166534]" },
    UPDATING: { label: "Sincronizando", color: "bg-[#FEF9C3] text-[#854D0E]" },
    LOGIN_ERROR: { label: "Erro de login", color: "bg-[#FEE2E2] text-[#991B1B]" },
    OUTDATED: { label: "Desatualizado", color: "bg-[#FEE2E2] text-[#991B1B]" },
    WAITING_USER_INPUT: { label: "Aguardando", color: "bg-[#DBEAFE] text-[#1E40AF]" },
  };
  const { label, color } = map[status] ?? { label: status, color: "bg-[#F1F5F9] text-[#64748B]" };
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${color}`}>{label}</span>
  );
}

function ItemRow({
  item,
  onSync,
  onDelete,
  syncing,
  confirmId,
  onConfirm,
  onCancelConfirm,
}: {
  item: PluggyItemResponse;
  onSync: (id: string) => void;
  onDelete: (id: string) => void;
  syncing: boolean;
  confirmId: string | null;
  onConfirm: (id: string) => void;
  onCancelConfirm: () => void;
}) {
  const lastSync = item.lastSync
    ? new Date(item.lastSync).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Nunca";

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B]">
      {/* Logo / ícone */}
      {item.connectorLogo ? (
        <img
          src={item.connectorLogo}
          alt={item.connectorName}
          className="w-9 h-9 rounded-lg object-contain bg-white border border-[#E2E8F0] p-0.5 shrink-0"
        />
      ) : (
        <div className="w-9 h-9 rounded-lg bg-[#DBEAFE] flex items-center justify-center shrink-0">
          <Link2 size={16} className="text-[#3B82F6]" />
        </div>
      )}

      {/* Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-[13px] font-semibold text-[#1E293B] dark:text-[#F1F5F9] truncate">
          {item.connectorName}
        </span>
        <span className="text-[11px] text-[#94A3B8]">Última sync: {lastSync}</span>
      </div>

      <StatusBadge status={item.status} />

      {/* Ações */}
      <button
        onClick={() => onSync(item.pluggyItemId)}
        disabled={syncing}
        title="Sincronizar agora"
        className="p-1.5 rounded-lg text-[#64748B] hover:text-[#3B82F6] hover:bg-[#DBEAFE] transition-colors cursor-pointer disabled:opacity-40"
      >
        <RefreshCw size={15} className={syncing ? "animate-spin" : ""} />
      </button>

      {confirmId === item.pluggyItemId ? (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDelete(item.pluggyItemId)}
            className="text-[11px] font-semibold text-white bg-[#EF4444] px-2.5 py-1 rounded-lg hover:bg-[#DC2626] transition-colors cursor-pointer"
          >
            Confirmar
          </button>
          <button
            onClick={onCancelConfirm}
            className="text-[11px] text-[#64748B] px-2 py-1 rounded-lg hover:bg-[#E2E8F0] dark:hover:bg-[#334155] cursor-pointer"
          >
            Não
          </button>
        </div>
      ) : (
        <button
          onClick={() => onConfirm(item.pluggyItemId)}
          title="Desconectar"
          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );
}

export function PluggyConnect() {
  const [connecting, setConnecting] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<{ accounts: number; transactionsSynced: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: items = [], isLoading } = usePluggyItems();
  const syncMutation = useSyncPluggyItem();
  const deleteMutation = useDeletePluggyItem();

  const handleConnect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      await loadPluggyScript();
      const accessToken = await PluggyService.getConnectToken();

      openPluggyWidget(
        accessToken,
        async (itemId) => {
          // Widget success — sincroniza o item
          setSyncingId(itemId);
          try {
            const result = await syncMutation.mutateAsync(itemId);
            setSyncResult(result);
          } catch {
            setError("Erro ao sincronizar os dados do banco. Tente novamente.");
          } finally {
            setSyncingId(null);
          }
        },
        () => setConnecting(false)
      );
    } catch (err) {
      setError("Não foi possível abrir o widget Pluggy. Verifique sua conexão.");
      setConnecting(false);
    }
  }, [syncMutation]);

  const handleSync = async (pluggyItemId: string) => {
    setSyncingId(pluggyItemId);
    setError(null);
    setSyncResult(null);
    try {
      const result = await syncMutation.mutateAsync(pluggyItemId);
      setSyncResult(result);
    } catch {
      setError("Erro ao sincronizar. Tente novamente.");
    } finally {
      setSyncingId(null);
    }
  };

  const handleDelete = async (pluggyItemId: string) => {
    setConfirmId(null);
    try {
      await deleteMutation.mutateAsync(pluggyItemId);
    } catch {
      setError("Erro ao desconectar o banco. Tente novamente.");
    }
  };

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#334155] p-4 sm:p-5 flex flex-col gap-4 transition-colors duration-200">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[15px] font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
            Open Banking
          </h2>
          <p className="text-[12px] text-[#94A3B8]">
            Conecte contas bancárias para importar transações automaticamente
          </p>
        </div>
        <button
          onClick={handleConnect}
          disabled={connecting || syncMutation.isPending}
          className="flex items-center gap-2 h-9 px-3.5 rounded-lg bg-[#3B82F6] text-white text-[13px] font-semibold hover:bg-[#2563EB] transition-colors cursor-pointer disabled:opacity-60 shrink-0"
        >
          <Plus size={15} />
          Conectar banco
        </button>
      </div>

      {/* Feedback de sync */}
      {syncResult && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-[#DCFCE7] border border-[#86EFAC]">
          <CheckCircle2 size={15} className="text-[#38A169] shrink-0" />
          <span className="text-[12px] text-[#166534] font-medium">
            Sync concluído: {syncResult.accounts} conta(s), {syncResult.transactionsSynced} transação(ões) importada(s).
          </span>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-[#FEE2E2] border border-[#FCA5A5]">
          <AlertCircle size={15} className="text-[#EF4444] shrink-0" />
          <span className="text-[12px] text-[#991B1B]">{error}</span>
        </div>
      )}

      {/* Lista de itens */}
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-[#F1F5F9] dark:bg-[#0F172A] animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <Link2 size={24} className="text-[#CBD5E1]" />
          <p className="text-[12px] text-[#94A3B8]">
            Nenhum banco conectado. Clique em "Conectar banco" para começar.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onSync={handleSync}
              onDelete={handleDelete}
              syncing={syncingId === item.pluggyItemId || syncMutation.isPending}
              confirmId={confirmId}
              onConfirm={setConfirmId}
              onCancelConfirm={() => setConfirmId(null)}
            />
          ))}
        </div>
      )}

      <p className="text-[11px] text-[#CBD5E1] dark:text-[#475569] text-center">
        Powered by{" "}
        <span className="font-semibold text-[#94A3B8]">Pluggy</span> · Dados protegidos via Open Banking regulado pelo Banco Central
      </p>
    </div>
  );
}
