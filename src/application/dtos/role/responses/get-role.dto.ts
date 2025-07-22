export class GetRoleDTO {
  id: string;
  name: string;
  description?: string | null;
  companyId: string;
  createdAt: Date;
  createdById: string;
  updatedAt: Date;
  updatedById: string;
  deletedAt: Date;
  deletedById: string;
  permissions?: any[];
}