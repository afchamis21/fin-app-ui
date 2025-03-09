<script setup lang="ts">
import { ref } from 'vue';
import type { ICategory } from '@/types/ICategory';
import AppModal from '../shared/AppModal.vue';
import AppButton from '../shared/AppButton.vue';
import CategoryTag from '../shared/CategoryTag.vue';

export type ConfirmDeactivateEvent = { confirm: false } | { confirm: true; category: ICategory };
const emits = defineEmits<{
  (event: 'submit', payload: ConfirmDeactivateEvent): void;
}>();

const isOpen = ref(false)
const category = ref<ICategory | null>(null)

const openModal = (target: ICategory) => {
  isOpen.value = true
  category.value = target
}

const closeModal = () => {
  isOpen.value = false
}

const cancel = () => {
  emits('submit', {
    confirm: false
  })
  closeModal()
}

const confirm = () => {
  emits('submit', {
    confirm: true,
    category: category.value!
  })
  closeModal()
}

defineExpose({ openModal })
</script>

<template>
  <AppModal :is-open="isOpen" @close="closeModal">
    <template #title>
      <h2>Atenção</h2>
    </template>
    <template #body>
      <div class="flex flex-col gap-8">
        <div class="flex flex-col gap-2">
          <p>Tem certeza de que deseja arquivar esta categoria?</p>
          <p class="text-sm text-red-500 "><b>Obs:</b> A categoria não poderá mais ser usada para criar novas entradas,
            mas você ainda irá ver seus dados nos dashboards</p>
          <CategoryTag class="mt-4" v-if="category" :category="category" />

        </div>
        <div class="flex gap-4 justify-end flex-wrap">
          <AppButton type="button" variant="warning" @on-click="confirm">
            <template #text>Confirmar</template>
          </AppButton>
          <AppButton type="button" @on-click="cancel">
            <template #text>Cancelar</template>
          </AppButton>
        </div>
      </div>
    </template>
  </AppModal>
</template>
