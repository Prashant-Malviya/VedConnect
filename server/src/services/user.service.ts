import * as userRepository from "../repositories/user.repository";

// Everyone except the caller - this is the list the sidebar's "Direct
// Messages" section is built from.
export const listUsers = async (excludeUserId: string) => {
  const users = await userRepository.findAllUsers();
  return users
    .filter((u) => u._id.toString() !== excludeUserId)
    .map((u) => ({ id: u._id, name: u.name, email: u.email }));
};
