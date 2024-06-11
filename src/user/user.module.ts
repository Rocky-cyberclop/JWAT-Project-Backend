import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { MediaModule } from 'src/media/media.module';
import { UserConsumer } from './consumer/user.consumer';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'user' }),
    TypeOrmModule.forFeature([User]),
    MediaModule,
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserConsumer],
  exports: [UserService],
})
export class UserModule {}
