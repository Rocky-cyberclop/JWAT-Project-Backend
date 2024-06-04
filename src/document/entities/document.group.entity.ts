import { PrimaryGeneratedColumn, Column, OneToMany, Entity } from 'typeorm';
import { Document } from './document.entity';

@Entity({ name: 'document_group' })
export class DocumentGroup {
  @PrimaryGeneratedColumn({ name: 'document_group_id' })
  id: number;
  @Column({ length: 100 })
  name: string;
  @OneToMany(() => Document, (document) => document.documentGroup)
  documents: Document[];
}
