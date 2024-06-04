import { Document } from 'src/document/entities/document.entity';
import { Knowledge } from 'src/knowledge/entities/knowledge.entity';
import { Media } from 'src/media/entities/media.entity';
import { UserProject } from 'src/user-project/entities/user-project.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'project' })
export class Project {
  @PrimaryGeneratedColumn({ name: 'project_id' })
  id: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 255 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  @OneToMany(() => Document, (document) => document.project)
  documents: Document[];

  @OneToMany(() => Knowledge, (knowledge) => knowledge.project)
  knowledges: Knowledge[];

  @OneToMany(() => UserProject, (userProject) => userProject.project)
  userProjects: UserProject[];

  @OneToOne(() => Media)
  @JoinColumn()
  media: Media;
}
