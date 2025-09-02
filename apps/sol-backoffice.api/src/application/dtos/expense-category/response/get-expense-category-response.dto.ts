import { BaseResponseDto } from '@application/dtos/base/response';

export type GetExpenseCategoryResponseDto = {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  companyId: string | null;
} & BaseResponseDto;
