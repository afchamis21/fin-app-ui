import type { IChatHistoryResponse } from "@/types/http/Chat"
import api from ".."

export const getChat = async () => {
  return api.get<IChatHistoryResponse>("/chat")
}
