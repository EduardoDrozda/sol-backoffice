import {
  ProjectModel,
  CreateProjectInput,
  UpdateProjectInput,
} from '@domain/models';

export const PROJECT_REPOSITORY = Symbol('IProjectRepository');

export interface IProjectRepositoryFindAllParams {
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface IProjectRepositoryFindAllResult {
  data: ProjectModel[];
  total: number;
}

export interface IProjectRepository {
  create(data: CreateProjectInput): Promise<ProjectModel>;
  findAll(params?: IProjectRepositoryFindAllParams): Promise<IProjectRepositoryFindAllResult>;
  findById(id: string): Promise<ProjectModel | null>;
  findByName(name: string): Promise<ProjectModel | null>;
  update(id: string, data: UpdateProjectInput): Promise<ProjectModel>;
  delete(id: string): Promise<void>;
} 