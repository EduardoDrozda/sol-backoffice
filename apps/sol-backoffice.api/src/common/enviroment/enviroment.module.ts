import { Module } from '@nestjs/common';
import { EnviromentService } from './enviroment.service';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';
import { validate } from './config-schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        // Em produção, carrega do diretório atual (dist)
        path.resolve(process.cwd(), '.env'),
        // Em desenvolvimento, carrega do diretório da API
        path.resolve(process.cwd(), 'apps/sol-backoffice.api/.env'),
        // Fallback para outros casos
        path.resolve(__dirname, '..', '..', '..', '..', '.env'),
      ],
      validate,
      isGlobal: true,
    }),
  ],
  providers: [EnviromentService],
  exports: [EnviromentService],
})
export class EnviromentModule {}
