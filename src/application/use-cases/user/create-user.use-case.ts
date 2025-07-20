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

    const findedUser = await this.userRepository.findByEmail(data.email);

    if (findedUser) {
      this.loggerService.warn(`User with email ${data.email} already exists.`);
      throw new ConflictException('User already exists');
    }

    const session = this.authenticationService.getSession();
    const loggedUser = session?.user;

    const hashedPassword = await this.hashService.hash(data.password);

    const emailConfirmationToken = await this.hashService.hash(data.email);

    const newUser = await this.userRepository.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: {
        connect: {
          id: loggedUser!.companyId,
        },
      },
      userTokens: {
        create: {
          token: emailConfirmationToken,
          type: TokenTypeEnum.EMAIL_CONFIRMATION
        }
      },
      password: hashedPassword,
    });

    this.loggerService.log(`User created with id: ${newUser.id}`);

    await this.sendWelcomeEmailToQueue(newUser, emailConfirmationToken);
    this.loggerService.log(`Email confirmation job sent to queue: ${newUser.email}`);
  }

  private async sendWelcomeEmailToQueue(user: UserModel, emailConfirmationToken: string) {

    const emailJob: SendEmailOptions = {
      to: user.email,
      type: EmailTypeEnum.WELCOME,
      context: {
        userName: user.name,
        loginUrl: `${this.enviromentService.get('FRONTEND_URL')}/confirm-email?token=${emailConfirmationToken}`,
      },
    };

    await this.queueEmailProducer.sendEmail(emailJob);
  }
}