import { Module } from '@nestjs/common';
import { HashTagBlogService } from './hash-tag-blog.service';
import { HashTagBlogController } from './hash-tag-blog.controller';

@Module({
  controllers: [HashTagBlogController],
  providers: [HashTagBlogService],
})
export class HashTagBlogModule {}
