import crypto from "crypto";

const LEGACY_PREFIX = "@e:";
const PREFIX = "@e2:";

export class EncryptionService {
  private readonly algorithm = "aes-256-gcm";
  private readonly key: Buffer;
  private readonly fallbackMode: boolean;

  constructor() {
    const raw = process.env.ENCRYPTION_KEY;
    if (!raw || raw.length < 32) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("ENCRYPTION_KEY válida é obrigatória em produção.");
      }
      console.warn("[EncryptionService] ENCRYPTION_KEY ausente; fallback sem criptografia permitido apenas fora de produção.");
      this.fallbackMode = true;
      this.key = Buffer.alloc(0);
      return;
    }
    this.fallbackMode = false;
    this.key = Buffer.from(raw.length === 64 ? raw : raw.padEnd(64, "0"), "hex");
    if (this.key.length !== 32) {
      this.key = crypto.createHash("sha256").update(raw).digest();
    }
  }

  // ─── Utilitários ──────────────────────────────────────────────────────────

  /** Mantém busca exata em campos legados; a migração para blind indexes removerá essa necessidade. */
  private getNonce(plainText: string): Buffer {
    return crypto.createHmac("sha256", this.key).update(plainText).digest().subarray(0, 12);
  }

  private getLegacyIv(): Buffer {
    return crypto.createHash("md5").update(this.key).digest();
  }

  /** Checa se o valor já está criptografado (começa com o prefixo @e:) */
  isEncrypted(value: string | null | undefined): boolean {
    if (value == null) return false;
    return value.startsWith(PREFIX) || value.startsWith(LEGACY_PREFIX);
  }

  // ─── Encrypt ──────────────────────────────────────────────────────────────

  encrypt(plainText: string | null | undefined): string | null {
    if (this.fallbackMode) return plainText ?? null;
    if (plainText == null) return null;

    if (this.isEncrypted(plainText)) return plainText;
    const nonce = this.getNonce(plainText);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, nonce);
    const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${PREFIX}${nonce.toString("base64url")}.${tag.toString("base64url")}.${encrypted.toString("base64url")}`;
  }

  encryptArray(arr: string[] | null | undefined): string[] | null {
    if (arr == null) return null;
    if (this.fallbackMode) return arr;
    return arr.map((item) => this.encrypt(item) ?? item);
  }

  // ─── Decrypt ──────────────────────────────────────────────────────────────

  /**
   * Descriptografa apenas se o valor estiver marcado com o prefixo @e:.
   * Também tenta descriptografar valores no formato antigo (base64 puro sem prefixo).
   * Se for plaintext (dado nunca criptografado), retorna como está.
   */
  decrypt(cipherText: string | null | undefined): string | null {
    if (this.fallbackMode) return cipherText ?? null;
    if (cipherText == null) return null;

    if (cipherText.startsWith(PREFIX)) {
      return this.gcmDecrypt(cipherText.slice(PREFIX.length));
    }
    if (cipherText.startsWith(LEGACY_PREFIX)) {
      return this.legacyDecrypt(cipherText.slice(LEGACY_PREFIX.length));
    }

    // Formato antigo (base64 puro sem prefixo) — tenta decriptar, se falhar é plaintext
    return this.legacyDecrypt(cipherText, true);
  }

  private gcmDecrypt(payload: string): string {
    const [nonceValue, tagValue, encryptedValue] = payload.split(".");
    if (!nonceValue || !tagValue || !encryptedValue) throw new Error("Formato de dado criptografado inválido.");
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, Buffer.from(nonceValue, "base64url"));
    decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
    return Buffer.concat([
      decipher.update(Buffer.from(encryptedValue, "base64url")),
      decipher.final(),
    ]).toString("utf8");
  }

  private legacyDecrypt(payload: string, allowPlainText = false): string | null {
    try {
      const decipher = crypto.createDecipheriv("aes-256-cbc", this.key, this.getLegacyIv());
      let dec = decipher.update(payload, "base64", "utf8");
      dec += decipher.final("utf8");
      return dec;
    } catch {
      if (allowPlainText) return payload;
      throw new Error("Não foi possível autenticar o dado criptografado.");
    }
  }

  decryptArray(arr: string[] | null | undefined): string[] | null {
    if (arr == null) return null;
    if (this.fallbackMode) return arr;
    return arr.map((item) => this.decrypt(item) ?? item);
  }

  // ─── atalhos para número ─────────────────────────────────────────────────
  // Nota: salary (Decimal) não é criptografado por incompatibilidade de tipo no Prisma

  // ─── atalhos para objetos (uso interno) ───────────────────────────────────
  encryptFields<T extends Record<string, unknown>>(obj: T, fields: (keyof T)[]): T {
    const r = { ...obj };
    for (const f of fields) {
      if (r[f] != null) {
        (r as any)[f] = this.encrypt(r[f] as string | null);
      }
    }
    return r;
  }

  decryptFields<T extends Record<string, unknown>>(obj: T, fields: (keyof T)[]): T {
    const r = { ...obj };
    for (const f of fields) {
      if (r[f] != null) {
        (r as any)[f] = this.decrypt(r[f] as string | null);
      }
    }
    return r;
  }
}
