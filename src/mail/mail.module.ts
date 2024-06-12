import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EmailConsumer } from './consumer/email.consumer';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
@Module({
  imports: [
    BullModule.registerQueue({ name: 'send-email' }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('mailHost'),
          port: configService.get<number>('mailPort'),
          secure: false,
          auth: {
            user: configService.get('mailUser'),
            pass: configService.get('mailPassword'),
          },
        },
        defaults: {
          from: {
            name: configService.get<string>('appName'),
            address: configService.get<string>('defaultMailFrom'),
          },
        },
        template: {
          dir: join('dist/mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [MailController],
  providers: [MailService, EmailConsumer],
  exports: [MailService],
})
export class MailModule {}
