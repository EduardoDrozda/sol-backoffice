import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCostCenterRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
