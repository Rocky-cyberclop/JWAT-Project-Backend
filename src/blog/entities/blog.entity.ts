import { format, toZonedTime } from 'date-fns-tz';
import { BlogMedia } from 'src/blog-media/entities/blog-media.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { HashTagBlog } from 'src/hash-tag-blog/entities/hash-tag-blog.entity';
import { StarDetail } from 'src/star-detail/entities/star-detail.entity';
import { User } from 'src/user/entities/user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

const timeZone = 'Asia/Ho_Chi_Minh';

@Entity({ name: 'blog' })
export class Blog {
  @PrimaryGeneratedColumn({ name: 'blog_id' })
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.blogs)
  user: User;

  @OneToMany(() => StarDetail, (starDetail) => starDetail.blog)
  starDetails: StarDetail[];

  @OneToMany(() => Comment, (comment) => comment.blog)
  comments: Comment[];

  @OneToMany(() => HashTagBlog, (hashTagBlog) => hashTagBlog.blog)
  hashTagBlogs: HashTagBlog[];

  @OneToMany(() => BlogMedia, (blogMedia) => blogMedia.blog)
  blogMedias: BlogMedia[];

  @BeforeInsert()
  insertFormatCreatedAt() {
    const now = new Date();
    const zonedDate = toZonedTime(now, timeZone);
    this.createdAt = new Date(format(zonedDate, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone }));
  }
}
