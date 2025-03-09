<script setup lang="ts">
import DashboardAside from '@/components/dashboard/DashboardAside.vue';
import { useDashBoardStore } from '@/stores/dashboard';
import { NumberUtil } from '@/util/NumberUtil';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/vue/24/solid';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
import { onMounted, ref, watch } from 'vue';
import { useCategoryStore } from '@/stores/category';
import { toast, type Id } from 'vue3-toastify';

const dashBoardStore = useDashBoardStore()
const categoryStore = useCategoryStore()

const showTotals = ref(false)
const isLoading = ref(false)

const toggleVisibility = () => {
  showTotals.value = !showTotals.value
}

onMounted(async () => {
  isLoading.value = true
  await Promise.all([categoryStore.fetchCategories(), ...dashBoardStore.fetchEntryData()])
  isLoading.value = false
})

let toastId: Id | undefined = undefined
watch(isLoading, (loading) => {
  if (loading) {
    toastId = toast.loading("Carregando dados...")
  } else if (toastId) {
    toast.update(toastId, {
      render: "",
      type: "success",
      autoClose: 1, // Fecha quase instantaneamente
      isLoading: false,
    }); toastId = undefined
  }
})
</script>

<template>
  <div class="flex h-dvh bg-gray-50 relative w-screen">
    <div class="flex-1 flex flex-col z-0">
      <header class="pl-0 p-5 border-b border-gray-300 h-16 flex items-center justify-end gap-1 md:gap-4">
        <div title="Entradas"
          class="py-2 px-4 rounded-md shadow font-medium text-sm bg-green-100 text-green-600 flex gap-2 transition-all">
          <ArrowTrendingUpIcon class="size-4" />
          <span :hidden="!showTotals">
            {{ NumberUtil.formatCurrency(dashBoardStore.totalIn) }}
          </span>
          <span :hidden="showTotals">
            R$ {{ "-".repeat(String(NumberUtil.formatCurrency(dashBoardStore.totalIn)).length - 3) }}
          </span>
        </div>
        <div title="Saídas" class="py-2 px-4 rounded-md shadow font-medium text-sm bg-red-50 text-red-500 flex gap-2">
          <ArrowTrendingDownIcon class="size-4" />
          <span :hidden="!showTotals">
            {{ NumberUtil.formatCurrency(dashBoardStore.totalOut) }}
          </span>
          <span :hidden="showTotals">
            R$ {{ "-".repeat(String(NumberUtil.formatCurrency(dashBoardStore.totalOut)).length - 3) }}
          </span>
        </div>
        <button :title="showTotals ? 'Esconder totais' : 'Mostrar totais'" @click="toggleVisibility">
          <EyeIcon v-if="!showTotals" class="size-6" />
          <EyeSlashIcon v-else class="size-6" />
        </button>
      </header>
      <div class="pl-15 md:pl-20 max-h-[calc(100dvh-4rem)] h-full">
        <main class="pl-7 pr-2 py-10 md:p-10 overflow-auto max-w-[1500px] m-auto h-full">
          <RouterView />
        </main>
      </div>
    </div>

    <DashboardAside />
  </div>
</template>
