import { forwardRef, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogMediaModule } from 'src/blog-media/blog-media.module';
import { CommentModule } from 'src/comment/comment.module';
import { HashTagBlogModule } from 'src/hash-tag-blog/hash-tag-blog.module';
import { HashTagModule } from 'src/hash-tag/hash-tag.module';
import { MediaModule } from 'src/media/media.module';
import { SearchModule } from 'src/search/search.module';
import { StarDetailModule } from 'src/star-detail/star-detail.module';
import { UserModule } from 'src/user/user.module';
import { BlogController } from './blog.controller';
import { BlogSearchService } from './blog.search.service';
import { BlogService } from './blog.service';
import { Blog } from './entities/blog.entity';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog]),
    UserModule,
    MediaModule,
    BlogMediaModule,
    HashTagModule,
    HashTagBlogModule,
    SearchModule,
    SocketModule,
    forwardRef(() => StarDetailModule),
    forwardRef(() => CommentModule),
  ],
  controllers: [BlogController],
  providers: [BlogService, BlogSearchService, Logger],
  exports: [BlogService],
})
export class BlogModule {}
