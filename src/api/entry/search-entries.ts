import type { IListEntryResponse } from "@/types/http/Entry";
import api from "..";
import { DateUtil } from "@/util/DateUtil";

export const searchEntries = async (start: Date, end: Date, categoryId?: number) => {
  return api.get<IListEntryResponse>(`/entry/search`, {
    params: {
      start: DateUtil.formatToLocalDate(start),
      end: DateUtil.formatToLocalDate(end),
      categoryId
    }
  })
}
