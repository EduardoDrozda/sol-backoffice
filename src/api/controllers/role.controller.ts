import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { AuthorizationPermissionsEnum } from '@common/authentication/enums';
import { CreateRoleRequestDTO, UpdateRoleRequestDTO } from '@application/dtos/role/requests';
import {
  CreateRoleUseCase,
  DeleteRoleUseCase,
  GetAllRolesUseCase,
  GetRoleByIdUseCase,
  UpdateRoleUseCase,
} from '@application/use-cases/role';
import { Authorization } from '@common/authentication';

@Controller('roles')
export class RoleController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly getAllRolesUseCase: GetAllRolesUseCase,
    private readonly getRoleByIdUseCase: GetRoleByIdUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
  ) {}

  @Post()
  @Authorization(AuthorizationPermissionsEnum.CREATE_ROLES)
  async createRole(@Body() createRoleDto: CreateRoleRequestDTO) {
    return this.createRoleUseCase.execute(createRoleDto);
  }

  @Get()
  @Authorization(AuthorizationPermissionsEnum.VIEW_ROLES)
  async getAllRoles() {
    return this.getAllRolesUseCase.execute();
  }

  @Get(':id')
  @Authorization(AuthorizationPermissionsEnum.VIEW_ROLES_BY_ID)
  async getRoleById(@Param('id') id: string) {
    return this.getRoleByIdUseCase.execute(id);
  }

  @Patch(':id')
  @Authorization(AuthorizationPermissionsEnum.UPDATE_ROLES)
  async updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleRequestDTO) {
    return this.updateRoleUseCase.execute({ id, data: updateRoleDto });
  }

  @Delete(':id')
  @Authorization(AuthorizationPermissionsEnum.DELETE_ROLES)
  async deleteRole(@Param('id') id: string) {
    return this.deleteRoleUseCase.execute(id);
  }
} 