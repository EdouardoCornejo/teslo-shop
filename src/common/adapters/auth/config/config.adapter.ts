import { BcryptAdapter } from '../bcrypt.infraestructure';
import * as Bcrypt from 'bcrypt';

/**
 * bcryptAdapterInterface.ts
 */
export const passwordEncrypt = new BcryptAdapter(Bcrypt, 10);
