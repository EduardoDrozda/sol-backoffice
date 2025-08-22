import { IsString, IsNotEmpty } from 'class-validator';

export class ResetUserPasswordDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
