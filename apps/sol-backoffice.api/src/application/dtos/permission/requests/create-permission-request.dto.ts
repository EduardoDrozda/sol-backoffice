import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionRequestDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
} 