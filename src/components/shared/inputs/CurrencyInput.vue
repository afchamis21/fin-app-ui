<script setup lang="ts">
import { eventBus } from '@/event-bus/event-bus';
import { computed, onUnmounted, ref } from 'vue';

const props = defineProps<{
  label: string,
  valid: boolean,
  value?: number,
  placeholder: string,
  id: string,
  disabled?: boolean
}>();

const emit = defineEmits<{ (name: 'change', value: number): void }>();

const isTouched = ref(false);

const modelValue = computed({
  get: () => props.value,
  set: (val) => {
    emit('change', Number(val));
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
  <div class="flex flex-row w-full items-center gap-2 has-focus-within:text-indigo-400 has-hover:text-indigo-400"
    :class="{ 'opacity-40': disabled }">
    <label v-if="props.label" :for="id" class="transition-all w-12" :class="{ 'cursor-not-allowed': disabled }">{{
      props.label }}</label>

    <div class="peer relative w-full">
      <span class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600">R$</span>
      <input type="number" v-model.number="modelValue" step="0.01" :placeholder="props.placeholder" :id="id" class="w-full py-2 pl-8 text-gray-800 bg-gray-200 shadow border-2  rounded
        focus:outline-0 focus:border-indigo-300 focus:bg-indigo-100 transition-all
        disabled:cursor-not-allowed" :disabled="props.disabled"
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
