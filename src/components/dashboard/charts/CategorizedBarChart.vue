<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, type ChartData, type ChartOptions, type ChartDataset } from 'chart.js'
import { useDashBoardStore } from '@/stores/dashboard'
import { computed, type ComputedRef } from 'vue'
import { NumberUtil } from '@/util/NumberUtil'
import { useCategoryStore } from '@/stores/category'

const props = withDefaults(defineProps<{
  labels?: string[]
}>(), { labels: () => [] })

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const dashBoardStore = useDashBoardStore()
const categoryStore = useCategoryStore()

const chartData: ComputedRef<ChartData<'bar'>> = computed(() => {
  if (!dashBoardStore.labels.length || !categoryStore.categories.length) {
    return {
      labels: [],
      datasets: []
    }
  }
  const labels: string[] = props.labels.length  // Monthly Labels
    ? props.labels
    : Object.keys(dashBoardStore.categorizedData)

  // Key is the category Label
  const datasets: Record<string, ChartDataset<'bar'>> = {}

  labels.forEach(label => {
    const monthlyData = dashBoardStore.categorizedData[label]
    for (const { label: category, color } of categoryStore.categories) {
      if (!datasets[category]) {
        datasets[category] = {
          data: [],
          label: category,
          backgroundColor: color,
          borderRadius: { topLeft: 2, topRight: 2 }
        }
      }

      if (monthlyData[category]) {
        const monthlyCategoryData = monthlyData[category]
        datasets[category].data.push(monthlyCategoryData.value)
      } else {
        datasets[category].data.push(0)
      }
    }
  })

  return {
    labels,
    datasets: Object.values(datasets).filter(val => val.data.every(v => v !== 0))
  }
})

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
