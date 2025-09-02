import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import {
  EXPENSE_CATEGORY_REPOSITORY,
  IExpenseCategoryRepository,
} from '@domain/interfaces/repositories';
import { LoggerService } from '@common/logger';

@Injectable()
export class DeleteByIdExpenseCategoryUseCase
  implements IBaseUseCase<string, void>
{
  constructor(
    @Inject(EXPENSE_CATEGORY_REPOSITORY)
    private readonly expenseCategoryRepository: IExpenseCategoryRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(id: string): Promise<void> {
    this.loggerService.log(`Deleting expense category with ID: ${id}`);

    const expenseCategory = await this.expenseCategoryRepository.findById(id);

    if (!expenseCategory) {
      this.loggerService.warn(`Expense category with ID ${id} not found`);
      throw new NotFoundException(`Expense category with ID ${id} not found.`);
    }

    await this.expenseCategoryRepository.delete(id);
  }
}
