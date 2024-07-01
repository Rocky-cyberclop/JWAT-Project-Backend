import { Exclude, Transform } from 'class-transformer';
import { Blog } from 'src/blog/entities/blog.entity';
import { User } from 'src/user/entities/user.entity';

export class ResponseCommentDto {
  id: number;
  content: string;
  createdAt: Date;
  @Transform(({ value }) => ({ id: value.id, media: value.media?.url, fullName: value.fullName }))
  user: User;
  @Exclude()
  deletedAt: Date;
  @Exclude()
  updatedAt: Date;
  @Transform(({ value }) => ({ id: value.id }))
  blog: Blog;
}
