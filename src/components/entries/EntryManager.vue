<script setup lang="ts">
import EntryForm from './EntryForm.vue';
import EntryList from './EntryList.vue';
import { useCategoryStore } from '@/stores/category';
import WarnNoCategoriesModal from './WarnNoCategoriesModal.vue';
import { computed, ref, watch } from 'vue';
import type { IEntry } from '@/types/IEntry';
import { eventBus } from '@/event-bus/event-bus';
import { useEntryStore } from '@/stores/entry';
import FullScreenLoader from '../shared/FullScreenLoader.vue';

const modalRef = ref<InstanceType<typeof WarnNoCategoriesModal> | null>(null);

const categoryStore = useCategoryStore()
const entryStore = useEntryStore()

const isLoadingData = computed(() => categoryStore.isLoadingCategories || entryStore.isLoadingEntries)

watch(modalRef, () => {
  if (
    modalRef.value
    && !categoryStore.categories.length
    && !isLoadingData.value
  ) {
    modalRef.value?.openModal()
  }
})

function handleDelete(entry: IEntry) {
  entryStore.removeEntry(entry)
}

function handleEdit(entry: IEntry) {
  eventBus.emit('edit-entry', { entry })
}


</script>

<template>
  <FullScreenLoader :open="isLoadingData" />
  <div class="flex flex-col gap-5 h-full">
    <header class="flex justify-between flex-wrap flex-col md:flex-row gap-4">
      <h2 class="text-2xl font-medium">Entradas</h2>
    </header>

    <section class="overflow-auto flex-1 flex gap-4 flex-col md:flex-row-reverse pb-2 flex-wrap">
      <EntryForm />
      <EntryList @delete="handleDelete" @edit="handleEdit" />
    </section>
  </div>

  <WarnNoCategoriesModal ref="modalRef" />

</template>
