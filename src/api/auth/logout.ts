import type { IEmptyResponse } from "@/types/http/IResponse"
import api from ".."

export const logout = async () => {
  return api.post<IEmptyResponse>("/auth/logout")
}
