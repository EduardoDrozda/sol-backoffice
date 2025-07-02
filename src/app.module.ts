import { ApiModule } from '@api/api.module';
import { EnviromentModule } from '@common/enviroment';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    EnviromentModule,
    ApiModule,
  ],
})
export class AppModule { }
