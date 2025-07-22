import { IRoleRepository, ROLE_REPOSITORY } from '@domain/interfaces/repositories';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { LoggerService } from '@common/logger';

@Injectable()
export class DeleteRoleUseCase implements IBaseUseCase<string, void> {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(id: string): Promise<void> {
    this.loggerService.log(`Deleting role with id: ${id}`);
    const existingRole = await this.getRoleOrThrow(id);
    await this.deleteRole(id);
    this.loggerService.log(`Role deleted: ${existingRole.name}`);
  }

  private async getRoleOrThrow(id: string) {
    const existingRole = await this.roleRepository.findById(id);
    if (!existingRole) {
      this.loggerService.warn(`Role with id ${id} not found`);
      throw new NotFoundException('Role not found');
    }
    return existingRole;
  }

  private async deleteRole(id: string): Promise<void> {
    await this.roleRepository.delete(id);
  }
} 