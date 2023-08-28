<template>
  <canvas ref="chartRef" id="myChart"></canvas>
</template>

<script lang="ts">
import { Chart as ChartJS } from 'chart.js'
import datalabels from 'chartjs-plugin-datalabels'
import { onMounted, ref, defineComponent } from 'vue'
import Chart from 'chart.js/auto'

export default defineComponent({
  props: {
    data: Object,
    options: Object,
  },
  emits: ['click'],
  setup(props, { emit }) {
    // Configuracion
    ChartJS.register(datalabels)
    ChartJS.defaults.plugins.datalabels = {
      display: true,
      align: 'center',
    }

    const chartRef = ref()

    onMounted(() => {
      const ctx = chartRef.value.getContext('2d')

      const combinedOptions = Object.assign({}, props.options)
      // Crear el gráfico
      const myChart = new Chart(ctx, {
        type: 'pie',
        data: props.data,
        options: combinedOptions,
      })

      // Agregar un evento de clic al gráfico
      myChart.canvas.addEventListener('click', (event) => {
        const activePoints = myChart.getElementsAtEventForMode(
          event,
          'nearest',
          { intersect: true },
          true
        )

        let label, value

        if (activePoints.length > 0) {
          const firstPoint = activePoints[0]
          const datasetIndex = firstPoint.datasetIndex
          const dataIndex = firstPoint.index

          const chartData = myChart.data
          label = chartData.labels ? chartData.labels[dataIndex] : ''
          value = chartData.datasets[datasetIndex].data[dataIndex]

          console.log(`Clic en ${label}: ${value}`)
        }

        emit('click', { label, value })
      })
    })

    return {
      chartRef,
    }
  },
})
</script>

<style>
#myChart {
  cursor: pointer;
}
</style>
