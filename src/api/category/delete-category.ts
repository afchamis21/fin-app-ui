import type { IEmptyResponse } from "@/types/http/IResponse"
import api from ".."

export const deleteCategory = async (id: number) => {
  return api.delete<IEmptyResponse>(`/category/${id}`)
}
