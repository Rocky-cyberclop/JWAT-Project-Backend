import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashTagBlog } from './entities/hash-tag-blog.entity';
import { HashTagBlogService } from './hash-tag-blog.service';

@Module({
  imports: [TypeOrmModule.forFeature([HashTagBlog])],
  providers: [HashTagBlogService],
  exports: [HashTagBlogService],
})
export class HashTagBlogModule {}
