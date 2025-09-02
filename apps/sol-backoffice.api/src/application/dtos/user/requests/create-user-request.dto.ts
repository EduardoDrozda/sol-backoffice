import { IsNotEmpty } from 'class-validator';

export class CreateUserRequestDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  roleId: string;
}
