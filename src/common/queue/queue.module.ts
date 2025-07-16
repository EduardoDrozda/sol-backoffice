import { BullModule } from '@nestjs/bullmq';
import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueEmailProducer } from './email/producers';
import { QueueEmailConsumer } from './email/consumers';
import { EmailModule } from '@common/email';
import { LoggerModule } from '@common/logger';
import { EnviromentModule } from '@common/enviroment';
import { QueuesKeyEnum } from './queues-key.enum';

@Global()
@Module({})
export class QueueModule {
  static register() {
    return {
      module: QueueModule,
      imports: [
        EnviromentModule,
        EmailModule,
        LoggerModule,
        BullModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            connection: {
              host: config.get<string>('REDIS_HOST'),
              port: config.get<number>('REDIS_PORT'),
              username: config.get<string>('REDIS_USERNAME'),
              password: config.get<string>('REDIS_PASSWORD'),
            },
            prefix: config.get<string>('REDIS_QUEUE_PREFIX', 'bull'),
          }),
        }),
        BullModule.registerQueue({
          name: QueuesKeyEnum.EMAIL,
        }),
      ],
      exports: [BullModule, QueueEmailProducer, QueueEmailConsumer],
      providers: [QueueEmailProducer, QueueEmailConsumer],
    };
  }
}
