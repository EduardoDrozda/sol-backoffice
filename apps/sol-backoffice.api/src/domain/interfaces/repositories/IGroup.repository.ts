import { CreateGroupInput, GroupModel, UpdateGroupInput } from '@domain/models';

export const GROUP_REPOSITORY = Symbol('GROUP_REPOSITORY');

export interface IGroupRepositoryFindAllParams {
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface IGroupRepositoryFindAllResult {
  data: GroupModel[];
  total: number;
}

export interface IGroupRepository {
  create(data: CreateGroupInput): Promise<GroupModel>;
  update(id: string, data: UpdateGroupInput): Promise<GroupModel>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<GroupModel | null>;
  findAll(params?: IGroupRepositoryFindAllParams): Promise<IGroupRepositoryFindAllResult>;
  findByName(name: string): Promise<GroupModel | null>;
}
