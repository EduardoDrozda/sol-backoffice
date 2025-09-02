import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateGroupRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string | null;
}
