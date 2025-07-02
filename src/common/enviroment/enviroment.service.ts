import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvSchema } from './config-schema';

@Injectable()
export class EnviromentService {
  constructor(
    private readonly configService: ConfigService
  ) {}

  get(key: keyof EnvSchema) {
    return this.configService.get(key);
  }
}
