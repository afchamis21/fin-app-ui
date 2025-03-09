<script setup lang="ts" generic="K extends string">
import { ChevronDownIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import { onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps<{
  label?: string,
  values: string[],
  id: string,
}>();
;

const emit = defineEmits<{ (name: 'change', value: string[]): void }>();

const selected = ref<string[]>([])

const open = ref(false)

const toggleOpen = () => {
  open.value = !open.value
}

const isSelected = (value: string) => {
  return selected.value.includes(value)
}

const select = (value: string) => {
  selected.value = [...selected.value, value]
}

const remove = (value: string) => {
  selected.value = selected.value.filter(val => val !== value)
}

const handleClick = (value: string) => {
  if (isSelected(value)) {
    remove(value)
  } else {
    select(value)
  }
}

const reset = () => {
  selected.value = []
}

watch(selected, (newVal) => {
  emit('change', newVal)
})

const dropdownRef = ref<HTMLElement | null>(null)

const onClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    open.value = false
  }
}

const onEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
  document.addEventListener('keydown', onEscape)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', onClickOutside)
  document.removeEventListener('keydown', onEscape)
})
</script>

<template>
  <div ref="dropdownRef" class="relative flex w-full items-center">
    <div :id="props.id"
      class="flex-1 w-full p-2 pr-6 bg-gray-200 shadow rounded transition-all cursor-default flex gap-2 flex-wrap max-h-12 overflow-auto"
      :class="{ 'hover:text-indigo-400 hover:bg-indigo-100': !selected.length }" @click.self="toggleOpen">
      <span v-if="!selected.length" @click.self="toggleOpen" class="text-gray-700">{{ props.label }}</span>
      <span v-for="value in selected" :key="value" @click="remove(value)"
        class="whitespace-nowrap text-xs px-2 py-1 bg-gray-300 rounded shadow flex items-center gap-1 flex-nowrap group cursor-default select-none">
        {{ value }}

        <XMarkIcon class="size-4 group-hover:text-red-500 transition-colors" />
      </span>
      <!-- <span :value="undefined" :disabled="!props.enableUndefined" class="bg-gray-300 cursor-not-allowed">{{
        props.label || 'Escolha uma opção'
      }}
      </span> -->

      <ChevronDownIcon class="size-4 absolute right-2 transition-all hover:text-indigo-400"
        :class="{ 'rotate-180': open, 'top-1/2 -translate-y-1/2': !selected.length, 'bottom-1': selected.length }"
        @click.self="toggleOpen" />
      <XMarkIcon v-if="selected.length" class="size-4 absolute right-2 top-1 hover:text-red-500 transition-colors"
        title="reset" @click="reset" />
    </div>
    <ul :hidden="!open" class="flex-1 w-full absolute -bottom-2 translate-y-full p-2 max-h-40 overflow-auto
      bg-gray-200 shadow rounded transition-all cursor-default divide-y divide-gray-400">
      <li v-for="value in props.values" :key="value" class="group py-2 text-sm w-full flex justify-between gap-2"
        :class="{ 'text-gray-700 hover:text-red-500': isSelected(value), 'hover:text-indigo-400': !isSelected(value) }"
        @click="handleClick(value)">
        <span>
          {{ value }}
        </span>
        <span class="opacity-0 group-hover:opacity-100 transition-all">
          {{ isSelected(value) ? 'Remover' : 'Selecionar' }}
        </span>
      </li>
    </ul>
  </div>
</template>
