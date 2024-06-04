import { Blog } from 'src/blog/entities/blog.entity';
import { Media } from 'src/media/entities/media.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'blog_media' })
export class BlogMedia {
  @PrimaryGeneratedColumn({ name: 'blog_media_id' })
  id: number;

  @ManyToOne(() => Media, (media) => media.blogMedias)
  media: Media;

  @ManyToOne(() => Blog, (blog) => blog.blogMedias)
  blog: Blog;
}
