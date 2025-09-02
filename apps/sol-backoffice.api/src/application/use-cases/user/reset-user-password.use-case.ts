import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { ResetUserPasswordDTO } from '@application/dtos/user/requests';
import { USER_REPOSITORY } from '@domain/interfaces/repositories';
import { IUserRepository } from '@domain/interfaces/repositories';
import { QueueEmailProducer } from '@common/queue/email/producers';
import { LoggerService } from '@common/logger';
import { HashService } from '@common/hash';
import { TokenTypeEnum } from '@domain/enums';
import { EmailTypeEnum } from '@common/email';
import { EnviromentService } from '@common/enviroment';
import { DateHelper } from '@application/helpers';

@Injectable()
export class ResetUserPasswordUseCase implements IBaseUseCase<ResetUserPasswordDTO, void> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly loggerService: LoggerService,
    private readonly hashService: HashService,
    private readonly queueEmailProducer: QueueEmailProducer,
    private readonly enviromentService: EnviromentService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(data: ResetUserPasswordDTO): Promise<void> {
    this.loggerService.log(`Resetting password for user: ${data.userId}`);
    
    const user = await this.getUserOrThrow(data.userId);
    const { token, expiresAt } = await this.createResetPasswordToken(user.id);
    await this.sendResetPasswordEmail(user, token, expiresAt);
    
    this.loggerService.log(`Reset password email sent for user: ${user.email}`);
  }

  private async getUserOrThrow(userId: string) {
    const user = await this.userRepository.findById(userId, { includeRole: true });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private async createResetPasswordToken(userId: string) {
    // Limpar tokens antigos de reset de senha
    await this.userRepository.deleteUserTokensByUserIdAndType(userId, TokenTypeEnum.FORGOT_PASSWORD);
    
    const hours = 1; // Token válido por 1 hora
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

  private async sendResetPasswordEmail(user: any, token: string, expiresAt: number) {
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
