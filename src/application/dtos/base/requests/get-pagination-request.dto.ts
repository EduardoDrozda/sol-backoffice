import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class GetPaginationBaseDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit: number = 10;

  @IsOptional()
  sort?: string;

  @IsOptional()
  order?: 'asc' | 'desc';

  @IsOptional()
  search?: string;
}
