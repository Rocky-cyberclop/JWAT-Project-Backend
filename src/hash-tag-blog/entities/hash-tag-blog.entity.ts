import { Blog } from 'src/blog/entities/blog.entity';
import { HashTag } from 'src/hash-tag/entities/hash-tag.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'hash_tag_blog' })
export class HashTagBlog {
  @PrimaryGeneratedColumn({ name: 'hash_tag_blog_id' })
  id: number;

  @ManyToOne(() => Blog, (blog) => blog.hashTagBlogs)
  blog: Blog;

  @ManyToOne(() => HashTag, (hashTag) => hashTag.hashTagBlogs)
  hashTag: HashTag;
}
