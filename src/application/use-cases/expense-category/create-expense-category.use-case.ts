import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { CreateExpenseCategoryRequestDto } from '@application/dtos/expense-category/request';
import { GetExpenseCategoryResponseDto } from '@application/dtos/expense-category/response';
import {
  EXPENSE_CATEGORY_REPOSITORY,
  IExpenseCategoryRepository,
} from '@domain/interfaces/repositories';
import { LoggerService } from '@common/logger';
import { ContextService } from '@common/context';

@Injectable()
export class CreateExpenseCategoryUseCase
  implements
    IBaseUseCase<CreateExpenseCategoryRequestDto, GetExpenseCategoryResponseDto>
{
  constructor(
    @Inject(EXPENSE_CATEGORY_REPOSITORY)
    private readonly categoryExpenseRepository: IExpenseCategoryRepository,
    private readonly loggerService: LoggerService,
    private readonly contextService: ContextService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(
    data: CreateExpenseCategoryRequestDto,
  ): Promise<GetExpenseCategoryResponseDto> {
    this.loggerService.log(
      `Creating expense category with data: ${JSON.stringify(data)}`,
    );

    const companyId = this.contextService.getUser()?.companyId;

    const existingCategory = await this.categoryExpenseRepository.findByName(
      data.name,
    );

    if (existingCategory) {
      this.loggerService.warn(
        `Expense category with name "${data.name}" already exists for company ID ${companyId}`,
      );
      throw new ConflictException(
        `Expense category with name "${data.name}" already exists.`,
      );
    }

    return this.categoryExpenseRepository.create({
      name: data.name,
      description: data.description,
      icon: data.icon,
      color: data.color,
      company: {
        connect: {
          id: companyId,
        },
      },
    });
  }
}
