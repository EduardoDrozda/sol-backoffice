import { Prisma, PrismaClient } from '@prisma/client';
import { AuthenticationService } from '@common/authentication';

const auditPrisma = new PrismaClient();

export function withAuditLog(authenticationService: AuthenticationService) {
  return Prisma.defineExtension({
    name: 'audit-log',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args: opArgs, query }) {
          const isAuditable = ['create', 'update', 'delete'].includes(
            operation,
          );
          const isAuditLogModel = model === 'AuditLog';

          if (!isAuditable || isAuditLogModel) {
            return query(opArgs);
          }

          const session = authenticationService.getSession();
          const user = session?.user;
          let oldValue: any = null;
          let newValue: any = null;
          let recordId: string = '';

          if (
            (operation === 'update' || operation === 'delete') &&
            opArgs?.where
          ) {
            try {
              // Handle RolePermission model which has composite key
              if (
                model === 'RolePermission' &&
                opArgs.where.roleId &&
                opArgs.where.permissionId
              ) {
                oldValue = await (auditPrisma as any)[model].findUnique({
                  where: {
                    roleId_permissionId: {
                      roleId: opArgs.where.roleId,
                      permissionId: opArgs.where.permissionId,
                    },
                  },
                });
                recordId = `${opArgs.where.roleId}_${opArgs.where.permissionId}`;
              } else if ((opArgs.where as any).id) {
                // Handle other models with single id
                oldValue = await (auditPrisma as any)[model].findUnique({
                  where: { id: (opArgs.where as any).id },
                });
                recordId = (opArgs.where as any).id.toString();
              }
            } catch (error) {
              console.error(`Failed to fetch old value for ${model}:`, error);
            }
          }

          const result = await query(opArgs);

          if (
            (operation === 'create' || operation === 'update') &&
            result &&
            typeof result === 'object'
          ) {
            newValue = result;
            // Handle RolePermission model which has composite key
            if (
              model === 'RolePermission' &&
              'roleId' in result &&
              'permissionId' in result
            ) {
              recordId = recordId || `${result.roleId}_${result.permissionId}`;
            } else if ('id' in result) {
              // Handle other models with single id
              recordId = recordId || result.id?.toString() || '';
            }
          }

          const valuesChanged =
            JSON.stringify(oldValue) !== JSON.stringify(newValue);

          if (recordId && valuesChanged) {
            const action = newValue.deletedAt ? 'delete' : operation;
            await (auditPrisma as any).auditLog.create({
              data: {
                table: model,
                action: action,
                recordId,
                companyId: user?.companyId ?? 'unknown',
                userId: user?.id ?? null,
                oldValue: oldValue as Prisma.InputJsonValue,
                newValue: newValue as Prisma.InputJsonValue,
              },
            });
          }

          return result;
        },
      },
    },
  });
}
