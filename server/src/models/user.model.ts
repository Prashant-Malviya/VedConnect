import { Schema, model } from "mongoose";

// Passwords are always hashed before reaching this model (see auth.service.ts).
interface UserDocument {
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>("User", userSchema);
