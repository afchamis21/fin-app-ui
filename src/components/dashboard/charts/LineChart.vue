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
  type ChartOptions
} from 'chart.js'
import { computed, type ComputedRef } from 'vue';
import { useDashBoardStore } from '@/stores/dashboard';
import { NumberUtil } from '@/util/NumberUtil';

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

const displayChartData = computed(() => {
  return {
    labels: Object.keys(dashBoardStore.displayProfitData),
    values: Object.values(dashBoardStore.displayProfitData)
  }
})

const chartData: ComputedRef = computed(() => {
  return {
    labels: displayChartData.value.labels,
    datasets: [
      {
        data: displayChartData.value.values, label: 'Entradas',
        backgroundColor: displayChartData.value.values[displayChartData.value.values.length - 1] < 0 ? '#ef4444' : '#22c55e',
        borderColor: displayChartData.value.values[displayChartData.value.values.length - 1] < 0 ? '#fecaca' : '#86efac',
        tension: 0.3,
      }
    ]
  } as ChartData<'line'>
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
          color: (ctx) => {
            return ctx.tick.value === 0
              ? displayChartData.value.values[displayChartData.value.values.length - 1] < 0 ? '#dc2626' : '#312e81'
              : '#F1F2F7';
          },
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

// TODO Comparação de categoria em linhas para ver a progressão
</script>

<template>
  <Line v-if="displayChartData.values.length > 1" :data="chartData" :options="chartOptions" />
  <p v-else>Selecione mais de um mês para ver o gráfico de lucro!</p>
</template>
