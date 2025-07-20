export const STORAGE_SERVICE = Symbol('IStorageService');

export interface IStorageService {
  uploadFile(file: any, path: string): Promise<string>;
  downloadFile(filePath: string): Promise<any>;
  deleteFile(filePath: string): Promise<void>;
  listFiles(directoryPath: string): Promise<string[]>;
  getFileUrl(filePath: string): Promise<string>;
}