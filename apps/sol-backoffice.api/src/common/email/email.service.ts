import { Injectable, NotImplementedException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailTemplateEnum, EmailTypeEnum } from './email-type.enum';

export type SendEmailOptions = {
  to: string | string[];
  context?: any;
  type: EmailTypeEnum;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) { }


  async sendEmail(options: SendEmailOptions ): Promise<void> {
    const { to, type, context = {}, attachments } = options;

    const emailOptions = {
      to,
      context,
      attachments,
    }

    switch (type) {
      case EmailTypeEnum.WELCOME:
        await this.mailerService.sendMail({
          subject: 'Bem-vindo à Solúvel!',
          template: EmailTemplateEnum.WELCOME,
          ...emailOptions,
          context: {
            ...context,
            expiresUnit: context.expiresAt > 1 ? 'horas' : 'hora',
          }
        });
        break;
      case EmailTypeEnum.FORGOT_PASSWORD:
        await this.mailerService.sendMail({
          subject: 'Redefinição de Senha',
          template: EmailTemplateEnum.FORGOT_PASSWORD,
          ...emailOptions,
          context: {
            ...context,
            expiresUnit: context.expiresAt > 1 ? 'horas' : 'hora',
          }
        });
        break;
      case EmailTypeEnum.RESEND_CONFIRMATION:
        await this.mailerService.sendMail({
          subject: 'Reenvio de Confirmação de Email - Solúvel',
          template: EmailTemplateEnum.RESEND_CONFIRMATION,
          ...emailOptions,
          context: {
            ...context,
            expiresUnit: context.expiresAt > 1 ? 'horas' : 'hora',
          }
        });
        break;
      default:
        throw new NotImplementedException('Tipo de email não suportado');
    }
  }
} 