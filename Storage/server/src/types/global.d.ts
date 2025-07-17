import { Document } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

declare global {
  namespace Express {
    interface Request {
      user?: Document & IUser; // Simplified to just Document + IUser
    }
  }
}

export {};