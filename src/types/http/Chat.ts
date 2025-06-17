import type { IChatMessage } from "../IChatMessage";
import type { IResponse } from "./IResponse";

export type IChatHistoryResponse = IResponse<IChatMessage[]>

export type IChatMessageResponse = IResponse<IChatMessage>

export type ISendMessageRequest = {
  message: string
}
