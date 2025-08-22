import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { ResendConfirmationEmailDTO } from '@application/dtos/user/requests';
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
export class ResendConfirmationEmailUseCase implements IBaseUseCase<ResendConfirmationEmailDTO, void> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly loggerService: LoggerService,
    private readonly hashService: HashService,
    private readonly queueEmailProducer: QueueEmailProducer,
    private readonly enviromentService: EnviromentService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(data: ResendConfirmationEmailDTO): Promise<void> {
    this.loggerService.log(`Resending confirmation email for user: ${data.userId}`);
    
    const user = await this.getUserOrThrow(data.userId);
    const { token, expiresAt } = await this.createEmailConfirmationToken(user.id);
    await this.sendConfirmationEmail(user, token, expiresAt);
    
    this.loggerService.log(`Confirmation email resent for user: ${user.email}`);
  }

  private async getUserOrThrow(userId: string) {
    const user = await this.userRepository.findById(userId, { includeRole: true });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private async createEmailConfirmationToken(userId: string) {
    // Limpar tokens antigos de confirmação de email
    await this.userRepository.deleteUserTokensByUserIdAndType(userId, TokenTypeEnum.EMAIL_CONFIRMATION);
    
    const hours = 24; // Token válido por 24 horas
    const expiresAt = DateHelper.addHours(new Date(), hours);
    const token = await this.hashService.hash(`${userId}-${TokenTypeEnum.EMAIL_CONFIRMATION}`);
    
    const userToken = await this.userRepository.createUserToken({
      user: { connect: { id: userId } },
      token,
      type: TokenTypeEnum.EMAIL_CONFIRMATION,
      expiresAt,
    });
    
    return { token: userToken.token, expiresAt: hours };
  }

  private async sendConfirmationEmail(user: any, token: string, expiresAt: number) {
    await this.queueEmailProducer.sendEmail({
      to: user.email,
      type: EmailTypeEnum.RESEND_CONFIRMATION,
      context: {
        userName: user.name,
        loginUrl: `${this.enviromentService.get('FRONTEND_URL')}/confirm-email?token=${token}`,
        expiresAt,
      },
    });
  }
}
