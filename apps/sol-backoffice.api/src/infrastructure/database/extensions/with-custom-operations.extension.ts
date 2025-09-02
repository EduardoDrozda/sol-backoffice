import { AuthenticationService } from '@common/authentication';
import { ForbiddenOperationException } from '@domain/exceptions';
import { Prisma } from '@prisma/client';


export const withCustomOperations = (authenticationService: AuthenticationService) => {
  return Prisma.defineExtension((prisma) => {
    return prisma.$extends({
      name: 'custom-operations',
      query: {
        $allModels: {
          async findMany({ model, args, query }) {
            if (model === 'AuditLog') return query(args);

            const session = authenticationService.getSession();
            const user = session?.user;
            const companyId = user?.companyId;
            
            args.where = {
              ...args.where,
              companyId,
              deletedAt: null,
            };

            return query(args);
          },
          async findFirst({ model, args, query }) {
            if (model === 'AuditLog' || model === 'UserToken') return query(args);

            const session = authenticationService.getSession();
            const user = session?.user;
            const companyId = user?.companyId;

            args.where = {
              ...args.where,
              companyId,
              deletedAt: null,
            };

            return query(args);
          },
          async findUnique({ model, args, query }) {
            if (model === 'AuditLog') return query(args);

            const session = authenticationService.getSession();
            const user = session?.user;
            const companyId = user?.companyId;
            
            args.where = {
              ...args.where,
              companyId,
              deletedAt: null,
            };

            return query(args);
          },
          async update({ model, args, query }) {
            if (model === 'AuditLog' || model === 'UserToken') return query(args);

            const session = authenticationService.getSession();
            const user = session?.user;

            args.where = {
              ...args.where,
              companyId: user?.companyId,
              deletedAt: null,
            };

            if (args.data.deletedAt) {
              args.data.deletedById = user?.id;
              return query(args);
            }

            args.data.updatedById = user?.id;

            return query(args);
          },
          async updateMany({ model, args, query }) {
            if (model === 'AuditLog' || model === 'UserToken') return query(args);

            const session = authenticationService.getSession();
            const user = session?.user;

            args.where = {
              ...args.where,
              companyId: user?.companyId,
              deletedAt: null,
            };

            if (args.data.deletedAt) {
              args.data.deletedById = user?.id;
              return query(args);
            }

            args.data.updatedById = user?.id;

            return query(args);
          },
          async create({ model, args, query }) {
            if (model === 'AuditLog' || model === 'UserToken') return query(args);
            const session = authenticationService.getSession();
            const user = session?.user;

            (args.data as any).createdById = user?.id;
            return query(args);
          },
          async count({ model, args, query }) {
            if (model === 'AuditLog' || model === 'UserToken') return query(args);

            const session = authenticationService.getSession();
            const user = session?.user;

            args.where = {
              ...args.where,
              companyId: user?.companyId,
              deletedAt: null,
            };

            return query(args);
          },
          async delete({ model, args, query }) {
            if (model === 'AuditLog' || model === 'UserToken' || model === 'RolePermission') return query(args);
            throw new ForbiddenOperationException('This operation is not allowed');
          },
          async deleteMany({ model, args, query }) {
            if (model === 'AuditLog' || model === 'UserToken' || model === 'RolePermission') return query(args);
            throw new ForbiddenOperationException('This operation is not allowed');
          },
        },
      },
    });
  });
};
