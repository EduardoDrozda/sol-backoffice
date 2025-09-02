import { PasswordMatch } from '@common/decorators';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDTO {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'A confirmação de senha deve ter pelo menos 6 caracteres' })
  @PasswordMatch('password', { message: 'A confirmação de senha deve ser igual à senha' })
  confirmPassword: string;
} 