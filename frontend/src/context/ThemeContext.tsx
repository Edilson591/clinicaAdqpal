import { createContext, useContext } from "react";
import type { ThemeContextValue } from "./ThemeProvider";

// =============================================================================
// Paleta extraída de design/paciente.pen
// =============================================================================

// =============================================================================
// Context
// =============================================================================

export const ThemeContext = createContext<ThemeContextValue | null>(null);

// =============================================================================
// Provider
// =============================================================================

// =============================================================================
// Hook
// =============================================================================

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error("useTheme deve ser usado dentro de <ThemeProvider>");
  return ctx;
}
