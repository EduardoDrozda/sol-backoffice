import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EnviromentModule, EnviromentService } from '@common/enviroment';
import { EmailService } from './email.service';
import { getTemplatesPath, validateTemplatesPath } from './templates.utils';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [EnviromentModule],
      useFactory: (envService: EnviromentService) => {
        const templatesDir = getTemplatesPath(envService);
        console.log('templatesDir', templatesDir);
        if (!validateTemplatesPath(templatesDir)) {
          throw new Error(`Diretório de templates não encontrado: ${templatesDir}`);
        }

        return {
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
            dir: templatesDir,
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [EnviromentService],
    }),
    EnviromentModule,
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
