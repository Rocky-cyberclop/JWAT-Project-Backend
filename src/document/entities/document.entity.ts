import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Entity,
} from 'typeorm';
import { DocumentGroup } from './document.group.entity';
import { Project } from 'src/project/entities/project.entity';

@Entity({ name: 'document' })
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  @ManyToOne(() => DocumentGroup, (documentGroup) => documentGroup.documents)
  documentGroup: DocumentGroup;

  @ManyToOne(() => Project, (project) => project.documents)
  project: Project;
}
