import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { softDeleteExtension } from "./extensions/soft-delete.extesion";

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor() {
    const extendedClient = new PrismaClient().$extends(softDeleteExtension);

    super();
    
    Object.assign(this, extendedClient);
  }
  async onModuleInit() {
    await this.$connect();
  }
}