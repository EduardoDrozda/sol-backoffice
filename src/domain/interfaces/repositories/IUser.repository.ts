import { CreateUserInput } from "@domain/models";
import { UserModel } from "@domain/models";


export const USER_REPOSITORY = Symbol("IUserRepository");

export interface IUserRepository {
  findByEmail(email: string): Promise<UserModel | null>;
  create(user: CreateUserInput): Promise<UserModel>;
  findById(id: string): Promise<UserModel | null>;
}