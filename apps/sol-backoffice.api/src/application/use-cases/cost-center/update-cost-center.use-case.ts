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
    const costCenter = await this.getCostCenterOrThrow(data.id);
    const updatedCostCenter = await this.updateCostCenter(data.id, data);
    return this.mapToGetCostCenterResponseDto(updatedCostCenter);
  }

  private async getCostCenterOrThrow(id: string) {
    const costCenter = await this.costCenterRepository.findById(id);
    if (!costCenter) {
      throw new NotFoundException('Cost center not found');
    }
    return costCenter;
  }

  private async updateCostCenter(id: string, data: UpdateCostCenterRequestDto) {
    return this.costCenterRepository.update(id, data);
  }

  private mapToGetCostCenterResponseDto(costCenter: any): GetCostCenterResponseDto {
    return {
      id: costCenter.id,
      name: costCenter.name,
      description: costCenter.description,
      createdAt: costCenter.createdAt,
      updatedAt: costCenter.updatedAt,
    };
  }
}
