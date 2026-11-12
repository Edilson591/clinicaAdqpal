import { useState } from "react";
import { ConsentContext, type ConsentProviderProps } from "./ConsentContext";
import {
  CONSENT_POLICY_VERSION,
  CONSENT_STORAGE_KEY,
  readConsent,
  type ConsentPreferences,
  type OptionalConsentCategory,
} from "../privacy/consent";
import { ConsentBanner } from "../components/privacy/ConsentBanner";
import { ConsentSettings } from "../components/privacy/ConsentSettings";

export function ConsentProvider({ children }: ConsentProviderProps) {
  const [consent, setConsent] = useState<ConsentPreferences | null>(readConsent);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const persist = (optional: Record<OptionalConsentCategory, boolean>) => {
    const next: ConsentPreferences = {
      necessary: true,
      ...optional,
      policyVersion: CONSENT_POLICY_VERSION,
      decidedAt: new Date().toISOString(),
    };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
    setConsent(next);
    setSettingsOpen(false);
    window.dispatchEvent(new CustomEvent("adqpal:consent-changed", { detail: next }));
  };

  return (
    <ConsentContext.Provider
      value={{
        consent,
        isSettingsOpen,
        openSettings: () => setSettingsOpen(true),
        closeSettings: () => setSettingsOpen(false),
        acceptAll: () => persist({ analytics: true, marketing: true, personalization: true }),
        rejectOptional: () => persist({ analytics: false, marketing: false, personalization: false }),
        savePreferences: persist,
      }}
    >
      {children}
      {!consent && <ConsentBanner />}
      {consent && !isSettingsOpen && (
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="fixed bottom-3 right-3 z-[90] min-h-11 rounded-full border border-slate-300 bg-white px-4 text-xs font-bold text-slate-800 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2"
        >
          Privacidade
        </button>
      )}
      {isSettingsOpen && <ConsentSettings />}
    </ConsentContext.Provider>
  );
}
