import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { GetPaginationBaseDto } from "@application/dtos/base/requests";
import { CreateExpenseCategoryRequestDto, UpdateExpenseCategoryRequestDto } from "@application/dtos/expense-category/request";
import {
  CreateExpenseCategoryUseCase,
  DeleteByIdExpenseCategoryUseCase,
  GetAllExpenseCategoryUseCase,
  GetByIdExpenseCategoryUseCase,
  UpdateExpenseCategoryUseCase
} from "@application/use-cases/expense-category";
import { Roles } from "@infrastructure/decorators/role";
import { RolesEnum } from "@domain/enums";

@Controller('expense-categories')
export class ExpenseCategoryController {
  constructor(
    private readonly createExpenseCategoryUseCase: CreateExpenseCategoryUseCase,
    private readonly getAllExpenseCategoryUseCase: GetAllExpenseCategoryUseCase,
    private readonly getExpenseCategoryByIdUseCase: GetByIdExpenseCategoryUseCase,
    private readonly updateExpenseCategoryUseCase: UpdateExpenseCategoryUseCase,
    private readonly deleteByIdExpenseCategoryUseCase: DeleteByIdExpenseCategoryUseCase
  ) { }

  @Roles(RolesEnum.ADMIN)
  @Post()
  async create(@Body() createExpenseCategoryDto: CreateExpenseCategoryRequestDto) {
    return this.createExpenseCategoryUseCase.execute(createExpenseCategoryDto);
  }

  @Get()
  async findAll(@Query() searchParams: GetPaginationBaseDto) {
    return this.getAllExpenseCategoryUseCase.execute(searchParams);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.getExpenseCategoryByIdUseCase.execute(id);
  }

  @Roles(RolesEnum.ADMIN)
  @Patch(':id')
  async update(
    @Body() data: UpdateExpenseCategoryRequestDto,
    @Param('id') id: string
  ) {
    return this.updateExpenseCategoryUseCase.execute({
      ...data,
      id,
    });
  }

  @Roles(RolesEnum.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.deleteByIdExpenseCategoryUseCase.execute(id);
  }
}