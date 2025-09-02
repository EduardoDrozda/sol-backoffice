import { IUserRepository, IUserRepositoryFindParams, IUserRepositoryFindAllResult, IUserRepositoryFindPaginatedParams } from '@domain/interfaces/repositories';
import { CreateUserInput, CreateUserTokenInput, UserModel, UserTokenModel, UserWithRelations } from '@domain/models';
import { DatabaseService } from '@infrastructure/database';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByEmail(email: string, params?: IUserRepositoryFindParams): Promise<any | null> {
    return this.databaseService.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
      include: {
        role: params?.includeRole,
        company: params?.includeCompany,
      },
    });
  }

  async findById(id: string, params?: IUserRepositoryFindParams): Promise<UserWithRelations | null> {
    return this.databaseService.user.findFirst({
      where: { id },
      include: {
        role: params?.includeRole,
        company: params?.includeCompany,
        userTokens: params?.includeUserTokens
      },
    });
  }

  async findByUserToken(token: string): Promise<UserTokenModel | null> {
    return this.databaseService.userToken.findFirst({
      where: { token }
    });
  }

  async findAll(params?: IUserRepositoryFindPaginatedParams): Promise<IUserRepositoryFindAllResult> {
    let whereClause: Prisma.UserWhereInput = {};
    let orderBy: Prisma.UserOrderByWithRelationInput = {};
    let include: Prisma.UserInclude = {
      role: params?.includeRole,
      company: params?.includeCompany,
      userTokens: params?.includeUserTokens,
    };

    if (params?.search) {
      whereClause = {
        OR: [
          { name: { contains: params?.search, mode: 'insensitive' } },
          { email: { contains: params?.search, mode: 'insensitive' } },
        ],
      };
    }

    if (params?.sort && params?.order) {
      orderBy = {
        [params.sort]: params.order,
      };
    }

    if(params?.sort === 'role') {
      include = {
        ...include,
        role: true
      }

      orderBy = {
        role: {
          name: params.order,
        }
      }
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const total = await this.databaseService.user.count({
      where: whereClause,
    });

    const data = await this.databaseService.user.findMany({
      include,
      where: whereClause,
      orderBy,
      skip,
      take: limit,
    });

    return {
      data,
      total,
    };
  }

  async create(user: CreateUserInput): Promise<UserModel> {
    return this.databaseService.user.create({
      data: user,
    });
  }

  async activateUser(id: string): Promise<void> {
    await this.databaseService.user.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async deactivateUser(id: string): Promise<void> {
    await this.databaseService.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async createUserToken(data: CreateUserTokenInput): Promise<UserTokenModel> {
    return this.databaseService.userToken.create({
      data,
    });
  }

  async updatePassword(id: string, password: string): Promise<void> {
    await this.databaseService.user.update({
      where: { id },
      data: { password },
    });
  }

  async deleteUserToken(token: string): Promise<void> {
    await this.databaseService.userToken.deleteMany({
      where: { token },
    });
  }

  async deleteUserTokensByUserIdAndType(userId: string, type: string): Promise<void> {
    await this.databaseService.userToken.deleteMany({
      where: { 
        userId,
        type
      }
    });
  }
}
