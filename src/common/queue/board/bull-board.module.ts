import { Module } from '@nestjs/common';
import { BullBoardService } from './bull-board.service';
import { EnviromentModule } from '@common/enviroment';


@Module({
  imports: [EnviromentModule],
  providers: [BullBoardService],
  exports: [BullBoardService],
})
export class BullBoardModule {}