import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { MediaService } from 'src/media/media.service';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RolesGuard } from './roles.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Media } from 'src/media/entities/media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Media])],
  controllers: [AuthController],
  providers: [AuthService, JwtService, Reflector, AuthGuard, RolesGuard, UserService, MediaService],
  exports: [AuthGuard, RolesGuard],
})
export class AuthModule {}
