import type { CategoryType, ICategory } from "../ICategory";
import type { IResponse } from "./IResponse";

export type ICategoryResponse = IResponse<ICategory>
export type IListCategoryResponse = IResponse<ICategory[]>

export interface ICreateCategoryRequest {
  label: string,
  color: string,
  type: CategoryType,
  goal?: number
}

export type IUpdateCategoryRequest = Partial<ICreateCategoryRequest>
