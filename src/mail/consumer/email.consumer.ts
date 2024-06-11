import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('send-email')
export class EmailConsumer {
  constructor(private readonly mailerService: MailerService) {}

  @Process('create-user')
  async createUserEmail(job: Job<unknown>) {
    await this.mailerService.sendMail({
      to: job.data['to'],
      subject: job.data['subject'],
      template: './welcome',
      context: {
        username: job.data['username'],
        password: job.data['password'],
      },
    });
  }
}
