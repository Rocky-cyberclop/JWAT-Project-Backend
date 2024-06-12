import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogMediaController } from './blog-media.controller';
import { BlogMediaService } from './blog-media.service';
import { BlogMedia } from './entities/blog-media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogMedia])],
  controllers: [BlogMediaController],
  providers: [BlogMediaService],
  exports: [BlogMediaService],
})
export class BlogMediaModule {}
