<script setup lang="ts">
import type { IEntry } from '@/types/IEntry';
import CategoryTag from './CategoryTag.vue';

defineProps<{
  entry: IEntry,
  size: 'small' | 'medium' | 'large'
}>()

</script>

<template>
  <p v-if="!entry.categories.length" class="w-fit">Sem categoria</p>
  <p v-else-if="entry.categories.length > 1" class="peer w-fit relative">{{ entry.categories.length }}
    categorias</p>
  <div v-if="entry.categories.length > 1" class="opacity-0 absolute transition-all select-none pointer-events-none
          peer-hover:opacity-100 peer-hover:pointer-events-auto
          bg-[#273240E6] p-2 rounded-lg flex flex-col gap-2 z-10">
    <CategoryTag v-for="category in entry.categories" :key="category.id" :category="category" size="large" />
  </div>
  <CategoryTag v-else :category="category" v-for="category of entry.categories" :key="category.id" :size="size" />
</template>
