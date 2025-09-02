import { BaseResponseDto } from '@application/dtos/base/response';

export type GetCostCenterResponseDto = {
  name: string;
  description: string | null;
} & BaseResponseDto;
