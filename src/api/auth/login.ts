import type { ILoginRequest, ILoginResponse } from "@/types/http/Auth"
import api from ".."

export const login = async (req: ILoginRequest) => {
  return api.post<ILoginResponse>("/auth/login", req)
}
