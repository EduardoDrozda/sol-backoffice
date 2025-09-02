import { IsHexColor, IsOptional } from 'class-validator';

export class UpdateExpenseCategoryRequestDto {
  id: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsHexColor()
  color?: string;

  @IsOptional()
  icon?: string;
}
