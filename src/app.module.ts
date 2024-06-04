import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from 'database/type.orm.async.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/roles.guard';
import configuration from './config/configuration';
import { UserModule } from './user/user.module';
import { DocumentModule } from './document/document.module';
import { ProjectModule } from './project/project.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { UserProjectModule } from './user-project/user-project.module';
import { BlogModule } from './blog/blog.module';
import { StarDetailModule } from './star-detail/star-detail.module';
import { CommentModule } from './comment/comment.module';
import { HashTagModule } from './hash-tag/hash-tag.module';
import { HashTagBlogModule } from './hash-tag-blog/hash-tag-blog.module';
import { MediaModule } from './media/media.module';
import { BlogMediaModule } from './blog-media/blog-media.module';
require('dotenv').config();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}.local`],
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    UserModule,
    AuthModule,
    JwtModule,
    DocumentModule,
    ProjectModule,
    KnowledgeModule,
    UserProjectModule,
    BlogModule,
    StarDetailModule,
    CommentModule,
    HashTagModule,
    HashTagBlogModule,
    MediaModule,
    BlogMediaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
