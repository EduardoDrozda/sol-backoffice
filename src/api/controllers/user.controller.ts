import { CreateUserRequestDTO } from '@application/dtos/user/requests';
import { CreateUserUseCase } from '@application/use-cases/user/create-user.use-case';
import { PermissionsEnum, RolesEnum } from '@domain/enums';
import { Permission } from '@infrastructure/decorators/permission';
import { Roles } from '@infrastructure/decorators/role';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @Permission(PermissionsEnum.CREATE_USERS)
  async createUser(@Body() createUserRequestDTO: CreateUserRequestDTO) {
    return this.createUserUseCase.execute(createUserRequestDTO);
  }
}
