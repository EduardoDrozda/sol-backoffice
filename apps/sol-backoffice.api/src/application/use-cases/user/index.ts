import { ConfirmUserUseCase } from './confirm-user.use-case';
import { ConfirmEmailWithPasswordUseCase } from './confirm-email-with-password.use-case';
import { CreateUserUseCase } from './create-user.use-case';
import { ForgotPasswordUseCase } from './forgot-password.use-case';
import { GetAllUserUseCase } from './get-all-user.use-case';
import { ResetPasswordUseCase } from './reset-password.use-case';
import { ResetUserPasswordUseCase } from './reset-user-password.use-case';
import { ResendConfirmationEmailUseCase } from './resend-confirmation-email.use-case';
import { ToggleUserStatusUseCase } from './toggle-user-status.use-case';

export * from './create-user.use-case';
export * from './confirm-user.use-case';
export * from './confirm-email-with-password.use-case';
export * from './forgot-password.use-case';
export * from './reset-password.use-case';
export * from './reset-user-password.use-case';
export * from './resend-confirmation-email.use-case';
export * from './get-all-user.use-case';
export * from './toggle-user-status.use-case';

export const USER_USE_CASES = [
  CreateUserUseCase,
  ConfirmUserUseCase,
  ConfirmEmailWithPasswordUseCase,
  ForgotPasswordUseCase,
  ResetPasswordUseCase,
  ResetUserPasswordUseCase,
  ResendConfirmationEmailUseCase,
  GetAllUserUseCase,
  ToggleUserStatusUseCase,
];
