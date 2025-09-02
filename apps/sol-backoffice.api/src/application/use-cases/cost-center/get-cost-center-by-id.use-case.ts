import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { GetCostCenterResponseDto } from '@application/dtos/cost-center/response';
import {
  COST_CENTER_REPOSITORY,
  ICostCenterRepository,
} from '@domain/interfaces/repositories';
import { LoggerService } from '@common/logger';

@Injectable()
export class GetCostCenterByIdUseCase
  implements IBaseUseCase<string, GetCostCenterResponseDto>
{
  constructor(
    @Inject(COST_CENTER_REPOSITORY)
    private readonly costCenterRepository: ICostCenterRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(id: string): Promise<GetCostCenterResponseDto> {
    this.logger.log(`Get cost center by id: ${id}`);

    const costCenter = await this.costCenterRepository.findById(id);

    if (!costCenter) {
      throw new NotFoundException('Cost center not found');
    }

    return {
      id: costCenter.id,
      name: costCenter.name,
      description: costCenter.description,
      createdAt: costCenter.createdAt,
      updatedAt: costCenter.updatedAt,
    };
  }
}
