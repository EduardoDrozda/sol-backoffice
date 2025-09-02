import { GetRoleSimpleDTO } from "@application/dtos/role/responses/get-role.dto";
import { IBaseUseCase } from "../IBase.use-case";
import { IRoleRepository, ROLE_REPOSITORY } from "@domain/interfaces/repositories";
import { Inject } from "@nestjs/common";
import { LoggerService } from "@common/logger";
import { RoleModel } from "@domain/models";

export class GetAllRolesSimpleUseCase implements IBaseUseCase<void, GetRoleSimpleDTO[]> {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(): Promise<GetRoleSimpleDTO[]> {
    this.loggerService.log('Fetching all roles for simple list');
    const result = await this.roleRepository.findAllSimple();
    this.loggerService.log(`Found ${result.length} roles`);
    return result.map((role: RoleModel) => this.mapToGetRoleSimpleDTO(role));
  }

  private mapToGetRoleSimpleDTO(role: RoleModel): GetRoleSimpleDTO {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
    };
  }
}