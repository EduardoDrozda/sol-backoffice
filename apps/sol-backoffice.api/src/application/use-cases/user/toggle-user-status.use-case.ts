import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { ToggleUserStatusDTO } from '@application/dtos/user/requests';
import { IUserRepository, USER_REPOSITORY } from '@domain/interfaces/repositories';
import { LoggerService } from '@common/logger';

@Injectable()
export class ToggleUserStatusUseCase implements IBaseUseCase<{ id: string; data: ToggleUserStatusDTO }, void> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute({ id, data }: { id: string; data: ToggleUserStatusDTO }): Promise<void> {
    this.loggerService.log(`Toggling user status for user ID: ${id} to ${data.isActive ? 'active' : 'inactive'}`);

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (data.isActive) {
      await this.userRepository.activateUser(id);
      this.loggerService.log(`User ${id} activated successfully`);
      return;
    }

    await this.userRepository.deactivateUser(id);
    this.loggerService.log(`User ${id} deactivated successfully`);
  }
} 