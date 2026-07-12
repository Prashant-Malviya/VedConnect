import { Schema, model } from "mongoose";

// A user's password is always stored hashed - never in plain text.
// Hashing happens in auth.service.ts, not here, so the model stays
// focused only on shape/validation.

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
