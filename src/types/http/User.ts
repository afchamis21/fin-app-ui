import type { IUser } from "../IUser";
import type { IResponse } from "./IResponse";

export type IUserResponse = IResponse<IUser>

export type IUpdateUserRequest = {
  email?: string
  username?: string
} | {
  email?: string
  username?: string
  password: string
  confirmPassword: string
}

export type IRegisterUserRequest = {
  email: string
  username: string
  password: string
  confirmPassword: string
}
