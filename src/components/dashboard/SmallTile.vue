<script setup lang="ts">
import { ref } from 'vue';
import SelectInput from '../shared/inputs/SelectInput.vue';
import { LocalStorageUtil } from '@/util/LocalStorageUtil';
import DoughnutChart from './charts/DoughnutChart.vue';
import EntryHistory from './charts/EntryHistory.vue';
import { useDashBoardStore } from '@/stores/dashboard';
import { ArrowsUpDownIcon } from '@heroicons/vue/24/solid';
import { NumberUtil } from '@/util/NumberUtil';
import CategoryGoals from './charts/CategoryGoals.vue';

type TileOptions = 'DOUGHNUT_OUT' | 'DOUGHNUT_IN' | 'DOUGHNUT_BOTH' | 'SUMMARY' | 'CATEGORY_GOALS'

const titles: Record<TileOptions, string> = {
  CATEGORY_GOALS: 'Analise de Metas',
  SUMMARY: 'Historico de Entradas',
  DOUGHNUT_BOTH: 'Entradas/Saídas',
  DOUGHNUT_OUT: 'Saídas',
  DOUGHNUT_IN: 'Entradas',
}

const props = defineProps<{
  id: string
}>()

const categoryGoalSortMode = ref<'ASC' | 'DESC'>('ASC')

const getInitialTile = (): TileOptions | undefined => {
  return LocalStorageUtil.get<TileOptions>(props.id) || undefined
}

const dashBoardStore = useDashBoardStore()

const mode = ref<TileOptions | undefined>(getInitialTile())

const changeMode = (newMode: TileOptions) => {
  LocalStorageUtil.set(props.id, newMode)
  mode.value = newMode
}


</script>

<template>
  <div class="flex flex-col justify-between gap-4 h-full">
    <header class="flex items-center gap-2 justify-between">
      <SelectInput :class="{ 'max-w-44': mode?.includes('DOUGHNUT'), 'max-w-56': !mode?.includes('DOUGHNUT') }"
        :values="titles" :selected="mode" @change="changeMode" :id="'largeTileMode' + props.id" valid
        enable-undefined />
      <button v-if="mode === 'SUMMARY'" class="hover:text-indigo-400 transition-all" aria-label="Alterar ordenação"
        title="Alterar ordenação" @click="dashBoardStore.toggleEntrySortMode()">
        <ArrowsUpDownIcon class="size-6" />
      </button>
      <button v-if="mode === 'CATEGORY_GOALS'" class="hover:text-indigo-400 transition-all"
        aria-label="Alterar ordenação" title="Alterar ordenação"
        @click="() => categoryGoalSortMode = categoryGoalSortMode === 'ASC' ? 'DESC' : 'ASC'">
        <ArrowsUpDownIcon class="size-6" />
      </button>
      <span v-else-if="mode?.includes('DOUGHNUT')" class="py-3 px-2 rounded-md shadow font-medium text-sm"
        :class="{ 'bg-red-50 text-red-500': dashBoardStore.balance < 0, 'bg-green-100 text-green-600': dashBoardStore.balance > 0 }">
        {{ NumberUtil.formatCurrency(dashBoardStore.balance) }}
      </span>
    </header>


    <div class="w-full overflow-x-auto">
      <div class="h-[275px] w-full" :class="{ 'flex items-center justify-center': !mode }">
        <EntryHistory v-if="mode === 'SUMMARY'" />
        <DoughnutChart v-else-if="mode === 'DOUGHNUT_BOTH'" mode="BOTH" />
        <DoughnutChart v-else-if="mode === 'DOUGHNUT_IN'" mode="IN" />
        <DoughnutChart v-else-if="mode === 'DOUGHNUT_OUT'" mode="OUT" />
        <CategoryGoals v-else-if="mode === 'CATEGORY_GOALS'" :mode="categoryGoalSortMode" />
        <label :for="'largeTileMode' + props.id" v-else>Selecione uma opção!</label>
      </div>
    </div>
  </div>
</template>
