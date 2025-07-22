import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IBaseUseCase } from "../IBase.use-case";
import { ConfirmUserDTO } from "@application/dtos/user/requests";
import { IUserRepository, USER_REPOSITORY } from "@domain/interfaces/repositories";
import { LoggerService } from "@common/logger";
import { TokenTypeEnum } from "@domain/enums";

@Injectable()
export class ConfirmUserUseCase implements IBaseUseCase<ConfirmUserDTO, void> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(data: ConfirmUserDTO): Promise<void> {
    this.loggerService.log(`Confirming user with token: ${data.token}`);
    const userToken = await this.getAndValidateUserToken(data.token);
    const user = await this.getUserOrThrow(userToken.userId);
    this.ensureUserNotAlreadyConfirmed(user);
    await this.activateUser(user.id);
    await this.deleteUserToken(data.token);
  }

  private async getAndValidateUserToken(token: string) {
    const userToken = await this.userRepository.findByUserToken(token);
    if (!userToken || userToken.type !== TokenTypeEnum.EMAIL_CONFIRMATION) {
      throw new BadRequestException('Invalid token');
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

  private ensureUserNotAlreadyConfirmed(user: any): void {
    if (user.isActive) {
      throw new BadRequestException('User already confirmed');
    }
  }

  private async activateUser(userId: string): Promise<void> {
    await this.userRepository.activateUser(userId);
  }

  private async deleteUserToken(token: string): Promise<void> {
    await this.userRepository.deleteUserToken(token);
  }
}