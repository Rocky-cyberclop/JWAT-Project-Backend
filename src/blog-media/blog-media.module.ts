import { Module } from '@nestjs/common';
import { BlogMediaService } from './blog-media.service';
import { BlogMediaController } from './blog-media.controller';

@Module({
  controllers: [BlogMediaController],
  providers: [BlogMediaService],
})
export class BlogMediaModule {}
