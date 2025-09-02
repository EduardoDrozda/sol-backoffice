import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AuthorizationPermissionsEnum } from '@common/authentication/enums';
import { CreatePermissionRequestDTO, UpdatePermissionRequestDTO } from '@application/dtos/permission/requests';
import {
  CreatePermissionUseCase,
  DeletePermissionUseCase,
  GetAllPermissionsUseCase,
  GetPermissionByIdUseCase,
  UpdatePermissionUseCase,
} from '@application/use-cases/permission';
import { Authorization } from '@common/authentication';
import { GetPaginationBaseDto } from '@application/dtos/base/requests';

@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly createPermissionUseCase: CreatePermissionUseCase,
    private readonly getAllPermissionsUseCase: GetAllPermissionsUseCase,
    private readonly getPermissionByIdUseCase: GetPermissionByIdUseCase,
    private readonly updatePermissionUseCase: UpdatePermissionUseCase,
    private readonly deletePermissionUseCase: DeletePermissionUseCase,
  ) {}

  @Post()
  @Authorization(AuthorizationPermissionsEnum.CREATE_PERMISSIONS)
  async createPermission(@Body() createPermissionDto: CreatePermissionRequestDTO) {
    return this.createPermissionUseCase.execute(createPermissionDto);
  }

  @Get()
  @Authorization(AuthorizationPermissionsEnum.VIEW_PERMISSIONS)
  async getAllPermissions(@Query() query: GetPaginationBaseDto) {
    return this.getAllPermissionsUseCase.execute(query);
  }

  @Get(':id')
  @Authorization(AuthorizationPermissionsEnum.VIEW_PERMISSIONS_BY_ID)
  async getPermissionById(@Param('id') id: string) {
    return this.getPermissionByIdUseCase.execute(id);
  }

  @Patch(':id')
  @Authorization(AuthorizationPermissionsEnum.UPDATE_PERMISSIONS)
  async updatePermission(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionRequestDTO) {
    return this.updatePermissionUseCase.execute({ id, data: updatePermissionDto });
  }

  @Delete(':id')
  @Authorization(AuthorizationPermissionsEnum.DELETE_PERMISSIONS)
  async deletePermission(@Param('id') id: string) {
    return this.deletePermissionUseCase.execute(id);
  }
} 