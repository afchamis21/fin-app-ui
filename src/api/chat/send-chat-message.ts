import type { ISendMessageRequest, IChatMessageResponse } from "@/types/http/Chat"
import api from ".."

export const sendChatMessage = async (payload: ISendMessageRequest) => {
  return api.post<IChatMessageResponse>("/chat", payload)
}
