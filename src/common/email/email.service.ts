import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  template: string;
  context?: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(to: string | string[], context?: Record<string, any>): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Bem-vindo à Solúvel!',
      template: 'welcome',
      context,
    });
  }

   private async sendEmail(options: SendEmailOptions): Promise<void> {
    const { to, subject, template, context = {}, attachments } = options;

    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
      attachments,
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Redefinição de Senha',
      template: 'password-reset',
      context: {
        resetUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`,
        expiresIn: '1 hora',
      },
    });
  }

  async sendNotificationEmail(to: string, title: string, message: string): Promise<void> {
    await this.sendEmail({
      to,
      subject: title,
      template: 'notification',
      context: {
        title,
        message,
      },
    });
  }
} 