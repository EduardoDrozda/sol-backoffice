import { Permission, Prisma } from '@prisma/client';

export type PermissionModel = Permission;

export type CreatePermissionInput = Prisma.PermissionCreateInput;

export type UpdatePermissionInput = Prisma.PermissionUpdateInput; 