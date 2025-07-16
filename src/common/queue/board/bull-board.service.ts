import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import * as express from 'express';

import { EnviromentService } from '@common/enviroment';
import { QueuesKeyEnum } from '../queues-key.enum';

@Injectable()
export class BullBoardService implements OnModuleInit {
  constructor(private readonly enviromentService: EnviromentService) {}

  onModuleInit() {
    const nodeEnv = this.enviromentService.get('NODE_ENV');

    if (nodeEnv !== 'development' && nodeEnv !== 'staging') {
      return;
    }

    const queuesKeys = Object.values(QueuesKeyEnum);
    const connection = this.getRedisConnection();
    const queues = queuesKeys.map(queueKey => new BullMQAdapter(new Queue(queueKey, { connection })));

    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');

    createBullBoard({
      queues,
      serverAdapter,
    });

    const app = express();
    app.use('/admin/queues', serverAdapter.getRouter());

    app.listen(3001, () => {
      console.log('Bull Board: http://localhost:3001/admin/queues');
    });
  }

  private getRedisConnection() {
    return {
      host: this.enviromentService.get('REDIS_HOST'),
      port: Number(this.enviromentService.get('REDIS_PORT')),
      username: this.enviromentService.get('REDIS_USERNAME'),
      password: this.enviromentService.get('REDIS_PASSWORD'),
    };
  }
}
