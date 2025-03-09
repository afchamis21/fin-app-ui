<script setup lang="ts" generic="K extends string">
import { eventBus } from '@/event-bus/event-bus';
import { computed, onUnmounted, ref } from 'vue';

const props = withDefaults(defineProps<{
  label?: string,
  valid: boolean,
  values: Record<K, string>,
  selected?: K,
  id: string,
  enableUndefined?: boolean
}>(), {
  enableUndefined: false
});
type EventType = keyof typeof props.values;

const emit = defineEmits<{ (name: 'change', value: EventType): void }>();

const modelValue = computed({
  get: () => props.selected,
  set: (val: EventType) => {
    isTouched.value = true
    emit('change', val);
  }
});

const isTouched = ref(false);

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
    class="flex flex-row-reverse w-full items-center gap-2 has-focus-within:text-indigo-400 has-hover:text-indigo-400">
    <select v-model="modelValue" :id="id"
      class="flex-1 w-full p-2 bg-gray-200 shadow border-2 rounded focus:outline-0 focus:border-indigo-300 focus:bg-indigo-100 transition-all"
      :class="{ 'border-red-400': isTouched && !props.valid, 'border-transparent': !isTouched || props.valid }">

      <!-- Opção inicial -->
      <option :value="undefined" :disabled="!props.enableUndefined" class="bg-gray-300 cursor-not-allowed">{{
        props.label || 'Escolha uma opção'
        }}
      </option>

      <!-- Gerando as opções dinamicamente -->
      <option v-for="(val, key) in props.values" :key="key" :value="key">{{ val }}</option>
    </select>
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
