import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

type ContextUser = {
  id: string;
  companyId: string;
  role: string;
};

type Context = {
  user: ContextUser;
};

@Injectable()
export class ContextService {
  private readonly storage = new AsyncLocalStorage<Context>();

  run(user: ContextUser, fn: () => void) {
    this.storage.run({ user }, fn);
  }

  getUser(): ContextUser | null {
    return this.storage.getStore()?.user ?? null;
  }
}
