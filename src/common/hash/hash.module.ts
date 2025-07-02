import { Module } from '@nestjs/common';
import { HashService } from './hash.service';
import { EnviromentModule, EnviromentService } from '@common/enviroment';

@Module({
  imports: [EnviromentModule],
  providers: [{
    provide: HashService,
    useFactory: (env: EnviromentService) => {
      const hashRounds = env.get('HASH_ROUNDS');
      return new HashService(hashRounds);
    },
    inject: [EnviromentService],
  }],
  exports: [HashService],
})
export class HashModule {}
