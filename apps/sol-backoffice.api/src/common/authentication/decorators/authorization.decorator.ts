import { SetMetadata } from '@nestjs/common';

export const AUTHORIZATION_KEY = 'authorization';
export const Authorization = (...permissions: string[]) =>
  SetMetadata(AUTHORIZATION_KEY, permissions);