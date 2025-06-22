import { getChat } from "@/api/chat/get-chat";
import { sendChatMessage } from "@/api/chat/send-chat-message";
import type { IChatMessage } from "@/types/IChatMessage";
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { toast } from "vue3-toastify";
import { useAuthStore } from "./auth";

export const useChatStore = defineStore('chat', () => {
  const isLoadingChat = ref(false)
  const messages = ref<IChatMessage[]>([])

  const invalidate = () => {
    messages.value = []
  }

  const authStore = useAuthStore()
  watch(() => authStore.user, (val) => {
    if (!val) {
      invalidate()
    }
  })

  const fetchChat = async () => {
    isLoadingChat.value = true;

    try {
      const res = await getChat()

      if (res?.data?.payload) {
        messages.value = res.data.payload
      } else {

      }
    } catch (e) {
      console.error("Error fetching chat", e)
      toast.error("Erro buscando por chat existente")
    } finally {
      isLoadingChat.value = false;
    }
  }

  const sendMessage = async (message: string) => {
    isLoadingChat.value = true;

    try {
      messages.value.push({ content: message, kind: 'USER' })
      const res = await sendChatMessage({ message })

      if (res?.data?.payload) {
        messages.value.push(res.data.payload)
      }
    } catch (e) {
      console.error("Error sending chat message", e)
      toast.error("Erro conversando com o assistente")
    } finally {
      isLoadingChat.value = false;
    }
  }

  return { isLoadingChat, fetchChat, sendMessage, messages }
})
