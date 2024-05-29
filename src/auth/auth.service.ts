import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  login = async (createAuthDto: CreateAuthDto): Promise<any> => {
    const user = await this.userRepository.findOne({ where: { username: createAuthDto.username } });
    if (!user) {
      throw new HttpException({ message: 'User is not exist.' }, HttpStatus.UNAUTHORIZED);
    }
    const verify = await user.comparePassword(createAuthDto.password);
    if (!verify) {
      throw new HttpException(
        {
          message: 'Password doese not correct.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = { id: user.id, username: user.username };
    return this.generateToken(payload);
  };

  async refreshToken(refreshToken: string): Promise<any> {
    try {
      const verify = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('refreshTokenKey'),
      });
      const checkExistToken = await this.userRepository.findOneBy({
        email: verify.email,
        refreshToken,
      });
      if (checkExistToken) {
        return this.generateToken({
          id: verify.id,
          username: verify.username,
        });
      } else {
        throw new HttpException('Refresh Token is not valid', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException('Refresh Token is not valid', HttpStatus.BAD_REQUEST);
    }
  }

  async generateToken(payload: { id: number; username: string }) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('accessTokenKey'),
      expiresIn: '1h',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('refreshTokenKey'),
      expiresIn: '7d',
    });
    await this.userRepository.update(payload.id, { refreshToken });
    return { accessToken, refreshToken };
  }
}
