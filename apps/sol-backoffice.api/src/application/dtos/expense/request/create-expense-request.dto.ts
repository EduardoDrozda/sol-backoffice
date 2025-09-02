import { Type } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateExpenseRequestDto {
  @IsNotEmpty()
  @IsDateString()
  issueDate: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  description: string;

  @IsString()
  costCenterId: string;

  @IsString()
  @IsOptional()
  groupId?: string;

  @IsString()
  @IsOptional()
  projectId?: string;

  files: Express.Multer.File[];
}