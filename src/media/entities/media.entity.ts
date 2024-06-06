import { BlogMedia } from 'src/blog-media/entities/blog-media.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'media' })
export class Media {
  @PrimaryGeneratedColumn({ name: 'media_id' })
  id: number;

  @Column({ length: 255 })
  url: string;

  @Column({ length: 255 })
  cloudId: string;

  @Column({ length: 20 })
  mediaType: string;

  @OneToMany(() => BlogMedia, (blogMedia) => blogMedia.media)
  blogMedias: BlogMedia[];
}
