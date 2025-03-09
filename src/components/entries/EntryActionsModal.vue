<script setup lang="ts">
import { ref } from 'vue';
import AppModal from '../shared/AppModal.vue';
import AppButton from '../shared/AppButton.vue';
import type { IEntry } from '@/types/IEntry';

export type SelectEntryActionEvent = { confirm: false }
  | { confirm: true; action: 'EDIT', entry: IEntry }
  | { confirm: true; action: 'DELETE', entry: IEntry };

const emits = defineEmits<{
  (event: 'submit', payload: SelectEntryActionEvent): void;
}>();

const isOpen = ref(false)
let entry: IEntry | undefined = undefined;

const openModal = (target: IEntry) => {
  isOpen.value = true
  entry = target
}

const closeModal = () => {
  isOpen.value = false
}

const cancel = () => {
  emits('submit', { confirm: false })
  closeModal()
}

const confirmEdit = () => {
  if (!entry) {
    cancel()
    return;
  }

  emits('submit', { confirm: true, action: 'EDIT', entry: entry })
  closeModal()
}

const confirmDelete = () => {
  if (!entry) {
    cancel()
    return;
  }

  emits('submit', { confirm: true, action: 'DELETE', entry: entry })
  closeModal()
}

defineExpose({ openModal })
</script>

<template>
  <AppModal :is-open="isOpen" @close="cancel">
    <template #title>
      <h2>Atenção</h2>
    </template>
    <template #body>
      <div class="flex flex-col gap-8">
        <div class="flex flex-col gap-2">
          <p>
            Que ação você deseja executar para essa entrada?
          </p>
        </div>
        <div class="flex gap-4 justify-end">
          <AppButton type="button" variant="secondary" @on-click="cancel">
            <template #text>Cancelar</template>
          </AppButton>
          <AppButton type="button" variant="primary" @on-click="confirmEdit">
            <template #text>Editar</template>
          </AppButton>
          <AppButton type="button" variant="warning" @on-click="confirmDelete">
            <template #text>Deletar</template>
          </AppButton>
        </div>
      </div>
    </template>
  </AppModal>
</template>
