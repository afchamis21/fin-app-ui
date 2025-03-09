import api from ".."
import type { ICategoryResponse } from "@/types/http/Category"

export const updateCategoryStatus = async (id: number, active: boolean) => {
  return api.patch<ICategoryResponse>(`/category/${id}`, null, {
    params: {
      active
    }
  })
}
