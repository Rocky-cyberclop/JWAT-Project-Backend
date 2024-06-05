import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from 'src/media/entities/media.entity';
import { MediaService } from 'src/media/media.service';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Media])],
  controllers: [UserController],
  providers: [UserService, MediaService],
})
export class UserModule {}
