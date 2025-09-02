import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmUserDTO {
  @IsNotEmpty()
  @IsString()
  token: string;
}