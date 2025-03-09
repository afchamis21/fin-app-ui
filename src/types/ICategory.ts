export type CategoryType = 'IN' | 'OUT'

export interface ICategory {
  id: number
  label: string
  color: string
  type: CategoryType
  active: boolean
  goal?: number
}
