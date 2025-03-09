<script setup lang="ts">
import { eventBus } from '@/event-bus/event-bus';
import { useCategoryStore } from '@/stores/category';
import type { ICategory } from '@/types/ICategory';
import { CategoryUtil } from '@/util/CategoryUtil';
import { computed, onUnmounted, ref } from 'vue';

const props = withDefaults(defineProps<{
  id: string,
  valid: boolean,
  initialValue?: ICategory
  mode?: "IN" | "OUT" | "BOTH"
}>(), {
  mode: 'BOTH'
})

const categoryStore = useCategoryStore()
const selectedCategory = ref<ICategory | undefined>(props.initialValue);
const emits = defineEmits<{ (event: 'change', payload?: ICategory): void }>()

const isTouched = ref(false)

const displayCategories = computed(() => {
  return categoryStore.activeCategories.filter(({ type }) => props.mode === 'BOTH' || props.mode === type)
})

const resetSubscription = eventBus.on('reset-input', ({ inputIds }) => {
  if (inputIds.includes(props.id)) {
    isTouched.value = false
    selectedCategory.value = undefined
  }
})

const markTouchedSubscription = eventBus.on('mark-input-touched', ({ inputIds }) => {
  if (inputIds.includes(props.id)) {
    isTouched.value = true
  }
})

const selectCategorySub = eventBus.on('select-category', (payload) => {
  if (props.id !== payload.selectId) {
    return
  }

  selectedCategory.value = payload.category
})

onUnmounted(() => {
  eventBus.off(resetSubscription)
  eventBus.off(markTouchedSubscription)
  eventBus.off(selectCategorySub)
})
</script>

<template>
  <select :id="props.id" v-model="selectedCategory" :style="{ 'background': selectedCategory?.color || '#F1F2F7' }"
    :class="{ 'border-red-400': isTouched && !props.valid, 'border-transparent': !isTouched || props.valid }"
    class="w-full p-2 shadow border-2 rounded focus:outline-0 focus:border-indigo-300 focus:bg-indigo-100 transition-all"
    @change="() => {
      isTouched = true
      emits('change', selectedCategory)
    }">
    <option :value="undefined" class="bg-gray-300">Categoria</option>
    <option v-for="category in displayCategories" :key="category.id" :value="category"
      :style="{ 'background': category.color }" :class="CategoryUtil.categoryTextColor(category)">
      {{ category.label }}
    </option>
  </select>
</template>
