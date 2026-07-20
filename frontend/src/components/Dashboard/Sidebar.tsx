import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  DollarSign,
  Briefcase,
  UserCog,
  ClipboardList,
  FilePlus,
  FileSignature,
  Files,
  HandCoins,
  // Receipt,
  type LucideIcon,
} from "lucide-react";

// =============================================================================
// NAV ITEMS (matches design node 34qfs)
// =============================================================================

export interface NavChild {
  label: string;
  icon: LucideIcon;
  path: string;
}

export interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  adminOnly?: boolean;
  financialOnly?: boolean;
  rhOnly?: boolean;
  children?: NavChild[];
}

export const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Pacientes", icon: Users, path: "/pacientes" },
  { label: "Agenda", icon: Calendar, path: "/agenda" },
  { label: "Prontuários", icon: FileText, path: "/prontuarios" },
  {
    label: "Documentos",
    icon: ClipboardList,
    path: "/documentos",
    adminOnly: true,
    children: [
      { label: "Laudo APAC", icon: FilePlus, path: "/documentos/apac" },
      { label: "Receituário", icon: FileSignature, path: "/documentos/receituario" },
      { label: "Administrativo", icon: Files, path: "/documentos/administrativo" },
    ],
  },
  { label: "Financeiro", icon: DollarSign, path: "/financeiro", financialOnly: true },
  { label: "Filiação", icon: HandCoins, path: "/filiacao", financialOnly: true },
  // { label: "Notas Fiscais", icon: Receipt, path: "/notas-fiscais" },
  { label: "Recursos Humanos", icon: Briefcase, path: "/rh", rhOnly: true },
  {
    label: "Configurações",
    icon: Settings,
    path: "/configuracoes",
    children: [
      { label: "Usuários", icon: UserCog, path: "/configuracoes/usuarios" },
    ],
  },
];
