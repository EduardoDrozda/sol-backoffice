export const StorageEnum = {
  LOCAL: 'local',
  S3: 's3',
  GCS: 'gcs',
}

export type Storage = (typeof StorageEnum)[keyof typeof StorageEnum];