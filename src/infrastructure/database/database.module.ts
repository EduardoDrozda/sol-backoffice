import { Module } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import { ContextModule } from "@common/context";

@Module({
  imports: [ContextModule],
  providers: [DatabaseService],
  exports: [DatabaseService]
})
export class DatabaseModule { }