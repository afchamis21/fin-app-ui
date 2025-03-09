import type { IRefreshRequest, IRefreshResponse } from "@/types/http/Auth"
import api from ".."

export const refresh = async (req: IRefreshRequest) => {
  return api.post<IRefreshResponse>("/auth/refresh", req)
}
