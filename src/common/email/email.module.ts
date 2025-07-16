import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EnviromentModule, EnviromentService } from '@common/enviroment';
import { EmailService } from './email.service';
import * as path from 'node:path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [EnviromentModule],
      useFactory: (envService: EnviromentService) => ({
        transport: {
          host: envService.get('EMAIL_HOST'),
          port: envService.get('EMAIL_PORT'),
          secure: envService.get('EMAIL_SECURE'),
          auth: {
            user: envService.get('EMAIL_USER'),
            pass: envService.get('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"${envService.get('EMAIL_FROM_NAME')}" <${envService.get('EMAIL_FROM_ADDRESS')}>`,
        },
        template: {
          dir: path.join(process.cwd(), './src/common/email/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [EnviromentService],
    }),
    EnviromentModule,
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {} 