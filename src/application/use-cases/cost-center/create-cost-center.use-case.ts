import { ConflictException, Inject, Injectable, NotImplementedException } from "@nestjs/common";
import { IBaseUseCase } from "../IBase.use-case";
import { CreateCostCenterRequestDto } from "@application/dtos/cost-center/request";

import { LoggerService } from "@common/logger";
import { GetCostCenterResponseDto } from "@application/dtos/cost-center/response";
import { COST_CENTER_REPOSITORY, ICostCenterRepository } from "@domain/interfaces/repositories";
import { ContextService } from "@common/context";

@Injectable()
export class CreateCostCenterUseCase implements IBaseUseCase<CreateCostCenterRequestDto, GetCostCenterResponseDto> {
  constructor(
    @Inject(COST_CENTER_REPOSITORY) private readonly costCenterRepository: ICostCenterRepository,
    private readonly loggerService: LoggerService,
    private readonly contextService: ContextService
  ) { }

  async execute(data: CreateCostCenterRequestDto): Promise<GetCostCenterResponseDto> {
    this.loggerService.log(`Creating cost center with data: ${JSON.stringify(data)}`);

    const existingCostCenter = await this.costCenterRepository.findByName(data.name);

    if (existingCostCenter) {
      this.loggerService.warn(`Cost center with name "${data.name}" already exists`);
      throw new ConflictException(`Cost center with name "${data.name}" already exists.`);
    }

    const user = this.contextService.getUser();

    return this.costCenterRepository.create({
      name: data.name,
      description: data.description,
      company: {
        connect: {
          id: user!.companyId
        }
      }
    });
  }
}