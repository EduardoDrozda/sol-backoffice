import { ContextService } from '@common/context';
import { Prisma } from '@prisma/client';


export function withColumnBy(contextService: ContextService) {
  return Prisma.defineExtension({
    name: 'column-by',
    query: {
      $allModels: {
        async $allOperations(args) {
          const { model, operation, args: opArgs, query } = args;
          const user = contextService.getUser() as any

          if (operation === 'create' && model !== 'AuditLog') {
              const data = opArgs.data as any;
              data.createdBy = {
                connect: {
                  id: user.id
                }
              }
              opArgs.data = data;
              return query(opArgs);
            }

            if (operation === 'update' && model !== 'AuditLog') {
              const data = opArgs.data as any;

              if (data.deletedAt) {
                data.deletedBy = {
                  connect: {
                    id: user.id
                  }
                }
                return query(opArgs);
              }

              data.updatedBy = {
                connect: {
                  id: user.id
                }
              }
              opArgs.data = data;
              return query(opArgs);
            }

            if (operation === 'createMany' && model !== 'AuditLog') {
              const data = opArgs.data as any[];

              opArgs.data = data.map((item: any) => {
                item.createdBy = {
                  connect: {
                    id: user.id
                  }
                }
              }) as any;

            return query(opArgs);
          }

          if (operation === 'updateMany' && model !== 'AuditLog') {
            const data = opArgs.data as any[];
            opArgs.data = data.map((item: any) => {
              item.updatedBy = {
                connect: {
                  id: user.id
                }
              }
            }) as any;
            return query(opArgs);
          }

          return query(opArgs);
        }
      }
    }
  })
}
