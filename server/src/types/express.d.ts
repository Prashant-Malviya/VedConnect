// Module augmentation: adds an optional `user` field to Express's Request
// type, so `req.user` is type-checked everywhere after the auth middleware
// sets it - without needing a custom Request type in every controller.
import { JwtPayload } from "./auth.types";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
