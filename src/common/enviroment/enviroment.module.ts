import { Module } from '@nestjs/common';
import { EnviromentService } from './enviroment.service';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';
import { validate } from './config-schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [path.resolve(__dirname, '..', '..', '..', '..', '.env')],
      validate,
      isGlobal: true,
    }),
  ],
  providers: [EnviromentService],
  exports: [EnviromentService]
})
export class EnviromentModule {}
