import { UserModel } from "../models/user.model";
import { SignupInput } from "../types/auth.types";

// Repository layer: the only place allowed to query the Users collection.

export const findUserByEmail = async (email: string) => {
  return UserModel.findOne({ email });
};

export const findUserById = async (id: string) => {
  return UserModel.findById(id);
};

export const createUser = async (input: SignupInput) => {
  // `input.password` is expected to already be hashed by the time it
  // reaches this function - hashing is the service layer's job.
  return UserModel.create(input);
};

// Every registered user, password field excluded - backs both the
// "everyone is in Community" bootstrap and GET /api/users.
export const findAllUsers = async () => {
  return UserModel.find().select("-password");
};

export const findAllUserIds = async () => {
  const users = await UserModel.find().select("_id");
  return users.map((u) => u._id.toString());
};
