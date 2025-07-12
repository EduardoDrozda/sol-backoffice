import { Permission, Prisma } from '@prisma/client';

export type RoleModel = Prisma.RoleGetPayload<{
  include: {
    permissions: {
      include: {
        permission: true;
      };
    };
  };
}>;