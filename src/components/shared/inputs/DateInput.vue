<script setup lang="ts">
import { eventBus } from '@/event-bus/event-bus';
import { computed, onUnmounted, ref } from 'vue';

const props = defineProps<{
  label: string,
  valid: boolean,
  value?: string,
  id: string
}>();

const emit = defineEmits<{ (name: 'change', value?: string): void }>();

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
  <div class="flex flex-row w-full items-center gap-2 has-focus-within:text-indigo-400 has-hover:text-indigo-400">
    <label v-if="props.label" :for="id" class="transition-all w-12">{{ props.label }}</label>

    <input type="date" v-model="modelValue" :id="id"
      class="peer w-full p-2 text-gray-800 bg-gray-200 shadow border-2 rounded focus:outline-0 focus:border-indigo-300 focus:bg-indigo-100 transition-all"
      :class="{ 'border-red-400': isTouched && !props.valid, 'border-transparent': !isTouched || props.valid }" />
  </div>
</template>
