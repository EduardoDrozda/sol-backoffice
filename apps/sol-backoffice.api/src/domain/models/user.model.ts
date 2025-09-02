import { Prisma, User, UserToken } from '@prisma/client';

export type UserModel = User;

export type UserTokenModel = UserToken;

export type CreateUserTokenInput = Prisma.UserTokenCreateInput;

export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    role: boolean;
    company: boolean;
    userTokens: boolean;
  };
}>;

export type CreateUserInput = Prisma.UserCreateInput;
