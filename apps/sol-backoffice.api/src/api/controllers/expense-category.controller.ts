import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { GetPaginationBaseDto } from '@application/dtos/base/requests';
import {
  CreateExpenseCategoryRequestDto,
  UpdateExpenseCategoryRequestDto,
} from '@application/dtos/expense-category/request';
import {
  CreateExpenseCategoryUseCase,
  DeleteByIdExpenseCategoryUseCase,
  GetAllExpenseCategoryUseCase,
  GetByIdExpenseCategoryUseCase,
  UpdateExpenseCategoryUseCase,
} from '@application/use-cases/expense-category';
import { AuthorizationPermissionsEnum } from '@common/authentication/enums';
import { Authorization } from '@common/authentication';

@Controller('expense-categories')
export class ExpenseCategoryController {
  constructor(
    private readonly createExpenseCategoryUseCase: CreateExpenseCategoryUseCase,
    private readonly getAllExpenseCategoryUseCase: GetAllExpenseCategoryUseCase,
    private readonly getExpenseCategoryByIdUseCase: GetByIdExpenseCategoryUseCase,
    private readonly updateExpenseCategoryUseCase: UpdateExpenseCategoryUseCase,
    private readonly deleteByIdExpenseCategoryUseCase: DeleteByIdExpenseCategoryUseCase,
  ) {}

  @Post()
  @Authorization(AuthorizationPermissionsEnum.CREATE_EXPENSE_CATEGORIES)
  async create(
    @Body() createExpenseCategoryDto: CreateExpenseCategoryRequestDto,
  ) {
    return this.createExpenseCategoryUseCase.execute(createExpenseCategoryDto);
  }

  @Get()
  @Authorization(AuthorizationPermissionsEnum.VIEW_EXPENSE_CATEGORIES)
  async findAll(@Query() searchParams: GetPaginationBaseDto) {
    return this.getAllExpenseCategoryUseCase.execute(searchParams);
  }

  @Get(':id')
  @Authorization(AuthorizationPermissionsEnum.VIEW_EXPENSE_CATEGORIES_BY_ID)
  async findById(@Param('id') id: string) {
    return this.getExpenseCategoryByIdUseCase.execute(id);
  }

  @Patch(':id')
  @Authorization(AuthorizationPermissionsEnum.UPDATE_EXPENSE_CATEGORIES)
  async update(
    @Body() data: UpdateExpenseCategoryRequestDto,
    @Param('id') id: string,
  ) {
    return this.updateExpenseCategoryUseCase.execute({
      ...data,
      id,
    });
  }

  @Delete(':id')
  @Authorization(AuthorizationPermissionsEnum.DELETE_EXPENSE_CATEGORIES)
  async delete(@Param('id') id: string) {
    return this.deleteByIdExpenseCategoryUseCase.execute(id);
  }
}
