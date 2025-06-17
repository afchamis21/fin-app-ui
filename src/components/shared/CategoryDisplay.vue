<script setup lang="ts">
import type { ICategory } from '@/types/ICategory';
import CategoryTag from './CategoryTag.vue';

defineProps<{
  categories: ICategory[],
  size: 'small' | 'medium' | 'large'
}>()

</script>

<template>
  <p v-if="!categories.length" class="w-fit">Sem categoria</p>
  <p v-else-if="categories.length > 1" class="peer w-fit relative">{{ categories.length }}
    categorias</p>
  <div v-if="categories.length > 1" class="opacity-0 absolute transition-all select-none pointer-events-none
          peer-hover:opacity-100 peer-hover:pointer-events-auto
          bg-[#273240E6] p-2 rounded-lg flex flex-col gap-2 z-10">
    <CategoryTag v-for="category in categories" :key="category.id" :category="category" size="large" />
  </div>
  <CategoryTag v-else :category="category" v-for="category of categories" :key="category.id" :size="size" />
</template>
