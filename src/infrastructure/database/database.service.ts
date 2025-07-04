import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ContextService } from "@common/context/context.service";
import { withAuditLog, withCustomOperations } from "./extensions";


export const AUDIT_PRISMA_CLIENT = Symbol('AUDIT_PRISMA_CLIENT');

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor(
    private readonly context: ContextService,
  ) {
    super();

    const extendedClient = new PrismaClient()
      .$extends(withCustomOperations(this.context))
      .$extends(withAuditLog(this.context));

    Object.assign(this, extendedClient);
  }
  async onModuleInit() {
    await this.$connect();
  }
}