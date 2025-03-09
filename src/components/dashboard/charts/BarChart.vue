<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, type ChartData, type ChartOptions } from 'chart.js'
import { useDashBoardStore } from '@/stores/dashboard'
import { computed, type ComputedRef } from 'vue'
import { NumberUtil } from '@/util/NumberUtil'

const props = withDefaults(defineProps<{
  labels?: string[]
}>(), { labels: () => [] })

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const dashBoardStore = useDashBoardStore()

const filteredDataset = computed(() => {
  const filterLabelValues = (values: number[]) => {
    const indexes = props.labels.map(label => {
      return dashBoardStore.labels.indexOf(label)
    }).filter(value => value >= 0)

    return values.filter((_, i) => indexes.includes(i))
  }

  return [
    {
      data: filterLabelValues(dashBoardStore.barChartData.incomes), label: 'Entradas', backgroundColor: '#86efac',
      borderRadius: { topLeft: 2, topRight: 2 },
      hoverBackgroundColor: '#5A6ACF',
      barPercentage: 0.75,
    },
    {
      data: filterLabelValues(dashBoardStore.barChartData.expenses), label: 'Saídas', backgroundColor: '#fecaca',
      borderRadius: { topLeft: 2, topRight: 2 },
      barPercentage: 0.75,
    }
  ]
})

const unFilteredDataset = computed(() => {
  return [
    {
      data: dashBoardStore.barChartData.incomes, label: 'Entradas', backgroundColor: '#86efac',
      borderRadius: { topLeft: 2, topRight: 2 },
      hoverBackgroundColor: '#4ade80',
      barPercentage: 0.75,
    },
    {
      data: dashBoardStore.barChartData.expenses, label: 'Saídas', backgroundColor: '#fecaca',
      borderRadius: { topLeft: 2, topRight: 2 },
      hoverBackgroundColor: '#f87171',
      barPercentage: 0.75,
    }
  ]
})

const chartData: ComputedRef<ChartData<'bar'>> = computed(() => ({
  labels: props.labels.length ? props.labels : dashBoardStore.labels,
  datasets: props.labels.length ? filteredDataset.value : unFilteredDataset.value
}))

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        drawOnChartArea: false
      },
      ticks: {
        color: '#737B8B',
        font: {
          family: 'Poppins',
          size: 11,
        }
      }
    },
    y: {
      grid: {
        color: '#F1F2F7',
        lineWidth: 1,
        drawOnChartArea: true,
      },
      ticks: {
        color: '#737B8B',
        font: {
          family: 'Poppins',
          size: 11,
        },
        callback: (value) => NumberUtil.formatCurrency(Number(value))
      }
    }
  },
  plugins: {
    legend: {
      position: 'bottom',
      align: "start",
      labels: {
        color: '#737B8B',
        font: {
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
  <Bar :options="chartOptions" :data="chartData" />
</template>
