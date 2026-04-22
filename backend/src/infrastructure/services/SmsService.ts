import twilio from "twilio";

export class SmsService {
  private readonly client: ReturnType<typeof twilio>;
  private readonly fromNumber: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error(
        "Variáveis de ambiente TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN e TWILIO_FROM_NUMBER são obrigatórias"
      );
    }

    this.client = twilio(accountSid, authToken);
    this.fromNumber = fromNumber;
  }

  static normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("0")) return `+55${digits.slice(1)}`;
    if (digits.length <= 11) return `+55${digits}`;
    return `+${digits}`;
  }

  async sendSms(to: string, body: string): Promise<void> {
    const normalized = SmsService.normalizePhone(to);
    await this.client.messages.create({
      from: this.fromNumber,
      to: normalized,
      body,
    });
  }
}
