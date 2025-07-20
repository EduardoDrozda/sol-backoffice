import { EnviromentService } from "@common/enviroment";
import { NotImplementedException } from "@nestjs/common";
import { IStorageClient, StorageConfigOptions } from "./clients/IStorage.client";
import { MinioClient } from "./clients/minio.client";
import { Storage, StorageEnum } from "./storage.enum";

export abstract class StorageDelegate {
  static createStorageClient(envService: EnviromentService): IStorageClient {

    const provider = envService.get("STORAGE_PROVIDER") as Storage;

    switch (provider) {
      case StorageEnum.LOCAL:
        const storageConfigOptions: StorageConfigOptions = StorageDelegate.getMinioStorageDetails(envService)
        return new MinioClient(storageConfigOptions);
      default:
        throw new NotImplementedException(`Unsupported storage provider: ${provider}`);
    }
  }

  private static getMinioStorageDetails(envService: EnviromentService): StorageConfigOptions {
    return {
      endpoint: envService.get("STORAGE_ENDPOINT"),
      region: 'us-east-1',
      forcePathStyle: true,
      credentiais: {
        accessKeyId: envService.get("STORAGE_ACCESS_KEY_ID"),
        secretAccessKey: envService.get("STORAGE_SECRET_ACCESS_KEY")
      }
    };
  }
}