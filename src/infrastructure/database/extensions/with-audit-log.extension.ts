import { Prisma, PrismaClient } from '@prisma/client';
import { ContextService } from '@common/context';

const auditPrisma = new PrismaClient();

export function withAuditLog(contextService: ContextService) {
  return Prisma.defineExtension({
    name: 'audit-log',
    query: {
      $allModels: {
        async $allOperations(args) {
          const { model, operation, args: opArgs, query } = args;
          const watchedOps = ['create', 'update', 'delete'];

          if (!watchedOps.includes(operation) || model === 'AuditLog') {
            return query(opArgs);
          }

          const user = contextService.getUser();
          let oldValue: any = null;
          let newValue: any = null;
          let recordId: string = '';

          if ((operation === 'update' || operation === 'delete') && opArgs?.where?.id) {
            oldValue = await (auditPrisma as any)[model].findUnique({ where: { id: opArgs.where.id } });
            recordId = opArgs.where.id.toString();
          }

          const result = await query(opArgs);

          if ((operation === 'create' || operation === 'update') && result && typeof result === 'object' && 'id' in result && result.id) {
            newValue = result;
            if (!recordId) {
              recordId = result.id.toString();
            }
          }

          const companyId = user?.companyId ?? 'unknown';
          const userId = user?.id ?? null;

          await (auditPrisma as any).auditLog.create({
            data: {
              table: model,
              action: operation,
              recordId,
              companyId,
              userId,
              oldValue: oldValue as Prisma.InputJsonValue,
              newValue: newValue as Prisma.InputJsonValue,
            },
          });

          return result;
        },
      },
    },
  });
}
