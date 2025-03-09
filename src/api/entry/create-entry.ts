import type { IListEntryResponse, ICreateEntryRequest } from "@/types/http/Entry";
import api from "..";

export const createEntry = async (req: ICreateEntryRequest) => {
  return api.post<IListEntryResponse>("/entry", req)
}
