import {
  ConflictException,
  Inject,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { CreateCostCenterRequestDto } from '@application/dtos/cost-center/request';

import { LoggerService } from '@common/logger';
import { GetCostCenterResponseDto } from '@application/dtos/cost-center/response';
import {
  COST_CENTER_REPOSITORY,
  ICostCenterRepository,
} from '@domain/interfaces/repositories';
import { AuthenticationService } from '@common/authentication';


@Injectable()
export class CreateCostCenterUseCase
  implements IBaseUseCase<CreateCostCenterRequestDto, GetCostCenterResponseDto>
{
  constructor(
    @Inject(COST_CENTER_REPOSITORY)
    private readonly costCenterRepository: ICostCenterRepository,
    private readonly loggerService: LoggerService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async execute(
    data: CreateCostCenterRequestDto,
  ): Promise<GetCostCenterResponseDto> {
    this.loggerService.log(
      `Creating cost center with data: ${JSON.stringify(data)}`,
    );
    await this.ensureCostCenterNameIsUnique(data.name);
    const user = this.getLoggedUser();
    return this.createCostCenter(data, user);
  }

  private async ensureCostCenterNameIsUnique(name: string): Promise<void> {
    const existingCostCenter = await this.costCenterRepository.findByName(name);
    if (existingCostCenter) {
      this.loggerService.warn(
        `Cost center with name "${name}" already exists`,
      );
      throw new ConflictException(
        `Cost center with name "${name}" already exists.`,
      );
    }
  }

  private getLoggedUser() {
    const session = this.authenticationService.getSession();
    return session?.user;
  }

  private async createCostCenter(data: CreateCostCenterRequestDto, user: any) {
    return this.costCenterRepository.create({
      name: data.name,
      description: data.description,
      company: {
        connect: {
          id: user!.companyId,
        },
      },
    });
  }
}
