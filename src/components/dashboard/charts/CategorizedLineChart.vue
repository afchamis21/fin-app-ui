<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
  type ChartDataset
} from 'chart.js'
import { computed, type ComputedRef } from 'vue';
import { useDashBoardStore } from '@/stores/dashboard';
import { NumberUtil } from '@/util/NumberUtil';
import { useCategoryStore } from '@/stores/category';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const dashBoardStore = useDashBoardStore()
const categoryStore = useCategoryStore()

const chartData: ComputedRef = computed<ChartData<'line'>>(() => {
  const data = dashBoardStore.categorizedData
  const labels = dashBoardStore.labels
  const datasets: Record<string, ChartDataset<'line'>> = {}

  labels.forEach(label => {
    const monthlyData = data[label]
    for (const { label: category, color } of categoryStore.categories) {
      if (!datasets[category]) {
        datasets[category] = {
          data: [],
          label: category,
          backgroundColor: color,
          borderColor: color
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
    datasets: Object.values(datasets).filter(cat => cat.data.some(d => d))
  }
})

const chartOptions: ComputedRef = computed(() => {
  return {
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
          lineWidth: (ctx) => {
            return ctx.tick.value === 0 ? 1.5 : 1;
          },
          drawOnChartArea: true,
        },
        ticks: {
          color: '#737B8B',
          font: {
            family: 'Poppins',
            size: 11,
          },
          callback: (value) => NumberUtil.formatCurrency(Number(value))

        },
        beginAtZero: true
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
  } as ChartOptions<'line'>
})
</script>

<template>
  <Line v-if="dashBoardStore.labels.length > 1" :data="chartData" :options="chartOptions" />
  <p v-else>Selecione mais de um mês para ver o gráfico de progressão de categoria!</p>
</template>
