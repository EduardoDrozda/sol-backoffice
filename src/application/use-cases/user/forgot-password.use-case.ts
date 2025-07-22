import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IBaseUseCase } from "../IBase.use-case";
import { ForgotPasswordDTO } from "@application/dtos/user/requests/forgot-password.dto";
import { USER_REPOSITORY } from "@domain/interfaces/repositories";
import { IUserRepository } from "@domain/interfaces/repositories";
import { QueueEmailProducer } from "@common/queue/email/producers";
import { LoggerService } from "@common/logger";
import { HashService } from "@common/hash";
import { TokenTypeEnum } from "@domain/enums";
import { DateHelper } from "@application/helpers";
import { EmailTypeEnum } from "@common/email";
import { EnviromentService } from "@common/enviroment";

@Injectable()
export class ForgotPasswordUseCase implements IBaseUseCase<ForgotPasswordDTO, void> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly loggerService: LoggerService,
    private readonly hashService: HashService,
    private readonly queueEmailProducer: QueueEmailProducer,
    private readonly enviromentService: EnviromentService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(data: ForgotPasswordDTO): Promise<void> {
    this.loggerService.log(`Forgot password for user with email: ${data.email}`);
    const user = await this.getUserOrThrow(data.email);
    const { token, expiresAt } = await this.createUserToken(user.id);
    await this.sendForgotPasswordEmail(user, token, expiresAt);
  }

  private async getUserOrThrow(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private async createUserToken(userId: string) {
    const hours = 1;
    const expiresAt = DateHelper.addHours(new Date(), hours);
    const token = await this.hashService.hash(`${userId}-${TokenTypeEnum.FORGOT_PASSWORD}`);
    const userToken = await this.userRepository.createUserToken({
      user: { connect: { id: userId } },
      token,
      type: TokenTypeEnum.FORGOT_PASSWORD,
      expiresAt,
    });
    return { token: userToken.token, expiresAt: hours };
  }

  private async sendForgotPasswordEmail(user: any, token: string, expiresAt: number) {
    await this.queueEmailProducer.sendEmail({
      to: user.email,
      type: EmailTypeEnum.FORGOT_PASSWORD,
      context: {
        userName: user.name,
        resetUrl: `${this.enviromentService.get('FRONTEND_URL')}/reset-password?token=${token}`,
        expiresAt,
      },
    });
  }
}