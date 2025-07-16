import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IBaseUseCase } from "../IBase.use-case";
import { ConfirmUserDTO } from "@application/dtos/user/requests";
import { IUserRepository, USER_REPOSITORY } from "@domain/interfaces/repositories";
import { LoggerService } from "@common/logger";

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

    const userToken = await this.userRepository.findByUserToken(data.token);

    if (!userToken) {
      throw new NotFoundException('User token not found');
    }

    const user = await this.userRepository.findById(userToken.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isActive) {
      throw new BadRequestException('User already confirmed');
    }

    await this.userRepository.activateUser(user.id);
  }
}