import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from 'src/media/media.module';
import { BlogMediaService } from './blog-media.service';
import { BlogMedia } from './entities/blog-media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogMedia]), MediaModule],
  providers: [BlogMediaService],
  exports: [BlogMediaService],
})
export class BlogMediaModule {}
