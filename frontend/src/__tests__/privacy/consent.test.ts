import { beforeEach, describe, expect, it } from "vitest";
import {
  CONSENT_POLICY_VERSION,
  CONSENT_STORAGE_KEY,
  hasConsent,
  loadConsentedScript,
  readConsent,
} from "../../privacy/consent";

beforeEach(() => {
  localStorage.clear();
  document.head.innerHTML = "";
});

describe("consentimento", () => {
  it("não presume consentimento opcional", () => {
    expect(readConsent()).toBeNull();
    expect(hasConsent("analytics")).toBe(false);
    expect(hasConsent("marketing")).toBe(false);
  });

  it("invalida decisão de versão antiga", () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
      policyVersion: "old",
      decidedAt: new Date().toISOString(),
    }));
    expect(readConsent()).toBeNull();
  });

  it("só carrega terceiro após autorização da categoria", () => {
    expect(loadConsentedScript({ category: "analytics", id: "analytics", src: "https://example.com/a.js" })).toBeNull();
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: false,
      personalization: false,
      policyVersion: CONSENT_POLICY_VERSION,
      decidedAt: new Date().toISOString(),
    }));
    expect(loadConsentedScript({ category: "analytics", id: "analytics", src: "https://example.com/a.js" })).not.toBeNull();
    expect(document.getElementById("analytics")).not.toBeNull();
  });
});
