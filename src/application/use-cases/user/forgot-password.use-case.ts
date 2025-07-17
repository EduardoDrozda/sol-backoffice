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

    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hours = 1;
    const expiresAt = DateHelper.addHours(new Date(), hours);

    const userToken = await this.userRepository.createUserToken({
      user: {
        connect: {
          id: user.id,
        },
      },
      token: await this.hashService.hash(`${user.id}-${TokenTypeEnum.FORGOT_PASSWORD}`),
      type: TokenTypeEnum.FORGOT_PASSWORD,
      expiresAt,
    });

    await this.queueEmailProducer.sendEmail({
      to: user.email,
      type: EmailTypeEnum.FORGOT_PASSWORD,
      context: {
        userName: user.name,
        resetUrl: `${this.enviromentService.get('FRONTEND_URL')}/reset-password?token=${userToken.token}`,
        expiresAt: hours,
      },
    });
  }
}