import { Controller, Get, Param, Req } from '@nestjs/common';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/user/enums/roles.enum';
import { StarDetailService } from './star-detail.service';

@Controller('star-detail')
export class StarDetailController {
  constructor(private readonly starDetailService: StarDetailService) {}

  @Roles(Role.MANAGER, Role.EMPLOYEE)
  @Get(':blogId')
  async createOrRemove(@Req() req: any, @Param('blogId') blogId: number) {
    await this.starDetailService.createOrRemove(req.user.id, blogId);
    return true;
  }
}
