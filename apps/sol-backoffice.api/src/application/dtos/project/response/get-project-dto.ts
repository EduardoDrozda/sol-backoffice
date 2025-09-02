import { BaseResponseDto } from '@application/dtos/base/response';

export type GetProjectResponseDto = {
  name: string;
  description: string | null;
} & BaseResponseDto; 