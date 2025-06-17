<script setup lang="ts">
import { useDashBoardStore } from '@/stores/dashboard';
import { formatDate } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { NumberUtil } from '@/util/NumberUtil';
import { CategoryUtil } from '@/util/CategoryUtil';
import { computed } from 'vue';
import CategoryDisplay from '@/components/shared/CategoryDisplay.vue';

const dashBoardStore = useDashBoardStore()

const categoryTypeMap = computed(() => {
  const res: Record<number, 'IN' | 'OUT' | 'MIXED'> = {}
  dashBoardStore.displayEntriesFlatSorted.forEach(entry => {
    res[entry.id] = CategoryUtil.getEntryType(entry)
  })

  return res
})

</script>

<template>
  <ul class="flex flex-col overflow-y-auto overflow-x-hidden divide-y divide-gray-400 h-full">
    <li v-for="entry in dashBoardStore.displayEntriesFlatSorted" :key="entry.id"
      class="text-sm p-2 flex gap-2 flex-wrap transition-colors items-center cursor-default" :class="{
        'hover:bg-green-100': categoryTypeMap[entry.id] === 'IN',
        'hover:bg-red-100': categoryTypeMap[entry.id] === 'OUT',
        'hover:bg-gray-300': categoryTypeMap[entry.id] === 'MIXED'
      }">
      <span class="text-xs flex-[0.8]">
        {{ formatDate(entry.date, 'dd/MM/yyyy', { locale: ptBR }) }}
      </span>
      <span class="flex-1 relative">
        <CategoryDisplay :categories="entry.categories" size="medium" />
      </span>
      <span class="flex-1 whitespace-nowrap">
        {{ NumberUtil.formatCurrency(entry.value) }}
      </span>
    </li>
    <li v-if="!dashBoardStore.displayEntriesFlatSorted.length">
      Nenhuma entrada cadastrada!
    </li>
  </ul>
</template>

<style lang="css" scoped></style>
