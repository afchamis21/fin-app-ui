<script setup lang="ts">
import { eventBus } from '@/event-bus/event-bus';
import { onUnmounted, ref, watch } from 'vue';

const props = defineProps<{
  label: string,
  valid: boolean,
  placeholder: string,
  id: string
}>();

const emit = defineEmits<{ (name: 'change', value: number): void }>();

const isTouched = ref(false);

const value = ref(0)

watch(value, (val) => {
  emit('change', val)
})

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
    <label v-if="props.label" :for="id" class="transition-all whitespace-nowrap">{{ props.label }}</label>

    <div class="peer relative w-full">
      <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">%</span>
      <input type="number" v-model.number="value" step="0.01" :placeholder="props.placeholder" :id="id"
        @input="() => { if (value < 0) { value = 0 } }" :min="0"
        class="w-full py-2 pl-8 text-gray-800 bg-gray-200 shadow border-2 rounded focus:outline-0 focus:border-indigo-300 focus:bg-indigo-100 transition-all"
        :class="{ 'border-red-400': isTouched && !props.valid, 'border-transparent': !isTouched || props.valid }" />
    </div>
  </div>
</template>

<style lang="css" scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
  -webkit-appearance: none;
  appearance: none;
}
</style>
