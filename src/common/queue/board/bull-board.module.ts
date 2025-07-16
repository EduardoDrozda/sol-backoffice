import { Module } from '@nestjs/common';
import { BullBoardService } from './bull-board.service';
import { EnviromentModule } from '@common/enviroment';
import { LoggerModule } from '@common/logger';


@Module({
  imports: [EnviromentModule, LoggerModule],
  providers: [BullBoardService],
  exports: [BullBoardService],
})
export class BullBoardModule {}