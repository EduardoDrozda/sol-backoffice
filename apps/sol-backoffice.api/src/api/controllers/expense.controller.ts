import { CreateExpenseRequestDto, GetExpenseRequestDto } from "@application/dtos/expense/request";
import { CreateExpenseUseCase } from "@application/use-cases/expense/create-expense.use-case";
import { GetAllExpenseUseCase } from "@application/use-cases/expense/get-all-expense.use-case";
import { AuthorizationPermissionsEnum } from "@common/authentication/enums";
import { Authorization } from "@common/authentication";
import { FileRequiredPipe, FileSizeValidationPipe } from "@infrastructure/storage/pipes";
import { Body, Controller, Get, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller('expenses')
export class ExpenseController {

  constructor(
    private readonly createExpenseUseCase: CreateExpenseUseCase,
    private readonly getAllExpenseUseCase: GetAllExpenseUseCase
  ) {}

  @UseInterceptors(FilesInterceptor('files'))
  @Post()
  async create(
    @UploadedFiles(
      new FileRequiredPipe(),
      new FileSizeValidationPipe()
    ) files: Express.Multer.File[],
    @Body() data: CreateExpenseRequestDto,
  ) {
    return this.createExpenseUseCase.execute(data);
  }

  @Get()
  @Authorization(AuthorizationPermissionsEnum.GET_EXPENSES)
  async getAll(@Query() query: GetExpenseRequestDto) {
    return this.getAllExpenseUseCase.execute(query);
  }
}