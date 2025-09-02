import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { AuthenticationModule } from '@common/authentication';

@Module({
  imports: [AuthenticationModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
