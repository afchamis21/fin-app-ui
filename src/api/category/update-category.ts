import api from ".."
import type { ICategoryResponse, IUpdateCategoryRequest } from "@/types/http/Category"

export const updateCategory = async (id: number, req: IUpdateCategoryRequest) => {
  return api.put<ICategoryResponse>(`/category/${id}`, req)
}
