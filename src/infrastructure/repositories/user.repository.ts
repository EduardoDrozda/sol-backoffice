import { IUserRepository } from "@domain/interfaces/repositories";
import { CreateUserInput, UserModel } from "@domain/models";
import { DatabaseService } from "@infrastructure/database";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  async findByEmail(email: string): Promise<UserModel | null> {
    return this.databaseService.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        }
      },
    });
  }

  async create(user: CreateUserInput): Promise<UserModel> {
    return this.databaseService.user.create({
      data: user,
    });
  }

  async findById(id: string): Promise<UserModel | null> {
    return this.databaseService.user.findFirst({
      where: { id },
    });
  }
}