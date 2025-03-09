import type { IEntry } from "../IEntry";
import type { IResponse } from "./IResponse";

export type IEntryResponse = IResponse<IEntry>

export type IListEntryResponse = IResponse<IEntry[]>

export type IProfitChartResponse = IResponse<{ data: Record<string, number> }>

export interface ICreateEntryRequest {
  data: ICreateEntryData[]
}

export interface ICreateEntryData {
  value: number,
  label: string,
  date: string,
  categories?: number[]
}

export type IUpdateEntryRequest = Partial<ICreateEntryData>

