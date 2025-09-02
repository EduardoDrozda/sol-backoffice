import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { AuthenticationModule } from '../authentication';

@Module({
  imports: [AuthenticationModule],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
