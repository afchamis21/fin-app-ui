import type { IUserResponse } from "@/types/http/User"
import api from ".."

export const fetchUser = async () => {
  return api.get<IUserResponse>("/user")
}
