import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { RolesEnum } from "@domain/enums";
import { Roles } from "@infrastructure/decorators/role";
import { CreateCostCenterRequestDto } from "@application/dtos/cost-center/request";
import { CreateCostCenterUseCase, GetAllCostCenterUseCase } from "@application/use-cases/cost-center";
import { GetPaginationBaseDto } from "@application/dtos/base/requests";

@Controller('cost-centers')
export class CostCenterController {
  constructor(
    private readonly createCostCenterUseCase: CreateCostCenterUseCase,
    private readonly getAllCostCenterUseCase: GetAllCostCenterUseCase
  ) { }

  @Post()
  @Roles(RolesEnum.ADMIN)
  async createCostCenter(
    @Body() createCostCenterDto: CreateCostCenterRequestDto
  ) {
    return this.createCostCenterUseCase.execute(createCostCenterDto);
  }

  @Get()
  async getAllCostCenters(
    @Query() query: GetPaginationBaseDto
  ) {
    return this.getAllCostCenterUseCase.execute(query);
  }
}
