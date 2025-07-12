import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGroupRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string | null;
}
