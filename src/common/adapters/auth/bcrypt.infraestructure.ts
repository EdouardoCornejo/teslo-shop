import * as Bcrypt from 'bcrypt';
import { BcryptDomain } from './bcrypt.domain';

/**
 * BcryptAdapter.ts
 */
export class BcryptAdapter extends BcryptDomain<string, boolean> {
  /**
   * BcryptAdapter
   * @param bcrypt
   * @param saltRounds
   */
  public constructor(
    private readonly bcrypt: typeof Bcrypt,
    private readonly saltRounds: number,
  ) {
    super();
  }

  /**
   * hash
   * @param password
   */
  async hash(password: string): Promise<string> {
    return this.bcrypt.hash(password, this.saltRounds);
  }

  /**
   * compare
   * @param password
   * @param hashedPassword
   */
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return this.bcrypt.compare(password, hashedPassword);
  }

  /**
   * compareSync
   * @param password
   * @param hashedPassword
   */
  compareSync(password: string, hashedPassword: string): boolean {
    return this.bcrypt.compareSync(password, hashedPassword);
  }
}
