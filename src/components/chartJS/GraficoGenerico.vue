<template>
  <!-- <div class="bg-yellow full-width"> -->
  <div
    style="width: 100%; margin: 0 auto; height: 300px"
    class="bg-body rounded"
  >
    <canvas ref="chartRef" id="myChart"></canvas>
  </div>
</template>

<script lang="ts">
import { Chart as ChartJS } from 'chart.js'
import datalabels from 'chartjs-plugin-datalabels'
import { onMounted, ref, defineComponent, watch, watchEffect } from 'vue'
import Chart, { ChartTypeRegistry } from 'chart.js/auto'

export default defineComponent({
  props: {
    data: Object,
    options: Object,
    tipo: {
      type: String, // as () => ChartTypeRegistry,
      default: 'pie',
    },
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
    let myChart

    onMounted(() => {
      const ctx = chartRef.value.getContext('2d')

      const combinedOptions = Object.assign({}, props.options)
      // Crear el gráfico
      myChart = new Chart(ctx, {
        type: props.tipo,
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
        }

        emit('click', { label, value })
      })
    })

    function updateChart() {
      if (myChart) {
        myChart.data = props.data
        myChart.update()
      }
    }

    // Observar cambios en la propiedad "data"
    watch(
      () => props.data,
      () => {
        updateChart()
      }
    )

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
