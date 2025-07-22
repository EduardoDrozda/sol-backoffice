import { Role, Prisma, Permission } from '@prisma/client';

export type RoleModel = Role;

export type CreateRoleInput = Prisma.RoleCreateInput;

export type UpdateRoleInput = Prisma.RoleUpdateInput;

export type RoleWithPermissions = Prisma.RoleGetPayload<{
  include: {
    permissions: {
      include: {
        permission: true;
      };
    };
  };
}>;