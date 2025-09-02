export type GetRoleDTO = {
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
};

export type GetRoleSimpleDTO = Pick<GetRoleDTO, 'id' | 'name' | 'description'>;