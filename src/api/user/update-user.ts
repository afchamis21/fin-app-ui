import type { IUpdateUserRequest, IUserResponse } from "@/types/http/User";
import api from "..";

export const updateUser = async (req: IUpdateUserRequest) => {
  return api.put<IUserResponse>("/user", req)
}
