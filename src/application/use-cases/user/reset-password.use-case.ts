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

    const userToken = await this.userRepository.findByUserToken(data.token);

    if (!userToken || userToken.type !== TokenTypeEnum.FORGOT_PASSWORD) {
      throw new BadRequestException('Invalid token type');
    }

    if (userToken.expiresAt && userToken.expiresAt < new Date()) {
      throw new BadRequestException('Token has expired');
    }

    const user = await this.userRepository.findById(userToken.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await this.hashService.hash(data.password);

    await this.userRepository.updatePassword(user.id, hashedPassword);
    await this.userRepository.deleteUserToken(data.token);

    this.loggerService.log(`Password reset successfully for user: ${user.id}`);
  }
} 