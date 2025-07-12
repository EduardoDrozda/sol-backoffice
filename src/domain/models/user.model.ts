import { Prisma, User } from '@prisma/client';

export type UserModel = User;

export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    role: boolean;
    company: boolean;
  };
}>;

export type CreateUserInput = Prisma.UserCreateInput;
