<script setup lang="ts">
import { eventBus } from '@/event-bus/event-bus';
import { useCategoryStore } from '@/stores/category';
import type { ICategory } from '@/types/ICategory';
import { CategoryUtil } from '@/util/CategoryUtil';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps<{
  label?: string,
  mode: 'IN' | 'OUT' | 'BOTH'
  id: string,
}>();

const emit = defineEmits<{ (name: 'change', value: ICategory[]): void }>();

const filter = ref('')
const selected = ref<ICategory[]>([])
const open = ref(false)

const categoryStore = useCategoryStore()
const displayCategories = computed(() => {
  return categoryStore.activeCategories.filter(({ type, label }) => (props.mode === 'BOTH' || props.mode === type) && label.toLocaleLowerCase().startsWith(filter.value.toLocaleLowerCase()))
})

const toggleOpen = () => {
  open.value = !open.value
}

const isSelected = (value: ICategory) => {
  return !!selected.value.find(cat => cat.id === value.id)
}

const select = (value: ICategory) => {
  selected.value = [...selected.value, value]
}

const remove = (value: ICategory) => {
  selected.value = selected.value.filter(val => val.id !== value.id)
}

const handleClick = (value: ICategory) => {
  if (isSelected(value)) {
    remove(value)
  } else {
    select(value)
  }
}

const reset = () => {
  selected.value = []
  resetFilter()
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

const resetListener = eventBus.on('reset-input', ({ inputIds }) => {
  if (inputIds.includes(props.id)) {
    reset()
  }
})

const selectListener = eventBus.on('select-categories', ({ selectId, categories }) => {
  if (selectId !== props.id) {
    return
  }

  categories.forEach(category => {
    if (!isSelected(category)) {
      select(category)
    }
  })
})

const resetFilter = () => {
  filter.value = ''
}

onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
  document.addEventListener('keydown', onEscape)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', onClickOutside)
  document.removeEventListener('keydown', onEscape)

  eventBus.off(resetListener)
  eventBus.off(selectListener)
})
</script>

<template>
  <div ref="dropdownRef" class="relative flex w-full items-center">
    <div :id="props.id"
      class="flex-1 w-full p-2 pr-6 bg-gray-200 shadow rounded transition-all cursor-default flex gap-2 flex-wrap max-h-12 overflow-auto"
      :class="{ 'hover:text-indigo-400 hover:bg-indigo-100': !selected.length }" @click.self="toggleOpen">
      <span v-if="!selected.length" @click.self="toggleOpen" class="text-gray-700">{{ props.label }}</span>
      <span v-for="value in selected" :key="value.id" :title="value.label" :aria-label="value.label"
        @click="remove(value)"
        class="whitespace-nowrap text-xs px-2 py-1 rounded shadow flex items-center gap-1 flex-nowrap select-none max-w-32 hover:brightness-90 cursor-pointer"
        :class="CategoryUtil.categoryTextColor(value)" :style="{ background: value.color }">
        <span class="overflow-hidden text-ellipsis whitespace-nowrap flex-1">
          {{ value.label }}
        </span>

        <XMarkIcon class="size-4" />
      </span>

      <ChevronDownIcon class="size-4 absolute right-2 transition-all hover:text-indigo-400"
        :class="{ 'rotate-180': open, 'top-1/2 -translate-y-1/2': !selected.length, 'bottom-1': selected.length }"
        @click.self="toggleOpen" />
      <XMarkIcon v-if="selected.length" class="size-4 absolute right-2 top-1 hover:text-red-500 transition-colors"
        title="reset" @click="reset" />
    </div>
    <div :hidden="!open" class="flex-1 w-full absolute -bottom-2 translate-y-full p-2 max-h-40 overflow-auto
    bg-gray-200 shadow rounded transition-all cursor-default ">
      <div class="p-2 flex gap-2 border-b-2 w-full border-gray-500 items-center
        has-hover:border-indigo-400 has-focus-within:border-indigo-400
        hover:border-indigo-400 transition-colors group">
        <label for="category_filter" class="group-hover:text-indigo-400 transition-colors">
          <MagnifyingGlassIcon class="size-4" />
        </label>
        <input class="w-full focus:outline-0 focus:border-indigo-300" name="category_filter" id="category_filter"
          type="search" placeholder="Buscar..." v-model="filter" />
      </div>
      <ul class="divide-y divide-gray-400">
        <li v-for="category in displayCategories" :key="category.id"
          class="group py-2 text-sm w-full flex justify-between gap-2"
          :class="{ 'text-gray-700 hover:text-red-500': isSelected(category), 'hover:text-indigo-400': !isSelected(category) }"
          @click="handleClick(category)">
          <span>
            {{ category.label }}
          </span>
          <span class="opacity-0 group-hover:opacity-100 transition-all">
            {{ isSelected(category) ? 'Remover' : 'Selecionar' }}
          </span>
        </li>
      </ul>
    </div>

  </div>
</template>
