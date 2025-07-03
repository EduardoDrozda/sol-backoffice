import { GetPaginationBaseDto } from "@application/dtos/base/requests";
import { Controller, Get, Query } from "@nestjs/common";

@Controller('expense-categories')
export class ExpenseCategoryController {

  @Get()
  async findAll(@Query() searchParams: GetPaginationBaseDto) {
   
  }
}