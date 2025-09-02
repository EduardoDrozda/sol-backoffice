import { 
  ConfirmUserDTO,
  ConfirmEmailWithPasswordDTO,
  CreateUserRequestDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  ResetUserPasswordDTO,
  ResendConfirmationEmailDTO,
  ToggleUserStatusDTO,
} from '@application/dtos/user/requests';

import {
  ConfirmUserUseCase,
  ConfirmEmailWithPasswordUseCase,
  CreateUserUseCase,
  ForgotPasswordUseCase,
  GetAllUserUseCase,
  ResetPasswordUseCase,
  ResetUserPasswordUseCase,
  ResendConfirmationEmailUseCase,
  ToggleUserStatusUseCase,
} from '@application/use-cases/user';

import { IsPublic } from '@common/authentication';
import { AuthorizationPermissionsEnum } from '@common/authentication/enums';
import { Authorization } from '@common/authentication';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { GetPaginationBaseDto } from '@application/dtos/base/requests';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly confirmUserUseCase: ConfirmUserUseCase,
    private readonly confirmEmailWithPasswordUseCase: ConfirmEmailWithPasswordUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly resetUserPasswordUseCase: ResetUserPasswordUseCase,
    private readonly resendConfirmationEmailUseCase: ResendConfirmationEmailUseCase,
    private readonly getAllUserUseCase: GetAllUserUseCase,
    private readonly toggleUserStatusUseCase: ToggleUserStatusUseCase,
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

  @Post('confirm-email')
  @IsPublic()
  async confirmEmailWithPassword(@Body() confirmEmailWithPasswordDTO: ConfirmEmailWithPasswordDTO) {
    return this.confirmEmailWithPasswordUseCase.execute(confirmEmailWithPasswordDTO);
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

  @Post(':id/resend-confirmation-email')
  @Authorization(AuthorizationPermissionsEnum.UPDATE_USERS)
  async resendConfirmationEmail(@Param('id') id: string) {
    return this.resendConfirmationEmailUseCase.execute({ userId: id });
  }

  @Post(':id/reset-password')
  @Authorization(AuthorizationPermissionsEnum.UPDATE_USERS)
  async resetUserPassword(@Param('id') id: string) {
    return this.resetUserPasswordUseCase.execute({ userId: id });
  }

  @Patch(':id/toggle-status')
  @Authorization(AuthorizationPermissionsEnum.UPDATE_USERS)
  async toggleUserStatus(
    @Param('id') id: string,
    @Body() toggleUserStatusDTO: ToggleUserStatusDTO,
  ) {
    return this.toggleUserStatusUseCase.execute({ id, data: toggleUserStatusDTO });
  }
}
