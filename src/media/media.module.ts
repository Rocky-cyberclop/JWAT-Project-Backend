import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketModule } from 'src/socket/socket.module';
import { CloudinaryProvider } from './cloudinary';
import { MediaConsumer } from './consumer/media.consumer';
import { Media } from './entities/media.entity';
import { MediaService } from './media.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media]),
    BullModule.registerQueue({ name: 'media' }),
  ],
  providers: [MediaService, CloudinaryProvider, MediaConsumer],
  exports: [MediaService],
})
export class MediaModule {}
