import { UserModel } from "../models/user.model";
import { SignupInput } from "../types/auth.types";

// Repository layer: the only place allowed to query the Users collection.

export const findUserByEmail = async (email: string) => {
  return UserModel.findOne({ email });
};

export const findUserById = async (id: string) => {
  return UserModel.findById(id);
};

// input.password is expected to already be hashed by the service layer.
export const createUser = async (input: SignupInput) => {
  return UserModel.create(input);
};

// Password field excluded - backs the Community bootstrap and GET /api/users.
export const findAllUsers = async () => {
  return UserModel.find().select("-password");
};

export const findAllUserIds = async () => {
  const users = await UserModel.find().select("_id");
  return users.map((u) => u._id.toString());
};
