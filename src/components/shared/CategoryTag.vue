<script setup lang="ts">
import type { ICategory } from '@/types/ICategory';
import { CategoryUtil } from '@/util/CategoryUtil';
import type { PropType } from 'vue';

const props = defineProps({
  category: {
    type: Object as PropType<ICategory>,
    required: true
  },
  size: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    default: 'medium'
  }
});

const sizeClasses = {
  small: 'max-w-20',
  medium: 'max-w-32',
  large: 'max-w-full'
};
</script>

<template>
  <div :title="props.category.label"
    class="w-fit px-4 py-1 rounded-md text-xs shadow-sm h-fit text-center overflow-hidden text-ellipsis whitespace-nowrap"
    :class="[CategoryUtil.categoryTextColor(category), sizeClasses[props.size]]"
    :style="{ 'background': category.color }">
    {{ category.label }}
  </div>
</template>
