<script setup lang="ts">
const emit = defineEmits(['on-click'])
const props = withDefaults(defineProps<
  {
    type: 'button' | 'submit' | 'reset',
    disabled?: boolean,
    center?: boolean,
    variant?: 'primary' | 'warning' | 'secondary'
  }>(), {
  variant: 'primary'
})
</script>

<template>
  <button :type="props.type" :disabled="disabled" class="font-medium shadow p-3 rounded-md cursor-pointer flex transition-colors
    disabled:opacity-80 disabled:cursor-not-allowed" @click="emit('on-click')" :class="{
      'bg-indigo-100 text-indigo-400 not-disabled:hover:bg-indigo-50': props.variant === 'primary',
      'bg-red-50 text-red-500 not-disabled:hover:bg-red-200': props.variant === 'warning',
      'bg-transparent not-disabled:hover:underline': props.variant === 'secondary',
    }">
    <div class="flex items-center gap-2" :class="{ 'w-full justify-center': center }">
      <slot name="icon"></slot>
      <slot name="text"></slot>
    </div>
  </button>
</template>
