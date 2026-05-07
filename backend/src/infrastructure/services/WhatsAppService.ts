import axios, { type AxiosError } from "axios";
import { DomainError } from "../../domain/errors/DomainError";
import { INotificationService } from "../../domain/services/INotificationService";

// =============================================================================
// WHATSAPP CLOUD API SERVICE
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api
// =============================================================================

export interface WhatsAppMessage {
  to: string; // international format without '+': "5511999999999"
  body: string; // text message content
}

export class WhatsAppService implements INotificationService {
  private readonly apiUrl: string;
  private readonly token: string;

  constructor() {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const token = process.env.WHATSAPP_TOKEN;
    const version = process.env.WHATSAPP_API_VERSION ?? "v17.0";

    if (!phoneNumberId || !token) {
      throw new Error(
        "Variáveis de ambiente WHATSAPP_PHONE_NUMBER_ID e WHATSAPP_TOKEN são obrigatórias",
      );
    }

    this.apiUrl = `https://graph.facebook.com/${version}/${phoneNumberId}/messages`;
    this.token = token;
  }

  /**
   * Normalizes a phone number to international format without '+'.
   * Accepts: +5511999999999, 5511999999999, 011999999999
   */
  static normalizePhone(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, "");
    // If starts with 0, replace leading 0 with Brazil country code 55
    if (digits.startsWith("0")) return `55${digits.slice(1)}`;
    // If doesn't have country code (less than 12 digits for BR), prepend 55
    if (digits.length <= 11) return `55${digits}`;
    return digits;
  }

  async sendTextMessage(message: WhatsAppMessage): Promise<void> {
    const normalizedPhone = WhatsAppService.normalizePhone(message.to);

    try {
      await axios.post(
        this.apiUrl,
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: normalizedPhone,
          type: "text",
          text: { preview_url: false, body: message.body },
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
          timeout: 10_000,
        },
      );
    } catch (err) {
      const axiosErr = err as AxiosError<{ error?: { message?: string } }>;
      const apiMessage =
        axiosErr.response?.data?.error?.message ?? axiosErr.message;
      console.error(
        `[WhatsApp] falha ao enviar para ${normalizedPhone}: ${apiMessage}`,
      );
      throw new DomainError(
        `Falha ao enviar mensagem WhatsApp: ${apiMessage}`,
        502,
      );
    }
  }
}
