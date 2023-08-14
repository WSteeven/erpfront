<template>
  <div class="full-width bg-red">
    dfgd
    <canvas ref="pieChartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createTypedChart } from 'vue-chartjs'
import 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

const chartData = ref({})
const chartOptions = ref({})

onMounted(() => {
  // Configurar las opciones para incluir el plugin datalabels
  chartOptions.value.plugins = {
    datalabels: {
      color: '#000',
      font: {
        size: 12,
      },
      formatter: (value, context) => {
        // Obtener el porcentaje y el título del segmento
        const percentage =
          ((value / context.dataset._meta[0].total) * 100).toFixed(2) + '%'
        const title = context.chart.data.labels[context.dataIndex]
        return `${title}: ${percentage}` // Mostrar el título y el porcentaje como etiqueta
      },
    },
  }

  // Crear el gráfico con las opciones y datos proporcionados
  const ctx = document.getElementById('pieChartCanvas')
  createTypedChart(ctx, 'pie', chartData.value, chartOptions.value)
})
</script>
