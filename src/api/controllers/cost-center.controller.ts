import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PermissionsEnum, RolesEnum } from '@domain/enums';
import { CreateCostCenterRequestDto } from '@application/dtos/cost-center/request';
import {
  CreateCostCenterUseCase,
  GetAllCostCenterUseCase,
} from '@application/use-cases/cost-center';
import { GetPaginationBaseDto } from '@application/dtos/base/requests';
import { Permission } from '@infrastructure/decorators/permission';

@Controller('cost-centers')
export class CostCenterController {
  constructor(
    private readonly createCostCenterUseCase: CreateCostCenterUseCase,
    private readonly getAllCostCenterUseCase: GetAllCostCenterUseCase,
  ) {}

  @Post()
  @Permission(PermissionsEnum.CREATE_COST_CENTERS)
  async createCostCenter(
    @Body() createCostCenterDto: CreateCostCenterRequestDto,
  ) {
    return this.createCostCenterUseCase.execute(createCostCenterDto);
  }

  @Get()
  @Permission(PermissionsEnum.VIEW_COST_CENTERS)
  async getCostCenters(@Query() query: GetPaginationBaseDto) {
    return this.getAllCostCenterUseCase.execute(query);
  }
}
