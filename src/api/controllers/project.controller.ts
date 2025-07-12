import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { PermissionsEnum } from '@domain/enums';
import { CreateProjectRequestDto, UpdateProjectRequestDto } from '@application/dtos/project/request';
import {
  CreateProjectUseCase,
  DeleteProjectUseCase,
  GetAllProjectUseCase,
  GetProjectByIdUseCase,
  UpdateProjectUseCase,
} from '@application/use-cases/project';
import { GetPaginationBaseDto } from '@application/dtos/base/requests';
import { Permission } from '@infrastructure/decorators/permission';

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
  @Permission(PermissionsEnum.CREATE_PROJECTS)
  async createProject(@Body() createProjectDto: CreateProjectRequestDto) {
    return this.createProjectUseCase.execute(createProjectDto);
  }

  @Get()
  @Permission(PermissionsEnum.VIEW_PROJECTS)
  async getAllProjects(@Query() query: GetPaginationBaseDto) {
    return this.getAllProjectUseCase.execute(query);
  }

  @Get(':id')
  @Permission(PermissionsEnum.VIEW_PROJECTS_BY_ID)
  async getProjectById(@Param('id') id: string) {
    return this.getProjectByIdUseCase.execute(id);
  }

  @Patch(':id')
  @Permission(PermissionsEnum.UPDATE_PROJECTS)
  async updateProject(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectRequestDto) {
    return this.updateProjectUseCase.execute({
      ...updateProjectDto,
      id,
    });
  }

  @Delete(':id')
  @Permission(PermissionsEnum.DELETE_PROJECTS)
  async deleteProject(@Param('id') id: string) {
    return this.deleteProjectUseCase.execute(id);
  }
}