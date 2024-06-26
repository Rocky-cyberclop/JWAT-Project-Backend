import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CreateUserMailDto } from './dto/mail.dto';
import { MutateProjectMailDto } from './dto/mail-info-mutate-project.dto';
@Injectable()
export class MailService {
  constructor(@InjectQueue('send-email') private emailQueue: Queue) {}

  async sendEmail(mailDto: CreateUserMailDto): Promise<void> {
    const { recipients, subject, username, password } = mailDto;
    await this.emailQueue.add(
      'create-user',
      {
        to: recipients,
        subject,
        username,
        password,
      },
      { removeOnComplete: true },
    );
  }

  async sendEmailAddToProject(mailDto: MutateProjectMailDto): Promise<void> {
    const { recipients, subject, project } = mailDto;
    await this.emailQueue.add(
      'add-user-to-project',
      {
        to: recipients,
        subject,
        project,
      },
      { removeOnComplete: true },
    );
  }
}
