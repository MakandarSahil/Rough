import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  number?: string;
  password: string;
  refreshToken?: string;
}