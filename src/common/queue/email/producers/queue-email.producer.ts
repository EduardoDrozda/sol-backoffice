import { SendEmailOptions } from '@common/email';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueEmailProducer {
  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}

  async sendEmail(data: SendEmailOptions) {
    await this.emailQueue.add('send-email', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }
} 