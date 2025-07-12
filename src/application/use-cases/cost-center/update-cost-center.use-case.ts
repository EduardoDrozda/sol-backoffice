import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { UpdateCostCenterRequestDto } from '@application/dtos/cost-center/request';
import { GetCostCenterResponseDto } from '@application/dtos/cost-center/response';
import {
  COST_CENTER_REPOSITORY,
  ICostCenterRepository,
} from '@domain/interfaces/repositories';
import { LoggerService } from '@common/logger';

@Injectable()
export class UpdateCostCenterUseCase
  implements IBaseUseCase<UpdateCostCenterRequestDto, GetCostCenterResponseDto>
{
  constructor(
    @Inject(COST_CENTER_REPOSITORY)
    private readonly costCenterRepository: ICostCenterRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(
    data: UpdateCostCenterRequestDto,
  ): Promise<GetCostCenterResponseDto> {
    this.logger.log(`Updating cost center: ${data.id}`);

    const costCenter = await this.costCenterRepository.findById(data.id);

    if (!costCenter) {
      throw new NotFoundException('Cost center not found');
    }

    const updatedCostCenter = await this.costCenterRepository.update(
      data.id,
      data,
    );

    return {
      id: updatedCostCenter.id,
      name: updatedCostCenter.name,
      description: updatedCostCenter.description,
      createdAt: updatedCostCenter.createdAt,
      updatedAt: updatedCostCenter.updatedAt,
    };
  }
}
