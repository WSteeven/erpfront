import { defineComponent, reactive, ref } from 'vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import { maskFecha } from 'config/utils'
import useVuelidate from '@vuelidate/core'
import { required } from 'shared/i18n-validators'
import { imprimirArchivo, obtenerFechaActual } from 'shared/utils'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useCargandoStore } from 'stores/cargando'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { configuracionColumnasOrdenesReparacionesReporte } from 'vehiculos/reportes/modules/rpt_mantenimientos/domain/configuracionColumnasOrdenesReparaciones'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
  components: { EssentialTable, ErrorComponent },
  setup() {
    const reporte = reactive({
      fecha_inicio: null,
      fecha_fin: null
    })

    const { notificarError, notificarAdvertencia } = useNotificaciones()

    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())

    const listado = ref([])
    reporte.fecha_fin = obtenerFechaActual(maskFecha)

    const reglas = {
      fecha_inicio: { required }
    }

    const v$ = useVuelidate(reglas, reporte)

    async function obtenerReporte(accion: string, data, listado) {
      if (await v$.value.$validate()) {
        try {
          const axios = AxiosHttpRepository.getInstance()
          const url =
            apiConfig.URL_BASE +
            '/' +
            axios.getEndpoint(endpoints.reporte_mantenimientos)
          const filename = 'reporte_ordenes_reparaciones'
          switch (accion) {
            case 'excel':
              data.accion = 'excel'
              await imprimirArchivo(url, 'POST', 'blob', 'xlsx', filename, data)
              return listado
            case 'pdf':
              data.accion = 'pdf'
              await imprimirArchivo(url, 'POST', 'blob', 'pdf', filename, data)
              return listado
            default:
              data.accion = ''
              const response: AxiosResponse = await axios.post(url, data)
              if (response.data.results) {
                if (response.data.results.length < 1)
                  notificarAdvertencia('No se obtuvieron resultados')
                return response.data.results
              } else return listado
          }
        } catch (error) {
          console.error(error)
          notificarError('Error al obtener el reporte')
        } finally {
        }
      }
    }

    async function buscarReporte(accion: string) {
      const results = ref([])
      results.value = await obtenerReporte(accion, reporte, listado.value)
      listado.value = results.value
    }

    /**
     * Botones de tabla
     */
    const btnExportarExcel: CustomActionTable = {
      titulo: 'Descargar',
      icono: 'bi-file-earmark-excel-fill',
      color: 'positive',
      tooltip: 'Descargar reporte',
      accion: async () => {
        await obtenerReporte('excel', reporte, listado.value)
      },
      visible: () => listado.value.results
    }

    return {
      reporte,
      v$,
      maskFecha,
      listado,
      configuracionColumnas: configuracionColumnasOrdenesReparacionesReporte,
      buscarReporte,

      btnExportarExcel
    }
  }
})
