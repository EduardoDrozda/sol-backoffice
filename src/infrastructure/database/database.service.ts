import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ContextService } from "@common/context/context.service";
import { withAuditLog, withSoftDelete } from "./extensions";


export const AUDIT_PRISMA_CLIENT = Symbol('AUDIT_PRISMA_CLIENT');

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor(
    private readonly context: ContextService,
  ) {
    super();
    const extendedClient = new PrismaClient()
      .$extends(withSoftDelete)
      .$extends(withAuditLog(this.context));

    Object.assign(this, extendedClient);
  }
  async onModuleInit() {
    await this.$connect();
  }
}