import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import type { UserRow } from "../../hooks/useUsersPage";

interface UsersTableProps {
  users: UserRow[];
  isLoading: boolean;
  confirmDeleteId: string | null;
  onRequestDelete: (id: string) => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  isDeleting: boolean;
}

const ROLE_COLORS: Record<number, string> = {
  1: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  3: "bg-green-100 text-green-700 dark:bg-[#1E3A2F] dark:text-[#38A169]",
  5: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const DEFAULT_ROLE_COLOR =
  "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";

export function UsersTable({
  users,
  isLoading,
  confirmDeleteId,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
  isDeleting,
}: UsersTableProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E5E7EB] dark:border-[#334155] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="">
              <tr className="border-b border-[#E5E7EB] dark:border-[#334155]  dark:bg-[#0F172A]">
                <th className="text-left px-4 sm:px-5 py-3 font-medium text-[#64748B] dark:text-[#94A3B8]">Usuário</th>
                <th className="hidden sm:table-cell text-left px-5 py-3 font-medium text-[#64748B] dark:text-[#94A3B8]">E-mail</th>
                <th className="text-left px-4 sm:px-5 py-3 font-medium text-[#64748B] dark:text-[#94A3B8]">Perfil</th>
                <th className="hidden lg:table-cell text-left px-5 py-3 font-medium text-[#64748B] dark:text-[#94A3B8]">Membro desde</th>
                <th className="text-right px-4 sm:px-5 py-3 font-medium text-[#64748B] dark:text-[#94A3B8]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#334155]">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 sm:px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#E2E8F0] dark:bg-[#334155] shrink-0" />
                      <div className="h-4 w-32 bg-[#E2E8F0] dark:bg-[#334155] rounded" />
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-5 py-3.5">
                    <div className="h-4 w-44 bg-[#E2E8F0] dark:bg-[#334155] rounded" />
                  </td>
                  <td className="px-4 sm:px-5 py-3.5">
                    <div className="h-5 w-20 bg-[#E2E8F0] dark:bg-[#334155] rounded-full" />
                  </td>
                  <td className="hidden lg:table-cell px-5 py-3.5">
                    <div className="h-4 w-24 bg-[#E2E8F0] dark:bg-[#334155] rounded" />
                  </td>
                  <td className="px-4 sm:px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <div className="h-7 w-12 bg-[#E2E8F0] dark:bg-[#334155] rounded-lg" />
                      <div className="h-7 w-16 bg-[#E2E8F0] dark:bg-[#334155] rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E5E7EB] dark:border-[#334155] p-12 flex flex-col items-center gap-2">
        <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">
          Nenhum usuário encontrado.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E5E7EB] dark:border-[#334155] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E5E7EB] dark:border-[#334155] dark:bg-[#0F172A]">
              <th className="text-left px-4 sm:px-5 py-3 font-medium text-[#64748B] dark:text-[#94A3B8]">
                Usuário
              </th>
              {/* E-mail — oculto em xs */}
              <th className="hidden sm:table-cell text-left px-5 py-3 font-medium text-[#64748B] dark:text-[#94A3B8]">
                E-mail
              </th>
              <th className="text-left px-4 sm:px-5 py-3 font-medium text-[#64748B] dark:text-[#94A3B8]">
                Perfil
              </th>
              {/* Membro desde — oculto em mobile */}
              <th className="hidden lg:table-cell text-left px-5 py-3 font-medium text-[#64748B] dark:text-[#94A3B8]">
                Membro desde
              </th>
              <th className="text-right px-4 sm:px-5 py-3 font-medium text-[#64748B] dark:text-[#94A3B8]">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#334155]">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A]/50 transition-colors"
              >
                {/* Usuário */}
                <td className="px-4 sm:px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#38A169] flex items-center justify-center shrink-0">
                      <span className="text-white text-xs font-bold uppercase">
                        {user.username.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-[#1E293B] dark:text-[#F1F5F9] truncate">
                        {user.username}
                      </p>
                      {/* E-mail embaixo do nome em xs */}
                      <p className="sm:hidden text-xs text-[#94A3B8] truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* E-mail — oculto em xs */}
                <td className="hidden sm:table-cell px-5 py-3.5 text-[#64748B] dark:text-[#94A3B8] max-w-50">
                  <span className="truncate block">{user.email}</span>
                </td>

                {/* Perfil */}
                <td className="px-4 sm:px-5 py-3.5">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                      ROLE_COLORS[user.roleId] ?? DEFAULT_ROLE_COLOR
                    }`}
                  >
                    {user.roleLabel}
                  </span>
                </td>

                {/* Membro desde — oculto em mobile */}
                <td className="hidden lg:table-cell px-5 py-3.5 text-[#64748B] dark:text-[#94A3B8] whitespace-nowrap">
                  {user.memberSince}
                </td>

                {/* Ações */}
                <td className="px-4 sm:px-5 py-3.5">
                  {confirmDeleteId === user.id ? (
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      <span className="hidden sm:inline text-xs text-[#64748B] dark:text-[#94A3B8]">
                        Confirmar?
                      </span>
                      <Button
                        variant="ghost"
                        onClick={onConfirmDelete}
                        disabled={isDeleting}
                        className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                      >
                        {isDeleting ? "..." : "Sim"}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={onCancelDelete}
                        className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#E5E7EB] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F3F4F6] dark:hover:bg-[#263548] transition-colors"
                      >
                        Não
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/configuracoes/usuarios/${user.id}/editar`)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#38A169] text-[#38A169] hover:bg-[#E6F5ED] dark:hover:bg-[#1E3A2F] transition-colors"
                      >
                        Ver
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => onRequestDelete(user.id)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-400 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Excluir
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
