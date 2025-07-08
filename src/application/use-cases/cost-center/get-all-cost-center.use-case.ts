import { Inject, Injectable } from "@nestjs/common";
import { IBaseUseCase } from "../IBase.use-case";
import { GetPaginationBaseDto } from "@application/dtos/base/requests";
import { COST_CENTER_REPOSITORY, ICostCenterRepository } from "@domain/interfaces/repositories";
import { BaseResponseWithPaginationDto } from "@application/dtos/base/response";
import { GetCostCenterResponseDto } from "@application/dtos/cost-center/response";
import { LoggerService } from "@common/logger";
import { PaginationHelper } from "@application/helpers";

@Injectable()
export class GetAllCostCenterUseCase
  implements IBaseUseCase<GetPaginationBaseDto, BaseResponseWithPaginationDto<GetCostCenterResponseDto>> {

  constructor(
    @Inject(COST_CENTER_REPOSITORY) private readonly costCenterRepository: ICostCenterRepository,
    private readonly loggerService: LoggerService
  ) { }

  async execute(data: GetPaginationBaseDto): Promise<BaseResponseWithPaginationDto<GetCostCenterResponseDto>> {
    const { page, limit, search } = data;
    this.loggerService.log(`Fetching all cost centers`);

    const costCenters = await this
      .costCenterRepository
      .findAll(search);

    return PaginationHelper.paginate<GetCostCenterResponseDto>(costCenters, page, limit);
  }
}