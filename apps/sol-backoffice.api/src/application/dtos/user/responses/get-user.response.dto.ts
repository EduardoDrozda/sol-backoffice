export type GetUserResponseDto = {
  id: string;
  name: string;
  email: string;
  role?: {
    id?: string | null;
    name?: string | null;
  } | null;
  companyId: string | null;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
};