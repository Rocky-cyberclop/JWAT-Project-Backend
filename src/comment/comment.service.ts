import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { BlogService } from 'src/blog/blog.service';
import { Blog } from 'src/blog/entities/blog.entity';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/user/enums/roles.enum';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userService: UserService,
    private readonly blogService: BlogService,
  ) {}

  async create(userId: number, createCommentDto: CreateCommentDto) {
    const user = await this.userService.findOne(userId);
    const blog = await this.blogService.findOne(createCommentDto.blogId);
    const comment = new Comment();
    comment.user = plainToClass(User, user);
    comment.blog = plainToClass(Blog, blog);
    comment.content = createCommentDto.content;
    await this.commentRepository.save(comment);
    return true;
  }

  async remove(id: number, userId: number): Promise<boolean> {
    const user = await this.userService.findOne(userId);
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (user.role === Role.EMPLOYEE && user.id !== comment.user.id) {
      throw new HttpException('Not the owner', HttpStatus.BAD_REQUEST);
    }
    await this.commentRepository.softDelete(id);
    return true;
  }
}
