import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { AppModule } from './app.module';
import { EnviromentService } from '@common/enviroment';
import { LoggerService } from '@common/logger';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

export class Application {
  private server!: INestApplication<AppModule>;
  private enviromentService!: EnviromentService;
  private loggerService!: LoggerService;
  private readonly prefix: string = 'api';

  async startup(): Promise<void> {
    await this.setupApplication();
    await this.setGlobalScopes();

    const port = this.enviromentService.get('APP_PORT') || 3000;

    await this.server.listen(port).catch((error) => {
      console.log(error);
      this.loggerService.error(
        `Failed to start server on port ${port} - ${error.message}`,
      );
      process.exit(1);
    });

    this.loggerService.log(`Server is running on port ${port}`);
  }

  private async setupApplication(): Promise<void> {
    this.server = await NestFactory.create(AppModule);
    this.enviromentService = this.server.get(EnviromentService);
    this.loggerService = this.server.get(LoggerService);

    this.loggerService.context = Application.name;
  }

  private async setGlobalScopes(): Promise<void> {
    this.server.setGlobalPrefix(this.prefix);

    this.server.enableCors({
      origin: this.enviromentService.get('CORS_ORIGIN'),
      credentials: this.enviromentService.get('CORS_CREDENTIALS'),
    });

    this.server.use(cookieParser(this.enviromentService.get('COOKIE_NAME')));

    this.server.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    this.server.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        disableErrorMessages:
          this.enviromentService.get('NODE_ENV') === 'production',
      }),
    );

    this.server.useLogger(this.loggerService);
  }
}
