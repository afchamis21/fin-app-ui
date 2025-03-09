import type { IProfitChartResponse } from "@/types/http/Entry";
import api from "..";
import { DateUtil } from "@/util/DateUtil";

export const getProfitData = async (start: Date, end: Date) => {
  return api.get<IProfitChartResponse>(`/entry/profitChartData`, {
    params: {
      start: DateUtil.formatToLocalDate(start),
      end: DateUtil.formatToLocalDate(end),
    }
  })
}
