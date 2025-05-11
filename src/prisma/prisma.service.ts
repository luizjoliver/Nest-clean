import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "generated/prisma";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ["query"],
    });
  }
  onModuleInit() {
    this.$connect();
  }

  onModuleDestroy() {
    return this.$disconnect();
  }
}
