<script setup lang="ts">
import { ArchiveBoxIcon, CheckCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid';
import type { ICategory } from '@/types/ICategory';

defineProps<{
  categories: ICategory[];
}>();

const emit = defineEmits<{ (name: 'edit' | 'delete' | 'activate' | 'deactivate', param: ICategory): void; }>();
</script>

<template>
  <section class="flex-1 p-4 h-full shadow bg-gray-100">
    <h3 class="text-lg">Lista de Categorias</h3>
    <p class="mt-4" v-if="!categories.length">Nenhuma categoria cadastrada!</p>

    <ul class="flex flex-col mt-4 max-h-[700px] overflow-y-auto divide-y divide-gray-400">
      <li v-for="category in categories" :key="category.id" class="flex justify-between p-2">
        <div class="flex gap-2">
          <div :style="{ background: category.color }" class="size-6 rounded"></div>
          <p>{{ category.label }}</p>
        </div>
        <div class="flex gap-2">
          <button v-if="!category.active" class="hover:text-green-500 transition-all cursor-pointer"
            @click="emit('activate', category)" :title="`Ativar ${category.label}`"
            :aria-label="`Ativar ${category.label}`">
            <CheckCircleIcon class="size-4" />
          </button>
          <button v-else class="hover:text-red-500 transition-all cursor-pointer" @click="emit('deactivate', category)"
            :title="`Arquivar ${category.label}`" :aria-label="`Arquivar ${category.label}`">
            <ArchiveBoxIcon class="size-4" />
          </button>
          <button class="hover:text-indigo-400 transition-all cursor-pointer" @click="emit('edit', category)"
            :title="`Editar ${category.label}`" :aria-label="`Editar ${category.label}`">
            <PencilSquareIcon class="size-4" />
          </button>
          <button class="hover:text-indigo-400 transition-all cursor-pointer" @click="emit('delete', category)"
            :title="`Deletar ${category.label}`" :aria-label="`Deletar ${category.label}`">
            <TrashIcon class="size-4" />
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>
