import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { toast } from "vue3-toastify";
import { useAuthStore } from "./auth";
import { sseEventBus, sseEvents } from "@/event-bus/event-bus";

const baseURL: string = import.meta.env.VITE_API_BASE_URL;

export const useSse = defineStore("sse", () => {
  const authStore = useAuthStore()

  const status = ref<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const source = ref<EventSource>()
  const retryAttempt = ref(0);
  let retryTimeoutId: number | null = null;

  const closeConnection = () => {
    if (source.value) {
      source.value.close();
      console.log("SSE connection explicitly closed.");
    }
    if (retryTimeoutId) {
      clearTimeout(retryTimeoutId);
    }
    source.value = undefined;
    status.value = 'disconnected';
    retryAttempt.value = 0;
  };

  const connect = async () => {
    try {
      if (retryTimeoutId) {
        clearTimeout(retryTimeoutId);
        retryTimeoutId = null;
      }
      if (status.value === 'connected' || status.value === 'connecting') {
        console.log("Connection attempt ignored, already connected or connecting.");
        return;
      }

      status.value = 'connecting';

      const token = await authStore.getOneTimeToken()
      if (!token) throw new Error("Failed to get a one-time token.");

      const eventSource = new EventSource(encodeURI(`${baseURL}/sse/register?code=${token}`))
      source.value = eventSource

      eventSource.onopen = () => {
        console.log("SSE connection established successfully.");
        status.value = 'connected';
        retryAttempt.value = 0;
      };

      eventSource.onerror = (error) => {
        console.error("SSE connection error occurred. Will attempt to reconnect.", error);
        eventSource.close();
        status.value = 'error';
        retryAttempt.value++;
        const delay = Math.min(1000 * Math.pow(2, retryAttempt.value), 30000);
        retryTimeoutId = setTimeout(connect, delay);
      };

      sseEvents.forEach(name =>
        eventSource.addEventListener(name, (event) => {
          console.log(`Received SSE event '${name}'`);
          const data = JSON.parse(event.data)
          sseEventBus.emit(name, data)
        })
      )
    } catch (error) {
      console.error("Failed to initialize SSE connection:", error);
      toast.error("Erro ao conectar com o servidor. Tentando novamente...");
      status.value = 'error';
      retryAttempt.value++;
      const delay = Math.min(1000 * Math.pow(2, retryAttempt.value), 30000);
      retryTimeoutId = setTimeout(connect, delay);
    }
  }

  watch(() => authStore.user, (newUser, oldUser) => {
    if (newUser && !oldUser) {
      console.log("User logged in, initializing SSE connection.");
      connect();
    } else if (!newUser && oldUser) {
      console.log("User logged out, closing SSE connection.");
      closeConnection();
    }
  }, { immediate: true })
})
