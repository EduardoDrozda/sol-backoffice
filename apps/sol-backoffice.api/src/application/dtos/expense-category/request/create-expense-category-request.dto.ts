import { IsHexColor, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateExpenseCategoryRequestDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  icon: string;

  @IsOptional()
  @IsHexColor()
  color: string;
}
