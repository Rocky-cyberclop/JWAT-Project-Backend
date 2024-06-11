import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CreateUserMailDto } from './dto/mail.dto';
@Injectable()
export class MailService {
  constructor(@InjectQueue('send-email') private emailQueue: Queue) {}

  async sendEmail(mailDto: CreateUserMailDto) {
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
}
