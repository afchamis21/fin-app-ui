import api from ".."
import type { ICategoryResponse, ICreateCategoryRequest } from "@/types/http/Category"

export const createCategory = async (req: ICreateCategoryRequest) => {
  return api.post<ICategoryResponse>("/category", req)
}
