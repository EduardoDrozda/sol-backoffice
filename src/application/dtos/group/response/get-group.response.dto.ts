import { BaseResponseDto } from '@application/dtos/base/response';

export type GetGroupResponseDto = BaseResponseDto & {
  id: string;
  name: string;
  description: string | null;
};
