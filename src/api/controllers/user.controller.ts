import { 
  ConfirmUserDTO,
  CreateUserRequestDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
} from '@application/dtos/user/requests';

import {
  ConfirmUserUseCase,
  CreateUserUseCase,
  ForgotPasswordUseCase,
  GetAllUserUseCase,
  ResetPasswordUseCase,
} from '@application/use-cases/user';

import { IsPublic } from '@common/authentication';
import { AuthorizationPermissionsEnum } from '@common/authentication/enums';
import { Authorization } from '@common/authentication';
import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { GetPaginationBaseDto } from '@application/dtos/base/requests';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly confirmUserUseCase: ConfirmUserUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly getAllUserUseCase: GetAllUserUseCase,
  ) { }

  @Post()
  @Authorization(AuthorizationPermissionsEnum.CREATE_USERS)
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

  @Get()
  @Authorization(AuthorizationPermissionsEnum.VIEW_USERS)
  async getUsers(@Query() query: GetPaginationBaseDto) {
    return this.getAllUserUseCase.execute(query);
  }
}
