import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/decorator/public.decorator';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  login(@Body() createAuthDto: CreateAuthDto): Promise<any> {
    return this.authService.login(createAuthDto);
  }

  @Public()
  @Post('refresh-token')
  refreshToken(@Body() { refreshToken }): Promise<any> {
    return this.authService.refreshToken(refreshToken);
  }
}
