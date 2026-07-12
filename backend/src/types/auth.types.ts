// Shape of the data we encode into the JWT, and later attach to req.user.
export interface JwtPayload {
  id: string;
  name: string;
  email: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
