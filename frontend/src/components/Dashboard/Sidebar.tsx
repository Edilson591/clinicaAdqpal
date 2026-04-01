import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  DollarSign 
} from "lucide-react";

// =============================================================================
// NAV ITEMS (matches design node 34qfs)
// =============================================================================

export const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Pacientes", icon: Users, path: "/pacientes" },
  { label: "Agenda", icon: Calendar, path: "/agenda" },
  { label: "Prontuários", icon: FileText, path: "/prontuarios" },
  { label: "Financeiro", icon: DollarSign, path: "/financeiro" },
  { label: "Configurações", icon: Settings, path: "/configuracoes" },
];
