export type StorageConfigOptions = {
  endpoint: string;
  region: string;
  forcePathStyle?: boolean;
  credentiais: {
    accessKeyId: string;
    secretAccessKey: string;
  }
};

export interface IStorageClient {
  uploadFile(filename: string, content: string): Promise<string>;
}