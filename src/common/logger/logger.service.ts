import { ContextService } from '@common/context';
import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private readonly logger: ConsoleLogger;

  constructor(private readonly contextService: ContextService) {
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
    this.logger.log(this.buildMessage(message));
  }

  error(message: string): void {
    this.logger.error(this.buildMessage(message));
  }

  debug(message: string): void {
    this.logger.debug(this.buildMessage(message));
  }

  warn(message: string): void {
    this.logger.warn(this.buildMessage(message));
  }

  fatal(message: string): void {
    this.logger.fatal(this.buildMessage(message));
  }

  private buildMessage(message: string): string {
    const user = this.contextService.getUser();

    if (user) {
      return `[${user.companyId}]: ${message}`;
    }

    return message;
  }
}
