import type { ICategory } from "./ICategory";

export interface IEntry {
  id: number,
  value: number,
  label: string,
  categories: ICategory[]
  date: Date
}
