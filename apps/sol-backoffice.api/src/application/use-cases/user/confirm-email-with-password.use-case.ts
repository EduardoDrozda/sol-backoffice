import { Inject, Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { ConfirmEmailWithPasswordDTO } from '@application/dtos/user/requests';
import { USER_REPOSITORY } from '@domain/interfaces/repositories';
import { IUserRepository } from '@domain/interfaces/repositories';
import { LoggerService } from '@common/logger';
import { HashService } from '@common/hash';
import { TokenTypeEnum } from '@domain/enums';
import { DateHelper } from '@application/helpers';

@Injectable()
export class ConfirmEmailWithPasswordUseCase implements IBaseUseCase<ConfirmEmailWithPasswordDTO, void> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly loggerService: LoggerService,
    private readonly hashService: HashService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(data: ConfirmEmailWithPasswordDTO): Promise<void> {
    this.loggerService.log(`Confirming email with password for token: ${data.token}`);

    // Buscar o token
    const userToken = await this.getUserTokenOrThrow(data.token);
    
    // Verificar se o token não expirou
    if (userToken.expiresAt && new Date() > userToken.expiresAt) {
      throw new UnauthorizedException('Token de confirmação expirado');
    }

    // Buscar o usuário
    const user = await this.getUserOrThrow(userToken.userId);
    
    // Verificar se o usuário já está ativo
    if (user.isActive) {
      throw new BadRequestException('Usuário já está ativo');
    }

    // Ativar o usuário e definir a senha
    await this.activateUserAndSetPassword(user.id, data.password);
    
    // Deletar o token usado
    await this.userRepository.deleteUserToken(data.token);
    
    this.loggerService.log(`Email confirmed and password set for user: ${user.email}`);
  }

  private async getUserTokenOrThrow(token: string) {
    const userToken = await this.userRepository.findByUserToken(token);
    if (!userToken || userToken.type !== TokenTypeEnum.EMAIL_CONFIRMATION) {
      throw new NotFoundException('Token de confirmação inválido');
    }
    return userToken;
  }

  private async getUserOrThrow(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  private async activateUserAndSetPassword(userId: string, password: string) {
    // Hash da senha
    const hashedPassword = await this.hashService.hash(password);
    
    // Ativar usuário e definir senha
    await this.userRepository.activateUser(userId);
    await this.userRepository.updatePassword(userId, hashedPassword);
  }
}
