import { Exclude } from 'class-transformer';

export class ResponseBlogDto {
  title: string;
  content: string;
  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
