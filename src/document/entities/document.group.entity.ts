import {
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Entity,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Document } from './document.entity';

@Entity({ name: 'document_group' })
export class DocumentGroup {
  @PrimaryGeneratedColumn({ name: 'document_group_id' })
  id: number;

  @Column({ length: 100 })
  name: string;

  @OneToMany(() => Document, (document) => document.documentGroup)
  documents: Document[];

  @ManyToOne(() => DocumentGroup, (documentGroup) => documentGroup.children)
  parent: DocumentGroup;

  @OneToMany(() => DocumentGroup, (documentGroup) => documentGroup.parent)
  children: DocumentGroup[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
