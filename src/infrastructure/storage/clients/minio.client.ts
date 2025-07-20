import { IStorageClient, StorageConfigOptions } from "./IStorage.client";
import { S3Client } from '@aws-sdk/client-s3';

export class MinioClient implements IStorageClient {
  private readonly client: S3Client;

  constructor(options: StorageConfigOptions) {
    const { region, endpoint, credentiais, forcePathStyle } = options;

    this.client = new S3Client({
      region: region,
      endpoint: endpoint,
      credentials: {
        accessKeyId: credentiais.accessKeyId,
        secretAccessKey: credentiais.secretAccessKey,
      },
      forcePathStyle,
    });
  }

  uploadFile(filename: string, content: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
}