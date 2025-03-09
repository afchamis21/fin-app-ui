import type { IEntryResponse, IUpdateEntryRequest } from "@/types/http/Entry";
import api from "..";

export const updateEntry = async (id: number, req: IUpdateEntryRequest) => {
  return api.put<IEntryResponse>(`/entry/${id}`, req)
}
