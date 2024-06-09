/**
 * BcryptDomain
 */
export abstract class BcryptDomain<T, U> {
  /**
   * Hashes a password.
   */
  abstract hash(password: string): Promise<T>;
  /**
   * Hashes a password synchronously.
   */
  abstract compare(password: string, hashedPassword: string): Promise<U>;
  /**
   * Compares a password with a hashed password.
   */
  abstract compareSync(password: string, hashedPassword: string): U;
}
