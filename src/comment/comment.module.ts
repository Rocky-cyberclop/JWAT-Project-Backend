import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { UserModule } from 'src/user/user.module';
import { BlogModule } from 'src/blog/blog.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UserModule, BlogModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
