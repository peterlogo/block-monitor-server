import { Schema, model } from 'mongoose';
import type { User } from '../types/user';

/** User schema. */
export const UserSchema = new Schema<User>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

/** User model. */
export const UserModel = model<User>('User', UserSchema);
