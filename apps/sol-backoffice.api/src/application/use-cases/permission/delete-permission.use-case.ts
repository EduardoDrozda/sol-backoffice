import { IPermissionRepository, PERMISSION_REPOSITORY } from '@domain/interfaces/repositories';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { LoggerService } from '@common/logger';

@Injectable()
export class DeletePermissionUseCase implements IBaseUseCase<string, void> {
  constructor(
    @Inject(PERMISSION_REPOSITORY) private readonly permissionRepository: IPermissionRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(id: string): Promise<void> {
    this.loggerService.log(`Deleting permission with id: ${id}`);
    
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      this.loggerService.warn(`Permission with id ${id} not found`);
      throw new NotFoundException('Permission not found');
    }

    await this.permissionRepository.delete(id);
    this.loggerService.log(`Permission deleted successfully: ${permission.name}`);
  }
} 