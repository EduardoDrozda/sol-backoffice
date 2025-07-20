import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AuthorizationPermissionsEnum } from '@common/authentication/enums';
import { CreateCostCenterRequestDto, UpdateCostCenterRequestDto } from '@application/dtos/cost-center/request';
import {
  CreateCostCenterUseCase,
  DeleteCostCenterUseCase,
  GetAllCostCenterUseCase,
  GetCostCenterByIdUseCase,
  UpdateCostCenterUseCase,
} from '@application/use-cases/cost-center';
import { GetPaginationBaseDto } from '@application/dtos/base/requests';
import { Authorization } from '@common/authentication';

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
  @Authorization(AuthorizationPermissionsEnum.CREATE_COST_CENTERS)
  async createCostCenter(
    @Body() createCostCenterDto: CreateCostCenterRequestDto,
  ) {
    return this.createCostCenterUseCase.execute(createCostCenterDto);
  }

  @Get()
  @Authorization(AuthorizationPermissionsEnum.VIEW_COST_CENTERS)
  async getCostCenters(@Query() query: GetPaginationBaseDto) {
    return this.getAllCostCenterUseCase.execute(query);
  }

  @Get(':id')
  @Authorization(AuthorizationPermissionsEnum.VIEW_COST_CENTERS_BY_ID)
  async getCostCenterById(@Param('id') id: string) {
    return this.getCostCenterByIdUseCase.execute(id);
  }

  @Put(':id')
  @Authorization(AuthorizationPermissionsEnum.UPDATE_COST_CENTERS)
  async updateCostCenter(@Param('id') id: string, @Body() updateCostCenterDto: UpdateCostCenterRequestDto) {
    return this.updateCostCenterUseCase.execute({
      ...updateCostCenterDto,
      id,
    });
  }

  @Delete(':id')
  @Authorization(AuthorizationPermissionsEnum.DELETE_COST_CENTERS)
  async deleteCostCenter(@Param('id') id: string) {
    return this.deleteCostCenterUseCase.execute(id);
  }
}
