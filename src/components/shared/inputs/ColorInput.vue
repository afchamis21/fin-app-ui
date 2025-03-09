<script setup lang="ts">
import { eventBus } from '@/event-bus/event-bus';
import { computed, onUnmounted, ref } from 'vue';

const props = defineProps<{
  label: string,
  valid: boolean,
  value: string,
  id: string
}>();

const emit = defineEmits<{ (name: 'change', value: string): void }>();

const isTouched = ref(false);

const modelValue = computed({
  get: () => props.value,
  set: (val) => {
    isTouched.value = true;
    emit('change', val);
  }
});

const resetSubscription = eventBus.on('reset-input', ({ inputIds }) => {
  if (inputIds.includes(props.id)) {
    isTouched.value = false
  }
})

const markTouchedSubscription = eventBus.on('mark-input-touched', ({ inputIds }) => {
  if (inputIds.includes(props.id)) {
    isTouched.value = true
  }
})

onUnmounted(() => {
  eventBus.off(resetSubscription)
  eventBus.off(markTouchedSubscription)
})
</script>

<template>
  <div
    class="flex gap-2 flex-row-reverse items-center justify-end has-focus-within:text-indigo-400 has-hover:text-indigo-400">
    <input type="color" v-model="modelValue" :id="id"
      class="peer w-full max-w-32 min-w-16 p-2 h-11 text-gray-800 bg-gray-200 shadow border-2 rounded focus:outline-0 focus:border-indigo-300 focus:bg-indigo-100 transition-all"
      :class="{ 'border-red-400': isTouched && !props.valid, 'border-transparent': !isTouched || props.valid }" />
    <label v-if="props.label" :for="id" class="transition-all w-12">{{ props.label }}</label>
  </div>
</template>
