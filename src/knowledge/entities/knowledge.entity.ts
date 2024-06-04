import { Media } from 'src/media/entities/media.entity';
import { Project } from 'src/project/entities/project.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'knowledge' })
export class Knowledge {
  @PrimaryGeneratedColumn({ name: 'knowledge_id' })
  id: number;

  @Column({ length: 255 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  @ManyToOne(() => Project, (project) => project.knowledges)
  project: Project;

  @OneToOne(() => Media)
  @JoinColumn()
  media: Media;
}
