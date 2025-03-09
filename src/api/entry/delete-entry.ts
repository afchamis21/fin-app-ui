import type { IEmptyResponse } from "@/types/http/IResponse";
import api from "..";

export const deleteEntry = async (id: number) => {
  return api.delete<IEmptyResponse>(`/entry/${id}`)
}
