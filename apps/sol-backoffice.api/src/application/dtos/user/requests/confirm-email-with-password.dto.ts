import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { PasswordMatch } from '@common/decorators';

export class ConfirmEmailWithPasswordDTO {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'A confirmação de senha deve ter pelo menos 6 caracteres' })
  @PasswordMatch('password', { message: 'A confirmação de senha deve ser igual à senha' })
  confirmPassword: string;
}
