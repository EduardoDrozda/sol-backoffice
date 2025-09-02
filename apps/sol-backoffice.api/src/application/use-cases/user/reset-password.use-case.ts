import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IBaseUseCase } from "../IBase.use-case";
import { ResetPasswordDTO } from "@application/dtos/user/requests/reset-password.dto";
import { USER_REPOSITORY } from "@domain/interfaces/repositories";
import { IUserRepository } from "@domain/interfaces/repositories";
import { LoggerService } from "@common/logger";
import { HashService } from "@common/hash";
import { TokenTypeEnum } from "@domain/enums";

@Injectable()
export class ResetPasswordUseCase implements IBaseUseCase<ResetPasswordDTO, void> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly loggerService: LoggerService,
    private readonly hashService: HashService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(data: ResetPasswordDTO): Promise<void> {
    this.loggerService.log(`Resetting password with token: ${data.token}`);

    const userToken = await this.getAndValidateUserToken(data.token);
    const user = await this.getUserOrThrow(userToken.userId);
    const hashedPassword = await this.hashPassword(data.password);
    await this.updateUserPassword(user.id, hashedPassword);
    await this.deleteUserToken(data.token);
    this.loggerService.log(`Password reset successfully for user: ${user.id}`);
  }

  private async getAndValidateUserToken(token: string) {
    const userToken = await this.userRepository.findByUserToken(token);
    if (!userToken || userToken.type !== TokenTypeEnum.FORGOT_PASSWORD) {
      throw new BadRequestException('Invalid token type');
    }
    if (userToken.expiresAt && userToken.expiresAt < new Date()) {
      throw new BadRequestException('Token has expired');
    }
    return userToken;
  }

  private async getUserOrThrow(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    return this.hashService.hash(password);
  }

  private async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    await this.userRepository.updatePassword(userId, hashedPassword);
  }

  private async deleteUserToken(token: string): Promise<void> {
    await this.userRepository.deleteUserToken(token);
  }
} 