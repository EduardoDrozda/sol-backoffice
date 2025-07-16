import { ConfirmUserDTO, CreateUserRequestDTO } from '@application/dtos/user/requests';
import { ConfirmUserUseCase } from '@application/use-cases/user/confirm-user.use-case';
import { CreateUserUseCase } from '@application/use-cases/user/create-user.use-case';
import { IsPublic } from '@common/authentication';
import { PermissionsEnum, RolesEnum } from '@domain/enums';
import { Permission } from '@infrastructure/decorators/permission';
import { Roles } from '@infrastructure/decorators/role';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly confirmUserUseCase: ConfirmUserUseCase,
  ) {}

  @Post()
  @Permission(PermissionsEnum.CREATE_USERS)
  async createUser(@Body() createUserRequestDTO: CreateUserRequestDTO) {
    return this.createUserUseCase.execute(createUserRequestDTO);
  }

  @Post('confirm-user')
  @IsPublic()
  async confirmUser(@Body() confirmUserDTO: ConfirmUserDTO) {
    return this.confirmUserUseCase.execute(confirmUserDTO);
  }
}
