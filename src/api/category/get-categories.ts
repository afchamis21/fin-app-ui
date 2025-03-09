import api from ".."
import type { IListCategoryResponse } from "@/types/http/Category"

export const getCategories = async (active: boolean | null = null) => {
  return api.get<IListCategoryResponse>("/category/list", {
    params: {
      active
    }
  })
}
