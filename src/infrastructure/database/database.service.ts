import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ContextService } from "@common/context/context.service";
import { withAuditLog, withSoftDelete } from "./extensions";
import { withTenancy } from "./extensions/with-tenancy.extension";
import { withColumnBy } from "./extensions/with-column-by.extention";


export const AUDIT_PRISMA_CLIENT = Symbol('AUDIT_PRISMA_CLIENT');

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor(
    private readonly context: ContextService,
  ) {
    super();

    const extendedClient = new PrismaClient()
      .$extends(withColumnBy(this.context))
      .$extends(withTenancy(this.context))
      .$extends(withSoftDelete)
      .$extends(withAuditLog(this.context));

    Object.assign(this, extendedClient);
  }
  async onModuleInit() {
    await this.$connect();
  }
}