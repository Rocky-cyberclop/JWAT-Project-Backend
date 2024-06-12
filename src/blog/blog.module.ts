import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { UserModule } from 'src/user/user.module';
import { MediaModule } from 'src/media/media.module';
import { BlogMediaModule } from 'src/blog-media/blog-media.module';

@Module({
  imports: [TypeOrmModule.forFeature([Blog]), UserModule, MediaModule, BlogMediaModule],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
