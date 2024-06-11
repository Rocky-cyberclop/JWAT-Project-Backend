import { Controller, Post } from '@nestjs/common';
import { Public } from 'src/decorator/public.decorator';
import { CreateUserMailDto } from './dto/mail.dto';
import { MailService } from './mail.service';

@Controller('mailer')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Public()
  @Post('/send-email')
  sendMail() {
    const dto: CreateUserMailDto = {
      recipients: [{ name: 'Hào Trần', address: 'phkane732002@gmail.com' }],
      subject: 'Lucky Winner',
      username: 'rocky1',
      password: 'rocky1',
    };
    return this.mailService.sendEmail(dto);
  }
}
