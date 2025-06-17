<script setup lang="ts">
import type { IChatMessage } from '@/types/IChatMessage';
import { computed, onMounted, ref } from 'vue';
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const { message } = defineProps<{
  message: IChatMessage
}>()

const rawHtml = ref('')

const sanitizedHtml = computed(() => {
  return DOMPurify.sanitize(rawHtml.value)
})

onMounted(async () => {
  rawHtml.value = await marked(message.content)
})

</script>

<template>
  <div class="flex w-full mb-3 text-sm" :class="{
    'justify-end': message.kind === 'USER',
    'justify-start': message.kind === 'ASSISTANT' || message.kind === 'LOADER'
  }">
    <div class="max-w-[calc(100%-20px)] md:max-w-[calc(100%-60px)] px-4 py-2 rounded-2xl" :class="{
      'bg-indigo-800 text-gray-100 text-right rounded-br-none user-message relative': message.kind === 'USER',
      'bg-gray-300 text-left rounded-bl-none assistant-message relative': message.kind === 'ASSISTANT' || message.kind === 'LOADER'
    }">
      <div v-if="message.kind === 'LOADER'" class="flex items-center justify-center gap-1.5 h-6">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>

      <div v-else v-html="sanitizedHtml" class="message-content"></div>
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce-dot {

  0%,
  100% {
    transform: translateY(0);
    opacity: 0.6;
  }

  50% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

.dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #374151;
  animation: bounce-dot 1.2s infinite ease-in-out;
}

.dot:nth-of-type(2) {
  animation-delay: 0.2s;
}

.dot:nth-of-type(3) {
  animation-delay: 0.4s;
}

.user-message::after {
  position: absolute;
  width: 12px;
  right: 0;
  bottom: 0;
  transform: translateX(100%);
  aspect-ratio: 1;
  clip-path: polygon(0 100%, 0 0, 100% 100%);
  background: inherit;
  content: '';
}

.assistant-message::before {
  position: absolute;
  width: 12px;
  left: 0;
  bottom: 0;
  transform: translateX(-100%);
  aspect-ratio: 1;
  clip-path: polygon(0 100%, 100% 0, 100% 100%);
  background: inherit;
  content: '';
}
</style>

<style lang="css">
.message-content p {
  margin-bottom: 0.75rem;
}

.message-content strong {
  color: inherit;
  font-weight: 600;
}

.message-content ol,
.message-content ul {
  padding-left: 1.25rem;
  margin-bottom: 1rem;
}

.message-content li {
  margin-bottom: 0.4rem;
}

.message-content ol>li {
  list-style-type: decimal;
}

.message-content ul>li {
  list-style-type: disc;
}
</style>
