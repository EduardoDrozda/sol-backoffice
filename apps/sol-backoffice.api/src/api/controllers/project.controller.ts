import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { AuthorizationPermissionsEnum } from '@common/authentication/enums';
import { CreateProjectRequestDto, UpdateProjectRequestDto } from '@application/dtos/project/request';
import {
  CreateProjectUseCase,
  DeleteProjectUseCase,
  GetAllProjectUseCase,
  GetProjectByIdUseCase,
  UpdateProjectUseCase,
} from '@application/use-cases/project';
import { GetPaginationBaseDto } from '@application/dtos/base/requests';
import { Authorization } from '@common/authentication';

@Controller('projects')
export class ProjectController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly getAllProjectUseCase: GetAllProjectUseCase,
    private readonly getProjectByIdUseCase: GetProjectByIdUseCase,
    private readonly updateProjectUseCase: UpdateProjectUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
  ) {}

  @Post()
  @Authorization(AuthorizationPermissionsEnum.CREATE_PROJECTS)
  async createProject(@Body() createProjectDto: CreateProjectRequestDto) {
    return this.createProjectUseCase.execute(createProjectDto);
  }

  @Get()
  @Authorization(AuthorizationPermissionsEnum.VIEW_PROJECTS)
  async getAllProjects(@Query() query: GetPaginationBaseDto) {
    return this.getAllProjectUseCase.execute(query);
  }

  @Get(':id')
  @Authorization(AuthorizationPermissionsEnum.VIEW_PROJECTS_BY_ID)
  async getProjectById(@Param('id') id: string) {
    return this.getProjectByIdUseCase.execute(id);
  }

  @Patch(':id')
  @Authorization(AuthorizationPermissionsEnum.UPDATE_PROJECTS)
  async updateProject(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectRequestDto) {
    return this.updateProjectUseCase.execute({
      ...updateProjectDto,
      id,
    });
  }

  @Delete(':id')
  @Authorization(AuthorizationPermissionsEnum.DELETE_PROJECTS)
  async deleteProject(@Param('id') id: string) {
    return this.deleteProjectUseCase.execute(id);
  }
}