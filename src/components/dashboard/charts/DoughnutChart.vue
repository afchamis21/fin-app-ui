<script setup lang="ts">
import { useDashBoardStore } from '@/stores/dashboard';
import { NumberUtil } from '@/util/NumberUtil';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions, type ChartData } from 'chart.js'
import { computed, type ComputedRef } from 'vue';
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

export type DoughnutChartType = 'IN' | 'OUT' | 'BOTH'

const props = defineProps<{
  mode: DoughnutChartType
}>()

const dashBoardStore = useDashBoardStore()

const formattedData = computed(() => {
  const storeData = dashBoardStore.doughnutGraphData

  if (props.mode === 'IN') {
    return {
      values: Object.values(storeData).filter(data => data.type === 'IN').map(data => data.value),
      colors: Object.values(storeData).filter(data => data.type === 'IN').map(data => data.color),
      labels: Object.values(storeData).filter(data => data.type === 'IN').map(data => data.label)
    };
  } else if (props.mode === 'OUT') {
    return {
      values: Object.values(storeData).filter(data => data.type === 'OUT').map(data => data.value),
      colors: Object.values(storeData).filter(data => data.type === 'OUT').map(data => data.color),
      labels: Object.values(storeData).filter(data => data.type === 'OUT').map(data => data.label)
    };
  } else {
    return {
      values: Object.values(storeData).map(data => data.value),
      colors: Object.values(storeData).map(data => data.color),
      labels: Object.values(storeData).map(data => data.label)
    };
  }
})

const data: ComputedRef<ChartData<'doughnut'>> = computed(() => {
  return {
    labels: formattedData.value.labels,
    datasets: [
      {
        backgroundColor: formattedData.value.colors,
        data: formattedData.value.values
      }
    ]
  }
});

const options: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      align: "start",
      labels: {
        color: '#737B8B',
        font: {
          family: 'Poppins',
          size: 12,
        }
      }
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const value = context.raw as number;
          return NumberUtil.formatCurrency(value)
        }
      }
    }
  }
};


</script>

<template>
  <Doughnut v-if="formattedData.values.length" :data="data" :options="options" />

  <div v-else class="flex items-center justify-center h-full">
    Nenhuma {{ mode === 'BOTH' ? 'entrada ou saída' : mode === 'IN' ? 'entrada' : 'saida' }} cadastrada!
  </div>
  <span></span>
</template>
