import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { LoggerService } from '@common/logger';
import { GetExpenseCategoryResponseDto } from '@application/dtos/expense-category/response';
import {
  EXPENSE_CATEGORY_REPOSITORY,
  IExpenseCategoryRepository,
} from '@domain/interfaces/repositories';
import { UpdateExpenseCategoryRequestDto } from '@application/dtos/expense-category/request';

@Injectable()
export class UpdateExpenseCategoryUseCase
  implements
    IBaseUseCase<UpdateExpenseCategoryRequestDto, GetExpenseCategoryResponseDto>
{
  constructor(
    @Inject(EXPENSE_CATEGORY_REPOSITORY)
    private readonly expenseCategoryRepository: IExpenseCategoryRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(
    request: UpdateExpenseCategoryRequestDto,
  ): Promise<GetExpenseCategoryResponseDto> {
    this.loggerService.log(`Updating expense category with ID: ${request.id}`);

    const existingCategory = await this.expenseCategoryRepository.findById(
      request.id,
    );

    if (!existingCategory) {
      this.loggerService.warn(
        `Expense category with ID ${request.id} not found`,
      );
      throw new NotFoundException(
        `Expense category with ID ${request.id} not found.`,
      );
    }

    const result = await this.expenseCategoryRepository.update({
      id: request.id,
      name: request.name!,
      description: request.description!,
      icon: request.icon!,
      color: request.color!,
    });

    this.loggerService.log(
      `Expense category with ID ${request.id} updated successfully.`,
    );
    return result;
  }
}
