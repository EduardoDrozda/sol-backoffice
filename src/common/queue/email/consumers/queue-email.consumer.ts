import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@common/logger';
import { EmailService, SendEmailOptions } from '@common/email';
import { QueuesKeyEnum } from '@common/queue/queues-key.enum';

@Injectable()
@Processor(QueuesKeyEnum.EMAIL)
export class QueueEmailConsumer extends WorkerHost {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly emailService: EmailService,
  ) {
    super();

    this.loggerService.context = QueueEmailConsumer.name;
  }

  async process(job: Job<SendEmailOptions>) {
    this.loggerService.log(`Process email to ${job.data.to}`);

    await this.emailService.sendEmail({
      to: job.data.to,
      context: job.data.context,
      attachments: job.data.attachments,
      type: job.data.type,
    });

    this.loggerService.log(`Email sent to ${job.data.to}`);
    return true;
  }
} 