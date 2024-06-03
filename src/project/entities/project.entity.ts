import { Document } from 'src/document/entities/document.entity';
import { Knowledge } from 'src/knowledge/entities/knowledge.entity';
import { UserProject } from 'src/user-project/entities/user-project.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'project' })
export class Project {
  @PrimaryGeneratedColumn()
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
}
