import { CreateGroupInput, GroupModel, UpdateGroupInput } from '@domain/models';

export const GROUP_REPOSITORY = Symbol('GROUP_REPOSITORY');

export interface IGroupRepository {
  create(data: CreateGroupInput): Promise<GroupModel>;
  update(id: string, data: UpdateGroupInput): Promise<GroupModel>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<GroupModel | null>;
  findAll(search?: string): Promise<GroupModel[]>;
  findByName(name: string): Promise<GroupModel | null>;
}
