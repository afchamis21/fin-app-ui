<script setup lang="ts">
import { useDashBoardStore } from '@/stores/dashboard';
import { NumberUtil } from '@/util/NumberUtil';
import { computed } from 'vue';

const props = defineProps<{ mode: 'ASC' | 'DESC' }>()

const dashBoardStore = useDashBoardStore()

const sortedData = computed(() => {
  return [...dashBoardStore.categoryGoals].sort((a, b) => (b.goal - a.goal) * (props.mode === 'ASC' ? 1 : -1))
})

</script>

<template>
  <ul class="flex flex-col overflow-y-auto overflow-x-hidden divide-y divide-gray-400 h-full">
    <li v-for="data in sortedData" :key="data.category.id" class="text-sm p-2 flex gap-2 flex-col">
      <span class="text-xs flex-[0.8]">
        {{ data.category.label }}
      </span>
      <div class="flex justify-between w-full gap-2">
        <span class="text-xs">
          {{ NumberUtil.formatCurrency(0) }}
        </span>

        <div class="h-4 min-w-20 flex-1 bg-gray-300 rounded-full relative group"
          :style="{ '--progress': Math.max(Math.min(data.amount / data.goal * 100, 100), 10) + '%' }">

          <div class="absolute inset-0">
            <div class="h-4 rounded-full absolute left-0 top-0 transition-all"
              :style="{ width: 'var(--progress)', background: data.category.color }">
            </div>
          </div>

          <!-- Círculo no final da barra no hover -->
          <div
            class="absolute opacity-0 group-hover:opacity-100 flex items-center justify-center top-1/2 transition-opacity flex-col"
            :style="{ left: `var(--progress)` }">
            <div
              class="size-5 rounded-full text-white text-xs font-bold -translate-y-1/2 -translate-x-[100%] flex items-center justify-center"
              :class="data.amount > data.goal ? 'bg-red-600 border-red-600' : 'bg-gray-200'"
              :style="{ border: `2px solid ${data.amount > data.goal ? '#dc2626' : data.category.color}` }">
              <span v-if="data.amount > data.goal">!</span>
            </div>
            <div
              class="absolute text-xs top-4 -left-1/2 -translate-x-1/2 bg-[#273240E6] p-2 rounded-lg text-gray-100 z-10 whitespace-nowrap">
              {{ NumberUtil.formatCurrency(data.amount) }}
            </div>
          </div>
        </div>

        <span class="text-xs flex items-center gap-1">
          {{ NumberUtil.formatCurrency(data.goal) }}
        </span>
      </div>

      <!-- Exibir aviso de excesso abaixo -->
      <div v-if="data.amount > data.goal" class="text-xs text-red-600 font-bold text-right">
        Excedido em {{ NumberUtil.formatCurrency(data.amount - data.goal) }}
      </div>
    </li>
    <li v-if="!sortedData.length">
      Nenhuma entrada cadastrada!
    </li>
  </ul>
</template>
