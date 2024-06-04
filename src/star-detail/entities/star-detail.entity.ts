import { Blog } from 'src/blog/entities/blog.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'star_detail' })
export class StarDetail {
  @PrimaryGeneratedColumn({ name: 'star_detail_id' })
  id: number;

  @ManyToOne(() => User, (user) => user.starDetails)
  user: User;

  @ManyToOne(() => Blog, (blog) => blog.starDetails)
  blog: Blog;
}
