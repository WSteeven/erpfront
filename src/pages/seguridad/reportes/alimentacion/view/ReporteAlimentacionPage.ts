import { defineComponent, ref, watch, computed } from 'vue'
import { useReporteAlimentacion } from '../application/useReporteAlimentacion'
import { configuracionColumnasReporteAlimentacion } from '../domain/configuracionColumnasReporteAlimentacion'
import { ReporteAlimentacionController } from '../infrastructure/ReporteAlimentacionController'
import { ReporteAlimentacion } from '../domain/ReporteAlimentacion'

export default defineComponent({
  setup() {
    const { fechaInicio, fechaFin } = useReporteAlimentacion()

    const controller = new ReporteAlimentacionController()

    const detalle = ref<ReporteAlimentacion[]>([])
    const resumen = ref<any[]>([])
    const rango = ref<{ fecha_inicio: string; fecha_fin: string } | null>(null)

    const columnasDetalle = configuracionColumnasReporteAlimentacion

    const columnasResumen = [
      {
        name: 'guardia',
        label: 'Guardia',
        field: 'guardia',
        align: 'left',
      },
      {
        name: 'totalAlimentacion',
        label: 'Total alimentación',
        field: 'totalAlimentacion',
        align: 'right',
      },
    ]

    // Computed mixin (opcional según implementación real del tab-layout)
    const mixin = computed(() => ({
      buscar: buscar,
    }))

    async function buscar() {
      if (!fechaInicio.value || !fechaFin.value) return

      const params = {
        fecha_inicio: fechaInicio.value,
        fecha_fin: fechaFin.value,
      }

      const response = await controller.listar(params)
      detalle.value = response.data || []

      resumen.value = generarResumen(detalle.value)

      rango.value = {
        fecha_inicio: fechaInicio.value,
        fecha_fin: fechaFin.value,
      }
    }

    function generarResumen(data: ReporteAlimentacion[]) {
      const resumenMap = new Map<string, number>()

      data.forEach((item) => {
        const guardia = item.guardia || 'Desconocido'
        const alimentacion = item.alimentacion || 0

        if (resumenMap.has(guardia)) {
          resumenMap.set(guardia, resumenMap.get(guardia)! + alimentacion)
        } else {
          resumenMap.set(guardia, alimentacion)
        }
      })

      return Array.from(resumenMap.entries()).map(([guardia, totalAlimentacion]) => ({
        guardia,
        totalAlimentacion,
      }))
    }

    // Opcional: buscar automáticamente al cambiar fechas
    watch([fechaInicio, fechaFin], buscar)

    return {
      fechaInicio,
      fechaFin,
      rango,
      detalle,
      resumen,
      columnasDetalle,
      columnasResumen,
      configuracionColumnasReporteAlimentacion,
      mixin,
    }
  },
})
