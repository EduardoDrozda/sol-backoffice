import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthenticationService } from '@common/authentication';
import { withAuditLog, withCustomOperations } from './extensions';

export const AUDIT_PRISMA_CLIENT = Symbol('AUDIT_PRISMA_CLIENT');

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor(private readonly authenticationService: AuthenticationService) {
    super();

    const extendedClient = new PrismaClient()
      .$extends(withCustomOperations(this.authenticationService))
      .$extends(withAuditLog(this.authenticationService));

    Object.assign(this, extendedClient);
  }
  async onModuleInit() {
    await this.$connect();
  }
}
