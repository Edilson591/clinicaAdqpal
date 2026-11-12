export const CONSENT_POLICY_VERSION = "2026-11-12";
export const CONSENT_STORAGE_KEY = "adqpal_consent";

export type OptionalConsentCategory = "analytics" | "marketing" | "personalization";

export interface ConsentPreferences {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  policyVersion: string;
  decidedAt: string;
}

export function readConsent(): ConsentPreferences | null {
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<ConsentPreferences>;
    if (parsed.policyVersion !== CONSENT_POLICY_VERSION || parsed.necessary !== true) return null;
    if (typeof parsed.decidedAt !== "string") return null;
    return {
      necessary: true,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      personalization: parsed.personalization === true,
      policyVersion: CONSENT_POLICY_VERSION,
      decidedAt: parsed.decidedAt,
    };
  } catch {
    return null;
  }
}

export function hasConsent(category: OptionalConsentCategory): boolean {
  return readConsent()?.[category] === true;
}

export function loadConsentedScript(options: {
  category: OptionalConsentCategory;
  src: string;
  id: string;
  integrity?: string;
}): HTMLScriptElement | null {
  if (!hasConsent(options.category) || document.getElementById(options.id)) return null;
  const script = document.createElement("script");
  script.id = options.id;
  script.src = options.src;
  script.async = true;
  script.referrerPolicy = "no-referrer";
  if (options.integrity) {
    script.integrity = options.integrity;
    script.crossOrigin = "anonymous";
  }
  document.head.appendChild(script);
  return script;
}
