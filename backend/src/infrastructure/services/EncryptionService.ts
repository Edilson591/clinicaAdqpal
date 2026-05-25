import crypto from "crypto";

const PREFIX = "@e:";

export class EncryptionService {
  private readonly algorithm = "aes-256-cbc";
  private readonly key: Buffer;
  private readonly fallbackMode: boolean;

  constructor() {
    const raw = process.env.ENCRYPTION_KEY;
    if (!raw || raw.length < 32) {
      console.warn("[EncryptionService] ENCRYPTION_KEY não configurada ou muito curta. Usando fallback (dados NÃO criptografados).");
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

  /** Retorna IV determinístico derivado da chave (CBC precisa de IV fixo p/ busca exata) */
  private getIv(): Buffer {
    return crypto.createHash("md5").update(this.key).digest();
  }

  /** Checa se o valor já está criptografado (começa com o prefixo @e:) */
  isEncrypted(value: string | null | undefined): boolean {
    if (value == null) return false;
    return value.startsWith(PREFIX);
  }

  // ─── Encrypt ──────────────────────────────────────────────────────────────

  encrypt(plainText: string | null | undefined): string | null {
    if (this.fallbackMode) return plainText ?? null;
    if (plainText == null) return null;

    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.getIv());
    let enc = cipher.update(plainText, "utf8", "base64");
    enc += cipher.final("base64");
    return PREFIX + enc;
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

    // Novo formato: prefixo @e:
    if (this.isEncrypted(cipherText)) {
      return this.aesDecrypt(cipherText.slice(PREFIX.length));
    }

    // Formato antigo (base64 puro sem prefixo) — tenta decriptar, se falhar é plaintext
    return this.aesDecrypt(cipherText);
  }

  private aesDecrypt(payload: string): string | null {
    try {
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.getIv());
      let dec = decipher.update(payload, "base64", "utf8");
      dec += decipher.final("utf8");
      return dec;
    } catch {
      return payload;
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
