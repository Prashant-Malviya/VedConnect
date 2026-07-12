import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userRepository from "../repositories/user.repository";
import * as conversationService from "./conversation.service";
import { SignupInput, LoginInput, JwtPayload } from "../types/auth.types";
import { AppError } from "../utils/app-error";

const SALT_ROUNDS = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getJwtSecret = (): string => process.env.JWT_SECRET || "dev_secret";
const getJwtExpiresIn = (): string => process.env.JWT_EXPIRES_IN || "7d";

const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: getJwtExpiresIn() } as jwt.SignOptions);
};

export const signup = async (input: SignupInput) => {
  if (!input.name?.trim() || !input.email?.trim() || !input.password) {
    throw new AppError("Name, email, and password are required", 400);
  }

  if (!EMAIL_REGEX.test(input.email)) {
    throw new AppError("Please provide a valid email address", 400);
  }

  if (input.password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  const existingUser = await userRepository.findUserByEmail(input.email);
  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await userRepository.createUser({ ...input, password: hashedPassword });

  // Every registered user automatically belongs to Community chat, from
  // the moment their account exists.
  await conversationService.addUserToCommunity(user._id.toString());

  return user;
};

export const login = async (input: LoginInput) => {
  if (!input.email?.trim() || !input.password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await userRepository.findUserByEmail(input.email);
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  });

  return { token, user };
};

export const getUserById = async (id: string) => {
  const user = await userRepository.findUserById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};
