import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  controllers: [MediaController],
  providers: [MediaService, CloudinaryProvider],
})
export class MediaModule {}
