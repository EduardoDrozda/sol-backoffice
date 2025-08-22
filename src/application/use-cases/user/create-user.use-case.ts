import { CreateUserRequestDTO } from '@application/dtos/user/requests';
import { HashService } from '@common/hash';
import { LoggerService } from '@common/logger';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '@domain/interfaces/repositories';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { AuthenticationService } from '@common/authentication';
import { EnviromentService } from '@common/enviroment';
import { QueueEmailProducer } from '@common/queue/email/producers';
import { EmailTypeEnum, SendEmailOptions } from '@common/email';
import { UserModel } from '@domain/models';
import { TokenTypeEnum } from '@domain/enums';
import { DateHelper } from '@application/helpers';


@Injectable()
export class CreateUserUseCase
  implements IBaseUseCase<CreateUserRequestDTO, void> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly hashService: HashService,
    private readonly loggerService: LoggerService,
    private readonly authenticationService: AuthenticationService,
    private readonly queueEmailProducer: QueueEmailProducer,
    private readonly enviromentService: EnviromentService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(data: CreateUserRequestDTO): Promise<void> {
    this.loggerService.log(`Creating user with data: ${JSON.stringify(data)}`);

    await this.ensureUserDoesNotExist(data.email);
    const loggedUser = this.getLoggedUser();
    const emailConfirmationToken = await this.generateEmailConfirmationToken(data.email);
    const newUser = await this.createUser(data, loggedUser, emailConfirmationToken);
    this.loggerService.log(`User created with id: ${newUser.id}`);
    await this.sendWelcomeEmailToQueue(newUser, emailConfirmationToken);
    this.loggerService.log(`Email confirmation job sent to queue: ${newUser.email}`);
  }

  private async ensureUserDoesNotExist(email: string): Promise<void> {
    const findedUser = await this.userRepository.findByEmail(email);
    if (findedUser) {
      this.loggerService.warn(`User with email ${email} already exists.`);
      throw new ConflictException('User already exists');
    }
  }

  private getLoggedUser() {
    const session = this.authenticationService.getSession();
    return session?.user;
  }

  private async generateEmailConfirmationToken(email: string): Promise<string> {
    return this.hashService.hash(email);
  }

  private async createUser(data: CreateUserRequestDTO, loggedUser: any, emailConfirmationToken: string) {
    const hours = 24; // Token válido por 24 horas
    const expiresAt = DateHelper.addHours(new Date(), hours);
    
    return this.userRepository.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: {
        connect: {
          id: data.roleId,
        },
      },
      company: {
        connect: {
          id: loggedUser!.companyId,
        },
      },
      userTokens: {
        create: {
          token: emailConfirmationToken,
          type: TokenTypeEnum.EMAIL_CONFIRMATION,
          expiresAt
        }
      },
    });
  }

  private async sendWelcomeEmailToQueue(user: UserModel, emailConfirmationToken: string) {

    const emailJob: SendEmailOptions = {
      to: user.email,
      type: EmailTypeEnum.WELCOME,
      context: {
        userName: user.name,
        loginUrl: `${this.enviromentService.get('FRONTEND_URL')}/confirm-email?token=${emailConfirmationToken}`,
        expiresAt: 24,
      },
    };

    await this.queueEmailProducer.sendEmail(emailJob);
  }
}