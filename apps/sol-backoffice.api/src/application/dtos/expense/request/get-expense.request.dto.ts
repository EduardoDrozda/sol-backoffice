import { GetPaginationBaseDto } from "@application/dtos/base/requests";
import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";

export class GetExpenseRequestDto extends GetPaginationBaseDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isPaid?: boolean;

  @IsOptional()
  userId?: string;

  @IsOptional()
  categoryId?: string;

  @IsOptional()
  costCenterId?: string;

  @IsOptional()
  groupId?: string;

  @IsOptional()
  projectId?: string;

  @IsOptional()
  issueDate?: string;
} 