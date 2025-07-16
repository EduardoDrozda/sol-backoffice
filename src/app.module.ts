import { ApiModule } from '@api/api.module';
import { EnviromentModule } from '@common/enviroment';
import { BullBoardModule } from '@common/queue/board/bull-board.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [EnviromentModule, ApiModule, BullBoardModule],
})
export class AppModule {}
