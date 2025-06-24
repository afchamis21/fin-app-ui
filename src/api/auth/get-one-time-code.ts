import type { ILoginResponse } from "@/types/http/Auth"
import api from ".."

export const getOneTimeCode = async () => {
  return api.post<ILoginResponse>("/auth/code")
}
