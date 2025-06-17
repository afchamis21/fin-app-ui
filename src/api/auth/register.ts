import api from ".."
import type { IRegisterUserRequest, IUserResponse } from "@/types/http/User"

export const register = async (req: IRegisterUserRequest) => {
  return api.post<IUserResponse>("/user", req)
}
