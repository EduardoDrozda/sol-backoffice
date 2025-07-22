import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class UpdateRoleRequestDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
} 