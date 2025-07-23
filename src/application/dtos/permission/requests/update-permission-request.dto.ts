import { IsOptional, IsString } from 'class-validator';

export class UpdatePermissionRequestDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
} 