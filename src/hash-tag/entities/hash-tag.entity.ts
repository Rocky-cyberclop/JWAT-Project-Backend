import { HashTagBlog } from 'src/hash-tag-blog/entities/hash-tag-blog.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'hash_tag' })
export class HashTag {
  @PrimaryGeneratedColumn({ name: 'hash_tag_id' })
  id: number;

  @Column({ length: 50 })
  hashTagName: string;

  @OneToMany(() => HashTagBlog, (hashTagBlog) => hashTagBlog.hashTag)
  hashTagBlogs: HashTagBlog[];
}
