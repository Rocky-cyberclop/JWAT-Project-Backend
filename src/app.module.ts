import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/roles.guard';
import { BlogMediaModule } from './blog-media/blog-media.module';
import { BlogModule } from './blog/blog.module';
import { CommentModule } from './comment/comment.module';
import configuration from './config/configuration';
import { DocumentModule } from './document/document.module';
import { HashTagBlogModule } from './hash-tag-blog/hash-tag-blog.module';
import { HashTagModule } from './hash-tag/hash-tag.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { MailModule } from './mail/mail.module';
import { MediaModule } from './media/media.module';
import { ProjectModule } from './project/project.module';
import { SearchModule } from './search/search.module';
import { StarDetailModule } from './star-detail/star-detail.module';
import { UserProjectModule } from './user-project/user-project.module';
import { UserModule } from './user/user.module';
require('dotenv').config();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}.local`],
      isGlobal: true,
      load: [configuration],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('redisHost'),
          port: configService.get<number>('redisPort'),
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
        return {
          type: 'postgres',
          host: configService.get<string>('dbHost'),
          port: configService.get<number>('dbPort'),
          username: configService.get<string>('dbUsername'),
          database: configService.get<string>('dbName'),
          password: configService.get<string>('dbPassword'),
          entities: ['dist/**/*.entity.js'],
          migrations: ['dist/database/migrations/*.js'],
          ssl: {
            rejectUnauthorized: false,
          },
        };
      },
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('AppConsoleLog'),
          ),
        }),
        new winston.transports.File({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('AppFileLog', {
              prettyPrint: false,
            }),
          ),
          filename: 'system.log',
        }),
      ],
    }),
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
    MailModule,
    SearchModule,
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
