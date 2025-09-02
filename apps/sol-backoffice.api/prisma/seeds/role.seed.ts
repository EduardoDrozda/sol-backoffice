import { AuthorizationPermissionsEnum, AuthorizationRolesEnum } from "../../src/common/authentication/enums";
import { Prisma, PrismaClient } from "@prisma/client";

export async function rolesSeed() { 
  const prisma = new PrismaClient();
  const hasData = await prisma.role.findFirst();

  if (hasData) {
    console.log("Roles already exists in the table, skipping seed.");
    return;
  }

  const company = await prisma.company.findFirst();

  if (!company) {
    console.error("No company found to associate with the roles.");
    return;
  }

  const roles: Prisma.RoleCreateManyInput[] = Object.values(AuthorizationRolesEnum).map(role => ({
    name: role,
    description: `Role for ${role}`,
    companyId: company.id,
  }));

  const createdRoles = await prisma.role.createMany({ data: roles });

  console.log(`Created ${createdRoles.count} roles`);

  const permissions: Prisma.PermissionCreateManyInput[] = Object.values(AuthorizationPermissionsEnum).map(permission => ({
    name: permission,
    description: `Permission for ${permission}`,
    companyId: company.id,
  }));

  const createdPermissions = await prisma.permission.createMany({ data: permissions });

  console.log(`Created ${createdPermissions.count} permissions`);

  const findedRole = await prisma.role.findFirst({
    where: {
      name: {
        equals: AuthorizationRolesEnum.ADMIN,
      }
    },
  });

  const findedPermission = await prisma.permission.findMany({
    where: {
      companyId: company.id,
    }
  })

  const rolePermissions: Prisma.RolePermissionCreateManyInput[] = findedPermission.map(permission => ({
    roleId: findedRole!.id,
    permissionId: permission.id,
  }));

  const createdRolePermissions = await prisma.rolePermission.createMany({ data: rolePermissions });

  console.log(`Created ${createdRolePermissions.count} role permissions`);
}