import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from 'database/type.orm.async.config';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
require('dotenv').config()

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}.local`],
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
