
import { EnviromentModule, EnviromentService } from '@common/enviroment';
import { Module } from '@nestjs/common';
import { StorageDelegate } from './storage.delegate';
import { STORAGE_SERVICE } from '@application/interfaces/storage';

@Module({
  imports: [EnviromentModule],
  providers: [
    {
      provide: STORAGE_SERVICE,
      useFactory: (envService: EnviromentService) => (StorageDelegate.createStorageClient(envService)),
      inject: [EnviromentService]
    }]
})
export class StorageModule { }
