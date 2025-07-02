import { Prisma } from '@prisma/client';

function modelSupportsSoftDelete(args: any) {
  return !args?.where || 'deletedAt' in args.where || args.where?.deletedAt === undefined;
}

export const softDeleteExtension = Prisma.defineExtension((prisma) => {
  return prisma.$extends({
    query: {
      $allModels: {
        async findMany({ args, query }) {
          if (modelSupportsSoftDelete(args)) {
            args.where = {
              ...args.where,
              deletedAt: null,
            };
          }
          return query(args);
        },
        async findFirst({ args, query }) {
          if (modelSupportsSoftDelete(args)) {
            args.where = {
              ...args.where,
              deletedAt: null,
            };
          }
          return query(args);
        },
        async findUnique({ args, query }) {
          return query(args);
        },
        async delete({ args, model }) {
          throw new Error(
            `[Soft Delete Error] Use update { deletedAt: new Date() } instead of delete on ${model}.`,
          );
        },
        async deleteMany({ args, model }) {
          throw new Error(
            `[Soft Delete Error] Use updateMany { deletedAt: new Date() } instead of deleteMany on ${model}.`,
          );
        },
      },
    },
  });
});
