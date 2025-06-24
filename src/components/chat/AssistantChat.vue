<script setup lang="ts">
import { ArrowRightEndOnRectangleIcon, ChatBubbleBottomCenterTextIcon, PaperAirplaneIcon } from '@heroicons/vue/24/outline';
import AppButton from '@/components/shared/AppButton.vue';
import { onMounted, ref, watch, nextTick, computed } from 'vue';
import ChatMessage from './ChatMessage.vue';
import { useChatStore } from '@/stores/chat';
import { sseEventBus } from '@/event-bus/event-bus';

const chatStore = useChatStore()

const isChatOpen = ref(false)
const message = ref('')

const isMessageValid = computed(() => message.value && message.value.length >= 2)

const chatContainer = ref<HTMLDivElement | null>(null);

const openChat = () => {
  isChatOpen.value = true;
}

const closeChat = () => {
  isChatOpen.value = false;
}

onMounted(async () => {
  chatStore.fetchChat()
  sseEventBus.on("NEW_ENTRIES", (ev) => {
    console.log("Evento recebido!!!", ev)
    alert("Evento recebido!")
  })
})

const sendMessage = () => {
  if (!isMessageValid.value || chatStore.isLoadingChat) return;

  chatStore.sendMessage(message.value)

  message.value = ''
}

watch(() => chatStore.messages, async () => {
  const container = chatContainer.value;
  if (!container) return;

  const scrollTolerance = 20;
  const isScrolledToBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + scrollTolerance;

  await nextTick();

  if (isScrolledToBottom) {
    container.scrollTop = container.scrollHeight;
  }
}, { deep: true });

watch(isChatOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick();
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  }
})
</script>

<template>
  <div class="absolute bottom-6 right-6">
    <AppButton type="button" variant="chat" @onClick="openChat">
      <template #icon>
        <ChatBubbleBottomCenterTextIcon class="size-6" />
      </template>
    </AppButton>
  </div>

  <div class="absolute top-0 bottom-0 right-0 w-[calc(100%-80px)] md:w-md
    shadow-lg transition-transform duration-400 ease-in-out bg-gray-300 flex flex-col items-center
    justify-between p-4 gap-6" :class="{ 'translate-x-0': isChatOpen, 'translate-x-[100%]': !isChatOpen }">
    <button class="absolute top-3 right-3 hover:text-red-500 cursor-pointer" @click="closeChat">
      <ArrowRightEndOnRectangleIcon class="size-6" />
    </button>
    <h2 class="text-xl font-bold font-mono">AI Assistant</h2>

    <div ref="chatContainer" class="w-full flex-1 bg-gray-200 rounded-2xl overflow-y-auto p-4">
      <ChatMessage
        :message="{ content: 'Olá sou Alfred, seu assistente virtual! Como posso ajudá-lo?', kind: 'ASSISTANT' }" />
      <ChatMessage v-for="(message, index) in chatStore.messages" :message="message" :key="index" />
      <ChatMessage :message="{ content: '', kind: 'LOADER' }" v-if="chatStore.isLoadingChat" />
    </div>

    <form class="flex gap-4 w-full" @submit.prevent="sendMessage">
      <textarea v-model="message" placeholder="Digite sua mensagem..." :disabled="chatStore.isLoadingChat"
        @keydown.enter.exact="sendMessage"
        class="bg-indigo-100 text-sm min-h-20 rounded-md p-3 w-full resize-y focus:outline-0 border-2
        not-disabled:hover:border-indigo-200 not-disabled:focus:border-indigo-200 border-transparent disabled:cursor-not-allowed transition-colors" />
      <AppButton type="submit" :disabled="!isMessageValid || chatStore.isLoadingChat">
        <template #icon>
          <PaperAirplaneIcon class="size-6" />
        </template>
      </AppButton>
    </form>
  </div>
</template>
