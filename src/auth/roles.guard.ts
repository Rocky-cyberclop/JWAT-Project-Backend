import { CanActivate, ExecutionContext, Inject, Injectable, Logger, LoggerService, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorator/roles.decorator';
import { Role } from 'src/user/enums/roles.enum';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private reflector: Reflector,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { id } = request.user;
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }
    if (!user.role) {
      throw new UnauthorizedException('User role not found');
    }
    const hasRole = requiredRoles.some((role) => user.role.includes(role));
    if (!hasRole) {
      throw new UnauthorizedException('User does not have required role');
    }
    this.logger.log(`Calling canActive() userId: ${id}, role: ${user.role}`, RolesGuard.name);
    return true;
  }
}
