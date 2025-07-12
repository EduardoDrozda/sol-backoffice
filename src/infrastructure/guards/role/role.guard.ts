import { IUserRepository, USER_REPOSITORY } from '@domain/interfaces/repositories';
import { ROLES_KEY } from '@infrastructure/decorators/role';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    const findedUser = await this.userRepository.findById(user.id, {
      includeRole: true,
    });

    const isAllowed = requiredRoles.some((role) => findedUser?.role?.name === role);

    if (!isAllowed) {
      throw new ForbiddenException(
        'You do not have permission to access this resource.',
      );
    }

    return isAllowed;
  }
}
