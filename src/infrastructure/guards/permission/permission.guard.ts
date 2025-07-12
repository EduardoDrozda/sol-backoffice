import { IRoleRepository, ROLE_REPOSITORY } from '@domain/interfaces/repositories';
import { PERMISSIONS_KEY } from '@infrastructure/decorators/permission/permission.decorator';
import { CanActivate, ExecutionContext, ForbiddenException,   Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const findedRole = await this.roleRepository.findByName(user.role, true);

    const isAllowed = requiredPermissions.some((permission) => findedRole?.permissions.some((p) => p.permission.name === permission));

    if (!isAllowed) {
      throw new ForbiddenException(
        'You do not have permission to access this resource.',
      );
    }

    return isAllowed;
  }
}
