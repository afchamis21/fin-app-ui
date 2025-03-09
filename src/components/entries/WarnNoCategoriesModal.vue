<script setup lang="ts">
import { ref } from 'vue';
import AppModal from '../shared/AppModal.vue';
import AppButton from '../shared/AppButton.vue';
import { RouterLink } from 'vue-router';

const isOpen = ref(false)

const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
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
          <p>
            Você não possui nenhuma categoria cadastrada!
            <br>
            Cadastre categorias para poder adicionar entradas
          </p>
        </div>
        <div class="flex gap-4 justify-end flex-wrap">
          <RouterLink to="/dashboard/categories"
            class="text-center p-3 bg-indigo-100 text-indigo-400 hover:bg-indigo-50 rounded-md font-medium transition-colors shadow">
            Ir para Categorias
          </RouterLink>
          <AppButton type="button" variant="warning" @on-click="closeModal">
            <template #text>Cancelar</template>
          </AppButton>
        </div>
      </div>
    </template>
  </AppModal>
</template>
