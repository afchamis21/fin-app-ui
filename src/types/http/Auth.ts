import type { IUser } from "../IUser";
import type { IResponse } from "./IResponse";

export interface ILoginRequest {
  email: string,
  password: string
}

export type ILoginResponse = IResponse<{
  accessToken: string,
  refreshToken: string,
  expiresAt: Date,
  user: IUser
}>

export interface IRefreshRequest {
  refreshToken: string
}

export type IRefreshResponse = IResponse<{
  accessToken: string,
  expiresAt: Date,
  user: IUser
}>
