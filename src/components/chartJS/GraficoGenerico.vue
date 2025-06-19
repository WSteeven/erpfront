<template>
  <!-- <div class="bg-yellow full-width"> -->
  <div
    v-if="data?.titulo"
    class="text-center q-py-xs bg-primary text-white rounded q-pb-sm ajustar-header q-px-sm"
  >
    {{ data.titulo }}
  </div>
  <div
    style="width: 100%; margin: 0 auto; height: 300px"
    class="bg-desenfoque rounded border-white q-px-md"
  >
    <canvas ref="chartRef" id="myChart"></canvas>
  </div>
</template>

<script lang="ts">
import { ChartData, Chart as ChartJS } from 'chart.js'
import datalabels from 'chartjs-plugin-datalabels'
import { onMounted, ref, defineComponent, watch } from 'vue'
import Chart, { ChartTypeRegistry } from 'chart.js/auto'

export default defineComponent({
  props: {
    data: Object,
    options: Object,
    tipo: {
      type: String, // as () => ChartTypeRegistry,
      default: 'pie'
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    // Configuracion
    ChartJS.register(datalabels)
    ChartJS.defaults.plugins.datalabels = {
      display: true,
      align: 'center'
    }

    const chartRef = ref()
    let myChart

    onMounted(() => {
      const ctx = chartRef.value.getContext('2d')

      const combinedOptions = Object.assign({}, props.options)
      // Crear el gráfico
      myChart = new Chart(ctx, {
        type: props.tipo as keyof ChartTypeRegistry,
        data: props.data as ChartData,
        options: combinedOptions
      })

      // Agregar un evento de clic al gráfico
      myChart.canvas.addEventListener('click', event => {
        const activePoints = myChart.getElementsAtEventForMode(
          event,
          'nearest',
          { intersect: true },
          true
        )

        let label, value, metadata

        if (activePoints.length > 0) {
          const firstPoint = activePoints[0]
          const datasetIndex = firstPoint.datasetIndex
          const dataIndex = firstPoint.index

          const chartData = myChart.data
          label = chartData.labels ? chartData.labels[dataIndex] : ''
          value = chartData.datasets[datasetIndex].data[dataIndex]
          metadata = chartData.metadata
        }

        emit('click', { label, value, metadata })
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
      chartRef
    }
  }
})
</script>

<style lang="scss" scope>
#myChart {
  cursor: pointer;
}

.ajustar-header {
  position: relative;
  bottom: -6px;
  z-index: -999999;
}
</style>
