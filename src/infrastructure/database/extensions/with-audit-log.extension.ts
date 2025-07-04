import { Prisma, PrismaClient } from '@prisma/client';
import { ContextService } from '@common/context';

const auditPrisma = new PrismaClient();

export function withAuditLog(contextService: ContextService) {
  return Prisma.defineExtension({
    name: 'audit-log',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args: opArgs, query }) {
          const isAuditable = ['create', 'update', 'delete'].includes(operation);
          const isAuditLogModel = model === 'AuditLog';

          if (!isAuditable || isAuditLogModel) {
            return query(opArgs);
          }

          const user = contextService.getUser();
          let oldValue: any = null;
          let newValue: any = null;
          let recordId: string = '';

          if ((operation === 'update' || operation === 'delete') && opArgs?.where?.id) {
            
            try {
              oldValue = await (auditPrisma as any)[model].findUnique({
                where: { id: opArgs.where.id },
              });
              recordId = opArgs.where.id.toString();
            } catch (error) {
              console.error(`Failed to fetch old value for ${model}:`, error);
            }
          }

          const result = await query(opArgs);

          if ((operation === 'create' || operation === 'update') && result && typeof result === 'object' && 'id' in result) {
            newValue = result;
            recordId = recordId || result.id?.toString() || '';
          }

          const valuesChanged = JSON.stringify(oldValue) !== JSON.stringify(newValue);

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
