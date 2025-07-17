import mongoose from 'mongoose';
import { IUser } from '../interfaces/user.interface';

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    number: { type: String, required: false },
    password: { type: String, required: true },
    refreshToken: { type: String, required: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);