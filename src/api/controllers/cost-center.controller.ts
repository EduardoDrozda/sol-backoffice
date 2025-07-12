import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PermissionsEnum, RolesEnum } from '@domain/enums';
import { CreateCostCenterRequestDto, UpdateCostCenterRequestDto } from '@application/dtos/cost-center/request';
import {
  CreateCostCenterUseCase,
  DeleteCostCenterUseCase,
  GetAllCostCenterUseCase,
  GetCostCenterByIdUseCase,
  UpdateCostCenterUseCase,
} from '@application/use-cases/cost-center';
import { GetPaginationBaseDto } from '@application/dtos/base/requests';
import { Permission } from '@infrastructure/decorators/permission';

@Controller('cost-centers')
export class CostCenterController {
  constructor(
    private readonly createCostCenterUseCase: CreateCostCenterUseCase,
    private readonly getAllCostCenterUseCase: GetAllCostCenterUseCase,
    private readonly getCostCenterByIdUseCase: GetCostCenterByIdUseCase,
    private readonly updateCostCenterUseCase: UpdateCostCenterUseCase,
    private readonly deleteCostCenterUseCase: DeleteCostCenterUseCase,
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

  @Get(':id')
  @Permission(PermissionsEnum.VIEW_COST_CENTERS_BY_ID)
  async getCostCenterById(@Param('id') id: string) {
    return this.getCostCenterByIdUseCase.execute(id);
  }

  @Put(':id')
  @Permission(PermissionsEnum.UPDATE_COST_CENTERS)
  async updateCostCenter(@Param('id') id: string, @Body() updateCostCenterDto: UpdateCostCenterRequestDto) {
    return this.updateCostCenterUseCase.execute({
      ...updateCostCenterDto,
      id,
    });
  }

  @Delete(':id')
  @Permission(PermissionsEnum.DELETE_COST_CENTERS)
  async deleteCostCenter(@Param('id') id: string) {
    return this.deleteCostCenterUseCase.execute(id);
  }
}
