import { IsOptional } from "class-validator";

export class GetPaginationBaseDto {
  @IsOptional()
  page: number = 1;

  @IsOptional()
  limit: number = 10;

  @IsOptional()
  sort?: string;

  @IsOptional()
  order?: 'asc' | 'desc';

  @IsOptional()
  search?: string;

  userId?: string | null;
}