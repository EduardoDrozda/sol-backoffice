import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IRoleRepository, ROLE_REPOSITORY } from '@domain/interfaces/repositories';
import { Reflector } from '@nestjs/core';
import { AUTHORIZATION_KEY, IS_PUBLIC_KEY } from '../decorators';
import { AuthenticationService } from '../authentication.service';
import { RoleWithPermissions } from '@domain/models';



@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
    private readonly authenticationService: AuthenticationService,
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      AUTHORIZATION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const session = this.authenticationService.getSession();

    if (!session) {
      throw new UnauthorizedException('User not authenticated');
    }

    const user = session.user;

    const role = await this.roleRepository.findById(user.roleId, true);

    if (!role) {
      throw new UnauthorizedException('User not authorized');
    }

    const isAllowed = requiredPermissions
      .some((permission) =>
        (role as RoleWithPermissions).permissions?.some((p) => p.permission?.name === permission),
      );

    if (!isAllowed) {
      throw new ForbiddenException(
        'You do not have permission to access this resource.',
      );
    }

    return true;
  }
}
