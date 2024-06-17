import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from './entities/project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProject } from 'src/user-project/entities/user-project.entity';
import { User } from 'src/user/entities/user.entity';
import { MediaModule } from 'src/media/media.module';
import { MailModule } from 'src/mail/mail.module';
import { Knowledge } from 'src/knowledge/entities/knowledge.entity';
import { DocumentGroup } from 'src/document/entities/document.group.entity';
import { Document } from 'src/document/entities/document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, UserProject, User, Knowledge, Document, DocumentGroup]),
    MediaModule,
    MailModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
