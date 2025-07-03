export type GetExpenseCategoryResponseDto = {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  companyId: string | null;
  
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt?: Date | null;

  deletedBy?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}