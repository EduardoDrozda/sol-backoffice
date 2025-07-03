import { GetPaginationBaseDto } from "@application/dtos/base/requests";
import { CreateExpenseCategoryRequestDto } from "@application/dtos/expense-category/request";
import { CreateExpenseCategoryUseCase } from "@application/use-cases/expense-category";
import { Body, Controller, Get, Post, Query } from "@nestjs/common";

@Controller('expense-categories')
export class ExpenseCategoryController {
  constructor(
    private readonly createExpenseCategoryUseCase: CreateExpenseCategoryUseCase
  ) {}

  @Get()
  async findAll(@Query() searchParams: GetPaginationBaseDto) {
   
  }

  @Post()
  async create(@Body() createExpenseCategoryDto: CreateExpenseCategoryRequestDto) {
    return this.createExpenseCategoryUseCase.execute(createExpenseCategoryDto);
  }
}