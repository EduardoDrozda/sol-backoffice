import { Injectable } from '@nestjs/common';
import { IStorageClient } from './clients/IStorage.client';

@Injectable()
export class StorageService {
  constructor(private readonly storageClient: IStorageClient) {}

  async uploadFile(file: any, path: string): Promise<string> {
    return this.storageClient.uploadFile(file, path);
  }
}
