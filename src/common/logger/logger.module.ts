import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { ContextModule } from '@common/context';

@Module({
  imports: [ContextModule],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
