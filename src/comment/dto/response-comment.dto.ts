import { Exclude, Transform } from 'class-transformer';
import { Blog } from 'src/blog/entities/blog.entity';
import { User } from 'src/user/entities/user.entity';

export class ResponseCommentDto {
  id: number;
  content: string;
  createdAt: Date;
  @Transform(({ value }) => ({ id: value.id }))
  user: User;
  @Exclude()
  deletedAt: Date;
  @Exclude()
  updatedAt: Date;
  @Transform(({ value }) => ({ id: value.id }))
  blog: Blog;
}
