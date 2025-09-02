import * as bcrypt from 'bcrypt';

export class HashService {
  constructor(private readonly hashRouds: number) {}

  async hash(value: string): Promise<string> {
    return bcrypt.hashSync(value, this.hashRouds);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compareSync(value, hash);
  }
}
