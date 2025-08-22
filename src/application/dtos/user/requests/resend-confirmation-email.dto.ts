import { IsString, IsNotEmpty } from 'class-validator';

export class ResendConfirmationEmailDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
