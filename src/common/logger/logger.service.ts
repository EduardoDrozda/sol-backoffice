import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private readonly logger: ConsoleLogger;

  constructor() {
    this.logger = new ConsoleLogger({
      json: true,
      timestamp: true,
      colors: true,
    });
  }

  set context(context: string) {
    this.logger.setContext(context);
  }

  log(message: string): void {
    this.logger.log(message);
  }

  error(message: string): void {
    this.logger.error(message);
  }

  debug(message: string): void {
    this.logger.debug(message);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  fatal(message: string): void {
    this.logger.fatal(message);
  }
}
