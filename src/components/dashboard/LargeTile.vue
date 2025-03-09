<script setup lang="ts">
import { ref } from 'vue';
import LineChart from './charts/LineChart.vue';
import BarChart from './charts/BarChart.vue';
import SelectInput from '../shared/inputs/SelectInput.vue';
import { LocalStorageUtil } from '@/util/LocalStorageUtil';
import CategorizedBarChart from './charts/CategorizedBarChart.vue';
import { useDashBoardStore } from '@/stores/dashboard';
import MultiSelect from '../shared/inputs/MultiSelect.vue';
import CategorizedLineChart from './charts/CategorizedLineChart.vue';

type TileOptions = 'BAR_DEFAULT' | 'BAR_CATEGORIZED' | 'LINE' | 'LINE_CATEGORIZED'

const titles: Record<TileOptions, string> = {
  BAR_DEFAULT: 'Entradas e Saídas',
  BAR_CATEGORIZED: 'Categorias',
  LINE: 'Lucro',
  LINE_CATEGORIZED: 'Progressão de Categoria'
}

const dashBoardStore = useDashBoardStore()

const props = defineProps<{
  id: string
}>()

const getInitialTile = (): TileOptions | undefined => {
  return LocalStorageUtil.get<TileOptions>(props.id) || undefined
}

const mode = ref<TileOptions | undefined>(getInitialTile())

const changeMode = (newMode: TileOptions) => {
  LocalStorageUtil.set(props.id, newMode)
  mode.value = newMode
}

const labels = ref([] as string[])

function sortLabels(dates: string[]): string[] {
  return dates.sort((a, b) => {
    const [monthA, yearA] = a.split('/').map(Number);
    const [monthB, yearB] = b.split('/').map(Number);

    return yearA - yearB || monthA - monthB;
  });
}

function handleLabelSelect(event: string[]) {
  labels.value = sortLabels(event)
}
</script>

<template>
  <div class="flex flex-col justify-between h-full">
    <header class="flex flex-col md:flex-row gap-2 justify-between">
      <SelectInput class="max-w-56" :values="titles" :selected="mode" @change="changeMode"
        :id="'largeTileMode' + props.id" valid enable-undefined />
      <MultiSelect v-if="mode === 'BAR_DEFAULT' || mode === 'BAR_CATEGORIZED'" class="max-w-56"
        :values="dashBoardStore.labels" label="Filtrar meses" id="selectLabels" @change="handleLabelSelect" />
    </header>

    <div class="w-full overflow-x-auto">
      <div class="min-w-lg md: h-[275px] w-full flex items-center justify-center">
        <BarChart v-if="mode === 'BAR_DEFAULT'" :labels="labels" />
        <CategorizedBarChart v-else-if="mode === 'BAR_CATEGORIZED'" :labels="labels" />
        <LineChart v-else-if="mode === 'LINE'" />
        <CategorizedLineChart v-else-if="mode === 'LINE_CATEGORIZED'" />
        <label :for="'largeTileMode' + props.id" v-else>Selecione uma opção!</label>
      </div>
    </div>
  </div>
</template>
