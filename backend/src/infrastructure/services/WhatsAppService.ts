import axios, { type AxiosError } from "axios";
import { DomainError } from "../../domain/errors/DomainError";
import { INotificationService } from "../../domain/services/INotificationService";

// =============================================================================
// EVOLUTION API SERVICE
// Docs: https://doc.evolution-api.com
// =============================================================================

export interface WhatsAppMessage {
  number: string; // international format without '+': "5511999999999"
  text: string; // text message content
}

export class WhatsAppService implements INotificationService {
  private readonly apiUrl: string;
  private readonly token: string;

  constructor() {
    const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL;
    const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;
    const INSTANCE = process.env.EVOLUTION_INSTANCE;

    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !INSTANCE) {
      throw new Error(
        "Variáveis EVOLUTION_API_URL, EVOLUTION_API_KEY e EVOLUTION_INSTANCE são obrigatórias",
      );
    }

    this.apiUrl = `${EVOLUTION_API_URL}/message/sendText/${encodeURIComponent(INSTANCE)}`;
    this.token = EVOLUTION_API_KEY;
  }

  /**
   * Normalizes a phone number to international format without '+'.
   * Accepts: +5511999999999, 5511999999999, 011999999999
   */
  static normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, "");
    const nationalNumber =
      digits.startsWith("55") && (digits.length === 12 || digits.length === 13)
        ? digits.slice(2)
        : digits;
    const withoutTrunkPrefix = nationalNumber.startsWith("0")
      ? nationalNumber.slice(1)
      : nationalNumber;
    const normalized = `55${withoutTrunkPrefix}`;

    if (!/^55\d{10,11}$/.test(normalized)) {
      throw new DomainError("Telefone inválido para envio pelo WhatsApp.", 400);
    }

    return normalized;
  }

  async sendTextMessage(message: WhatsAppMessage): Promise<void> {
    const normalizedPhone = WhatsAppService.normalizePhone(message.number);

    try {
      await axios.post(
        this.apiUrl,
        {
          number: normalizedPhone,
          text: message.text,
          delay: 1200,
          linkPreview: false,
        },
        {
          headers: {
            apikey: this.token,
            "Content-Type": "application/json",
            "skip-browser-warning": "true",
          },
          timeout: 15_000,
        },
      );
    } catch (err) {
      const axiosErr = err as AxiosError;
      let apiMessage = axiosErr.message;

      if (axiosErr.response) {
        const data =
          typeof axiosErr.response.data === "string"
            ? axiosErr.response.data
            : JSON.stringify(axiosErr.response.data, null, 2);
        apiMessage = `HTTP ${axiosErr.response.status}: ${data}`;
        console.error(
          `[WhatsApp] falha ao enviar para ${normalizedPhone}:
  status: ${axiosErr.response.status}
  data: ${data}`,
        );
      } else {
        console.error(
          `[WhatsApp] falha ao enviar para ${normalizedPhone}: ${apiMessage}`,
        );
      }

      throw new DomainError(
        `Falha ao enviar mensagem WhatsApp: ${apiMessage}`,
        502,
      );
    }
  }
}
