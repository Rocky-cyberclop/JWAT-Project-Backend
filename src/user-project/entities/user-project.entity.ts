import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user_project' })
export class UserProject {
  @PrimaryGeneratedColumn({ name: 'user_project_id' })
  id: number;

  @Column()
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  @ManyToOne(() => Project, (project) => project.userProjects)
  project: Project;

  @ManyToOne(() => User, (user) => user.userProjects)
  user: User;
}
