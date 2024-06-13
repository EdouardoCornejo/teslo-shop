/**
 * Interface for JWT payload
 */
export interface JwtPayload {
  /**
   * The id of the user.
   */
  id: string;

  /**
   * The email of the user.
   */
  email: string;

  /**
   * The full name of the user.
   */
  fullName: string;
}
