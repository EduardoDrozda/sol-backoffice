import { ContextService } from "@common/context";
import { Prisma } from "@prisma/client";

export const withCustomOperations = (contextService: ContextService) => {
  return Prisma.defineExtension((prisma) => {
    return prisma.$extends({
      name: 'custom-operations',
      query: {
        $allModels: {
          async findMany({ model, args, query }) {
            if (model === 'AuditLog') return query(args);

            const companyId = contextService.getUser()?.companyId;
            args.where = {
              ...args.where,
              companyId,
              deletedAt: null,
            };

            return query(args);
          },
          async findFirst({ model, args, query }) {
            if (model === 'AuditLog') return query(args);

            const companyId = contextService.getUser()?.companyId;
            args.where = {
              ...args.where,
              companyId,
              deletedAt: null,
            };

            return query(args);
          },
          async findUnique({ model, args, query }) {
            if (model === 'AuditLog') return query(args);

            const companyId = contextService.getUser()?.companyId;
            args.where = {
              ...args.where,
              companyId,
              deletedAt: null,
            };

            return query(args);
          },
          async update({ model, args, query }) {
            if (model === 'AuditLog') return query(args);

            const user = contextService.getUser();

            args.where = { ...args.where, companyId: user?.companyId, deletedAt: null };;

            if (args.data.deletedAt) {
              args.data.deletedById = user?.id;
              return query(args);
            }

            args.data.updatedById = user?.id;

            return query(args);
          },
          async updateMany({ model, args, query }) {
            if (model === 'AuditLog') return query(args);

            const user = contextService.getUser();

            args.where = { ...args.where, companyId: user?.companyId, deletedAt: null };

            if (args.data.deletedAt) {
              args.data.deletedById = user?.id;
              return query(args);
            }

            args.data.updatedById = user?.id;

            return query(args);
          },
          async create({ model, args, query }) {
            if (model === 'AuditLog') return query(args);

            const user = contextService.getUser();

            if (model !== 'Company') {
              args.data.createdBy = {
                connect: {
                  id: user?.id
                }
              }
              args.data.company = {
                connect: {
                  id: user?.companyId
                }
              }
            }

            return query(args);
          },
          async count({ model, args, query }) {
            if (model === 'AuditLog') return query(args);

            const user = contextService.getUser();
            args.where = { ...args.where, companyId: user?.companyId, deletedAt: null };

            return query(args);
          },
        },
      },
    });
  });
};