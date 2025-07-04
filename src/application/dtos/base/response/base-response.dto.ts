export type BaseResponseDto = {
  id: string;
  
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  deletedBy?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  companyId?: string;
}

export type BaseResponseWithPaginationDto<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
};