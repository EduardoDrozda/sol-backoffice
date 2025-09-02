import { JwtService } from '@nestjs/jwt';
import { AsyncLocalStorage } from 'async_hooks';

type Secret = string | Buffer | { key: string | Buffer; passphrase: string };

interface JwtParams {
  secret?: string | Buffer;
  privateKey?: Secret;
}

type UserSession = {
  id: string;
  companyId: string;
  roleId: string;
};

type Session = {
  user: UserSession;
};

export class AuthenticationService {
  private readonly storage = new AsyncLocalStorage<Session>();

  run(session: Session, fn: () => void) {
    this.storage.run(session, fn);
  }

  constructor(
    private readonly params: JwtParams,
    private readonly jwt: JwtService,
  ) {}

  async sign(payload: Record<string, any>): Promise<string> {
    return this.jwt.signAsync(payload, this.params);
  }

  async verify(token: string): Promise<Record<string, any>> {
    return this.jwt.verifyAsync(token, this.params);
  }

  getSession(): Session | null {
    return this.storage.getStore() ?? null;
  }
}
