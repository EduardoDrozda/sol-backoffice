import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProjectRequestDto {
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string | null;
} 