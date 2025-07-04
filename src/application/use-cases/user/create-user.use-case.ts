import { CreateUserRequestDTO } from "@application/dtos/user/requests";
import { HashService } from "@common/hash";
import { LoggerService } from "@common/logger";
import { IUserRepository, USER_REPOSITORY } from "@domain/interfaces/repositories";
import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { IBaseUseCase } from "../IBase.use-case";
import { ContextService } from "@common/context/context.service";

@Injectable()
export class CreateUserUseCase implements IBaseUseCase<CreateUserRequestDTO, void> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly hashService: HashService,
    private readonly loggerService: LoggerService,
    private readonly contextService: ContextService
  ) { 
    this.loggerService.context = this.constructor.name;
  }

  async execute(data: CreateUserRequestDTO): Promise<void> {
    this.loggerService.log(`Creating user with data: ${JSON.stringify(data)}`);

    const findedUser = await this.userRepository.findByEmail(data.email);

    if (findedUser) {
      this.loggerService.warn(`User with email ${data.email} already exists.`);
      throw new ConflictException("User already exists");
    }

    const loggedUser = this.contextService.getUser();
    const hashedPassword = await this.hashService.hash(data.password);

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: {
        connect: {
          id: loggedUser!.companyId
        }
      },
      password: hashedPassword,
    });

    this.loggerService.log(`User created with id: ${user.id}`);
  }
}