import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { CreateAuthRequestDTO } from '@application/dtos/auth/requests';
import { GetAuthResponseDTO } from '@application/dtos/auth/responses';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '@domain/interfaces/repositories';
import { HashService } from '@common/hash';
import { LoggerService } from '@common/logger';
import { AuthenticationService } from '@common/authentication';

@Injectable()
export class CreateAuthUseCase
  implements IBaseUseCase<CreateAuthRequestDTO, GetAuthResponseDTO> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly hashService: HashService,
    private readonly authenticationService: AuthenticationService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(data: CreateAuthRequestDTO): Promise<GetAuthResponseDTO> {
    this.loggerService.log('Executing...');

    const { email, password } = data;

    const existingUser = await this
      .userRepository
      .findByEmail(email, {
        includeRole: true,
      });

    if (
      !existingUser ||
      !(await this.hashService.compare(password, existingUser.password!))
    ) {
      this.loggerService.error('Invalid email or password');
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!existingUser.isActive) {
      this.loggerService.error('User is not active');
      throw new UnauthorizedException('User is not active');
    }

    const token = await this.authenticationService.sign({
      id: existingUser.id,
      name: existingUser.name,
      companyId: existingUser.companyId,
      roleId: existingUser.roleId,
    });

    return {
      token,
      type: 'Bearer',
    };
  }
}
