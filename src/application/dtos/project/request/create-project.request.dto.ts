import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
} 