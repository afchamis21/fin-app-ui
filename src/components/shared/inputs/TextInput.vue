<script setup lang="ts">
import { eventBus } from '@/event-bus/event-bus';
import { computed, onUnmounted, ref } from 'vue';

const props = withDefaults(defineProps<{
  label: string,
  valid: boolean,
  value?: string,
  placeholder: string,
  id: string,
  type?: 'password' | 'text' | 'email',
  disabled?: boolean,
  labelDisplay?: 'TOP' | 'SIDE',
  errors?: string[]
}>(), {
  labelDisplay: 'SIDE',
  type: 'email',
});

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
  <div :class="{
    'flex flex-col w-full': props.labelDisplay === 'TOP',
    'flex flex-row w-full items-center gap-6': props.labelDisplay === 'SIDE',
    'cursor-not-allowed opacity-80': disabled,
    'has-focus-within:text-indigo-400 has-hover:text-indigo-400': !disabled
  }">

    <!-- Label -->
    <label v-if="props.label" :for="id" :class="{
      'mb-2': props.labelDisplay === 'TOP',
      'w-12': props.labelDisplay === 'SIDE'
    }" class="transition-all text-sm">
      {{ props.label }}
    </label>

    <!-- Input -->
    <input :type="type || 'text'" v-model="modelValue" :placeholder="props.placeholder" :id="id" :disabled="disabled"
      class="peer w-full p-2 text-gray-800 bg-gray-200 shadow border-2 rounded
      focus:outline-0 focus:border-indigo-300 focus:bg-indigo-100 transition-all"
      :class="{ 'border-red-400': isTouched && !props.valid, 'border-transparent': !isTouched || props.valid, 'cursor-not-allowed opacity-80': disabled }" />

    <ul v-if="errors && isTouched" class="mt-1 pl-4">
      <li v-for="error in errors" :key="error" class="text-red-600 text-sm">{{ error }}</li>
    </ul>
  </div>
</template>
