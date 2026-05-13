import { IMailService } from "../../domain/services/IMailService";
import nodemailer from "nodemailer";
import resetPasswordTemplate from "../mail/templates/ResetPasswordTemplate";
import { User } from "../../domain/entities/User";

export class MailService implements IMailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true se usar 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  async sendPasswordResetEmail(email: string, token: string, user: Pick<User, "username">): Promise<void> {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const html = resetPasswordTemplate({
      name: user.username ?? "Usuário",
      link: resetLink,
      logoUrl: `${process.env.FRONTEND_URL}/logo-adqpal.png`,
    });

    await this.transporter.sendMail({
      from: `"Suporte ADQPAL" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Redefinição de senha",
      html
    });
  }
}
