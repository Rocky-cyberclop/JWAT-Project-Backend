import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogMediaModule } from 'src/blog-media/blog-media.module';
import { HashTagBlogModule } from 'src/hash-tag-blog/hash-tag-blog.module';
import { HashTagModule } from 'src/hash-tag/hash-tag.module';
import { MediaModule } from 'src/media/media.module';
import { UserModule } from 'src/user/user.module';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { Blog } from './entities/blog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog]),
    UserModule,
    MediaModule,
    BlogMediaModule,
    HashTagModule,
    HashTagBlogModule,
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
