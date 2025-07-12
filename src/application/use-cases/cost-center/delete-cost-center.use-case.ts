import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import {
  COST_CENTER_REPOSITORY,
  ICostCenterRepository,
} from '@domain/interfaces/repositories';
import { LoggerService } from '@common/logger';

@Injectable()
export class DeleteCostCenterUseCase implements IBaseUseCase<string, void> {
  constructor(
    @Inject(COST_CENTER_REPOSITORY)
    private readonly costCenterRepository: ICostCenterRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(id: string): Promise<void> {
    this.logger.log(`Deleting cost center: ${id}`);

    const costCenter = await this.costCenterRepository.findById(id);

    if (!costCenter) {
      throw new NotFoundException('Cost center not found');
    }

    await this.costCenterRepository.delete(id);
  }
}
