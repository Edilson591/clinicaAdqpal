import {
  createContext,
  createElement,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

// =============================================================================
// TYPES
// =============================================================================

interface SidebarContextValue {
  isOpen: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
  toggleSidebar: () => void;
  hoverSidebar: (hovered: boolean) => void;
  toggleMobile: () => void;
  closeMobile: () => void;
}

// =============================================================================
// CONTEXT
// =============================================================================

const SidebarContext = createContext<SidebarContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = useCallback(() => setIsOpen((prev) => !prev), []);
  const hoverSidebar = useCallback((hovered: boolean) => setIsHovered(hovered), []);
  const toggleMobile = useCallback(() => setIsMobileOpen((prev) => !prev), []);
  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  return createElement(SidebarContext.Provider, {
    value: { isOpen, isHovered, isMobileOpen, toggleSidebar, hoverSidebar, toggleMobile, closeMobile },
    children,
  });
}

// =============================================================================
// HOOK
// =============================================================================

export function useSidebarContext(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx)
    throw new Error("useSidebarContext deve ser usado dentro de <SidebarProvider>");
  return ctx;
}
