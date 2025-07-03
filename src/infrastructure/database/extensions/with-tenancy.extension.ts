import { ContextService } from '@common/context';
import { Prisma } from '@prisma/client';

const excludedModelsAndActions = new Map<string, string[]>([
  ['User', ['findFirst', 'findUnique']],
]);

function shouldApplyTenant(model: string, action: string) {
  const excludedActions = excludedModelsAndActions.get(model);
  return !(excludedActions && excludedActions.includes(action));
}

export function withTenancy(contextService: ContextService) {
  return Prisma.defineExtension((prisma) => {
    const companyId = contextService.getUser()?.companyId;
    return prisma.$extends({
      query: {
        $allModels: {
          async findMany({ model, args, query }) {
            if (shouldApplyTenant(model, 'findMany')) {
              args.where = {
                ...args.where,
                companyId,
              };
            }
            return query(args);
          },
          async findFirst({ model, args, query }) {
            if (shouldApplyTenant(model, 'findFirst')) {
              args.where = {
                ...args.where,
                companyId,
              };
            }
            return query(args);
          },
          async findUnique({ model, args, query }) {
            if (shouldApplyTenant(model, 'findUnique')) {
              args.where = {
                ...args.where,
                companyId,
              };
            }
            return query(args);
          },
          async update({ model, args, query }) {
            if (shouldApplyTenant(model, 'update')) {
              args.where = {
                ...args.where,
                companyId,
              };
            }
            return query(args);
          },
          async updateMany({ model, args, query }) {
            if (shouldApplyTenant(model, 'updateMany')) {
              args.where = {
                ...args.where,
                companyId,
              };
            }
            return query(args);
          },
          async count({ model, args, query }) {
            if (shouldApplyTenant(model, 'count')) {
              args.where = {
                ...args.where,
                companyId,
              };
            }
            return query(args);
          },
        },
      },
    });
  });
}
