import { createContext, useContext, type ReactNode } from "react";
import type { ConsentPreferences, OptionalConsentCategory } from "../privacy/consent";

export interface ConsentContextValue {
  consent: ConsentPreferences | null;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  acceptAll: () => void;
  rejectOptional: () => void;
  savePreferences: (preferences: Record<OptionalConsentCategory, boolean>) => void;
}

export const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);
  if (!context) throw new Error("useConsent deve ser usado dentro de ConsentProvider");
  return context;
}

export type ConsentProviderProps = { children: ReactNode };
