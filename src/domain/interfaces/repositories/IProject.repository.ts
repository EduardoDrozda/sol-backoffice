import {
  ProjectModel,
  CreateProjectInput,
  UpdateProjectInput,
} from '@domain/models';

export const PROJECT_REPOSITORY = Symbol('IProjectRepository');

export interface IProjectRepository {
  create(data: CreateProjectInput): Promise<ProjectModel>;
  findAll(filter?: string): Promise<ProjectModel[]>;
  findById(id: string): Promise<ProjectModel | null>;
  findByName(name: string): Promise<ProjectModel | null>;
  update(id: string, data: UpdateProjectInput): Promise<ProjectModel>;
  delete(id: string): Promise<void>;
} 