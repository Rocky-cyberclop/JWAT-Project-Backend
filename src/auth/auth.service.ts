import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  login = async (createAuthDto: CreateAuthDto): Promise<any> => {
    const user = await this.userService.findOneByUsername(createAuthDto.username);
    if (!user) {
      throw new HttpException({ message: 'User is not exist.' }, HttpStatus.UNAUTHORIZED);
    }
    const verify = await user.comparePassword(createAuthDto.password);
    if (!verify) {
      throw new HttpException(
        {
          message: 'Password does not correct.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = { id: user.id };
    return this.generateToken(payload);
  };

  async refreshToken(refreshToken: string): Promise<any> {
    try {
      const verify = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('refreshTokenKey'),
      });
      const checkExistToken = await this.userService.findOneByIdAndRefreshToken(
        verify.id,
        refreshToken,
      );
      if (checkExistToken) {
        return this.generateToken({
          id: verify.id,
        });
      } else {
        throw new HttpException('Refresh Token is not valid', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException('Refresh Token is not valid', HttpStatus.BAD_REQUEST);
    }
  }

  async generateToken(payload: { id: number }) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('accessTokenKey'),
      expiresIn: '1h',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('refreshTokenKey'),
      expiresIn: '7d',
    });
    await this.userService.updateById(payload.id, { refreshToken });
    return { accessToken, refreshToken };
  }
}
