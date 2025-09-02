import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateGroupRequestDto } from '@application/dtos/group/request';
import { UpdateGroupRequestDto } from '@application/dtos/group/request';
import { CreateGroupUseCase } from '@application/use-cases/group/create-group.use-case';
import { GetAllGroupUseCase } from '@application/use-cases/group/get-all-group.use-case';
import { GetGroupByIdUseCase } from '@application/use-cases/group/get-group-by-id.use-case';
import { UpdateGroupUseCase } from '@application/use-cases/group/update-group.use-case';
import { DeleteGroupUseCase } from '@application/use-cases/group/delete-group.use-case';
import { AuthorizationPermissionsEnum } from '@common/authentication/enums';
import { GetPaginationBaseDto } from '@application/dtos/base/requests';
import { Authorization } from '@common/authentication';

@Controller('groups')
export class GroupController {
  constructor(
    private readonly createGroupUseCase: CreateGroupUseCase,
    private readonly getAllGroupUseCase: GetAllGroupUseCase,
    private readonly getGroupByIdUseCase: GetGroupByIdUseCase,
    private readonly updateGroupUseCase: UpdateGroupUseCase,
    private readonly deleteGroupUseCase: DeleteGroupUseCase,
  ) {}

  @Post()
  @Authorization(AuthorizationPermissionsEnum.CREATE_GROUPS)
  async createGroup(@Body() createGroupDto: CreateGroupRequestDto) {
    return this.createGroupUseCase.execute(createGroupDto);
  }

  @Get()
  @Authorization(AuthorizationPermissionsEnum.VIEW_GROUPS)
  async findAll(@Query() query: GetPaginationBaseDto) {
    return this.getAllGroupUseCase.execute(query);
  }

  @Get(':id')
  @Authorization(AuthorizationPermissionsEnum.VIEW_GROUPS_BY_ID)
  async findById(@Param('id') id: string) {
    return this.getGroupByIdUseCase.execute(id);
  }

  @Patch(':id')
  @Authorization(AuthorizationPermissionsEnum.UPDATE_GROUPS)
  async updateGroup(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupRequestDto,
  ) {
    return this.updateGroupUseCase.execute({
      ...updateGroupDto,
      id,
    });
  }

  @Delete(':id')
  @Authorization(AuthorizationPermissionsEnum.DELETE_GROUPS)
  async deleteGroup(@Param('id') id: string) {
    return this.deleteGroupUseCase.execute(id);
  }
}
