import { ConfirmUserDTO, CreateUserRequestDTO, ForgotPasswordDTO, ResetPasswordDTO } from '@application/dtos/user/requests';
import { ConfirmUserUseCase, CreateUserUseCase, ForgotPasswordUseCase, ResetPasswordUseCase } from '@application/use-cases/user';
import { IsPublic } from '@common/authentication';
import { PermissionsEnum, RolesEnum } from '@domain/enums';
import { Permission } from '@infrastructure/decorators/permission';
import { Body, Controller, Patch, Post } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly confirmUserUseCase: ConfirmUserUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
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

  @Post('forgot-password')
  @IsPublic()
  async forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDTO) {
    return this.forgotPasswordUseCase.execute(forgotPasswordDTO);
  }

  @Patch('reset-password')
  @IsPublic()
  async resetPassword(@Body() resetPasswordDTO: ResetPasswordDTO) {
    return this.resetPasswordUseCase.execute(resetPasswordDTO);
  }
}
