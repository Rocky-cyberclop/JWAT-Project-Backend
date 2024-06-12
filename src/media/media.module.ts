import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryProvider } from './cloudinary';
import { MediaConsumer } from './consumer/media.consumer';
import { Media } from './entities/media.entity';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [TypeOrmModule.forFeature([Media]), BullModule.registerQueue({ name: 'media' })],
  controllers: [MediaController],
  providers: [MediaService, CloudinaryProvider, MediaConsumer],
  exports: [MediaService],
})
export class MediaModule {}
