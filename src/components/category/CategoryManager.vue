<script setup lang="ts">
import { ref } from 'vue';
import { useCategoryStore } from '@/stores/category';
import type { ICategory } from '@/types/ICategory';
import CategoryList from './CategoryList.vue';
import CategoryForm from './CategoryForm.vue';
import ConfirmDeleteCategoryModal, { type ConfirmDeleteEvent } from './ConfirmDeleteCategoryModal.vue';
import FullScreenLoader from '../shared/FullScreenLoader.vue';
import ConfirmDeactivateCategoryModal from './ConfirmDeactivateCategoryModal.vue';

const categoryStore = useCategoryStore();
const categoryToEdit = ref<ICategory | null>(null);
const deleteModalRef = ref<InstanceType<typeof ConfirmDeleteCategoryModal> | null>(null);
const deactivateModalRef = ref<InstanceType<typeof ConfirmDeactivateCategoryModal> | null>(null);

function setCategoryToEdit(category: ICategory) {
  categoryToEdit.value = { ...category };
}

function handleSave(category: ICategory) {
  if (category.id) {
    categoryStore.editCategory(category);
  } else {
    categoryStore.addCategory({
      color: category.color,
      label: category.label,
      type: category.type,
      goal: category.goal
    });
  }
  categoryToEdit.value = null;
}

function resetEdit() {
  categoryToEdit.value = null;
}

function handleDelete(category: ICategory) {
  deleteModalRef.value?.openModal(category)
}

function handleConfirmDeleteModal(event: ConfirmDeleteEvent) {
  if (!event.confirm) return;

  categoryStore.removeCategory(event.category.id)
}

function handleActivate(category: ICategory) {
  categoryStore.activate(category.id)
}

function handleDeactivate(category: ICategory) {
  deactivateModalRef.value?.openModal(category)
}

function handleConfirmDeactivateModal(event: ConfirmDeleteEvent) {
  if (!event.confirm) return;

  categoryStore.deactivate(event.category.id)
}
</script>

<template>
  <FullScreenLoader :open="categoryStore.isLoadingCategories" />
  <div class="flex flex-col gap-5">
    <header class="flex justify-between flex-wrap flex-col md:flex-row gap-4">
      <h2 class="text-2xl font-medium">Categorias</h2>
    </header>

    <section class="overflow-auto flex-1 flex gap-4 flex-col-reverse md:flex-row pb-2">
      <CategoryList :categories="categoryStore.categories" @edit="setCategoryToEdit" @delete="handleDelete"
        @activate="handleActivate" @deactivate="handleDeactivate" />
      <CategoryForm :category="categoryToEdit" @save="handleSave" @cancel="resetEdit" />
    </section>
  </div>

  <ConfirmDeleteCategoryModal ref="deleteModalRef" @submit="handleConfirmDeleteModal" />
  <ConfirmDeactivateCategoryModal ref="deactivateModalRef" @submit="handleConfirmDeactivateModal" />
</template>
