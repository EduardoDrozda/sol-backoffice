import { Prisma, User } from "@prisma/client";

export type UserModel = User;

export type CreateUserInput = Prisma.UserCreateInput;