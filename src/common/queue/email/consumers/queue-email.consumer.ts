import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@common/logger';
import { EmailService, SendEmailOptions } from '@common/email';


@Injectable()
@Processor('email')
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

    await this.emailService.sendWelcomeEmail(job.data.to, job.data.context);
    this.loggerService.log(`Email sent to ${job.data.to} with subject: ${job.data.subject}`);
    return true;
  }
} 