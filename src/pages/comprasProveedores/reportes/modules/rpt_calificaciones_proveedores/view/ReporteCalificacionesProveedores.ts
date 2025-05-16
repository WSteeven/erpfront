//Dependencias
import { useQuasar } from 'quasar'

//Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

//Logica y controladores
import { useCargandoStore } from 'stores/cargando'
import { useNotificacionStore } from 'stores/notificacion'
import { computed, defineComponent, reactive, ref } from 'vue'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { opcionesCalificacionProveedor } from 'config/utils_compras_proveedores'
import { TabOption } from 'components/tables/domain/TabOption'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { imprimirArchivo } from 'shared/utils'
import { AxiosResponse } from 'axios'
import { useNotificaciones } from 'shared/notificaciones'
import { configuracionColumnasDepartamentosPendientesCalificar } from 'comprasProveedores/reportes/modules/rpt_calificaciones_proveedores/domain/configuracionColumnasDepartamentosPendientesCalificar'
import { configuracionColumnasDepartamentosPendientesRecalificar } from 'comprasProveedores/reportes/modules/rpt_calificaciones_proveedores/domain/configuracionColumnasDepartamentosPendientesRecalificar'

export default defineComponent({
  components: { NoOptionComponent, EssentialTable },
  setup() {
    /************************
     * Stores
     ***********************/
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const cargando = new StatusEssentialLoading()
    const { notificarAdvertencia, notificarError } = useNotificaciones()

    //variables
    const reporte = reactive({
      tipo: '',
      accion: ''
    })
    const listado = ref([])

    const opciones: TabOption[] = [
      {
        value: 'DEPARTAMENTOS PENDIENTES DE CALIFICAR',
        label: 'DEPARTAMENTOS PENDIENTES DE CALIFICAR'
      },
      {
        value: 'PROVEEDORES PENDIENTES DE CALIFICAR',
        label: 'PROVEEDORES PENDIENTES DE CALIFICAR'
      },
      {
        value: 'PROVEEDORES PENDIENTES DE RECALIFICAR',
        label: 'PROVEEDORES PENDIENTES DE RECALIFICAR'
      }
    ]

    /*************************
     * FUNCIONES
     ************************/
    async function obtenerReporte() {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const url =
          apiConfig.URL_BASE +
          '/' +
          axios.getEndpoint(endpoints.reportes_calificaciones_proveedores)
        const filename = 'reporte de calificaciones proveedores'
        switch (reporte.accion) {
          case 'excel':
          case 'pdf':
            await imprimirArchivo(
              url,
              'POST',
              'blob',
              reporte.accion === 'excel' ? 'xlsx' : 'pdf',
              filename,
              reporte
            )
            return listado
          default:
            const response: AxiosResponse = await axios.post(url, reporte)
            // console.log(response)
            if (response.data.results) {
              if (response.data.results.length < 1)
                notificarAdvertencia('No se obtuvieron resultados')
              return response.data.results
            } else return listado
        }
      } catch (error) {
        console.log(error)
        notificarError('Error al obtener el reporte')
      } finally {
        cargando.desactivar()
      }
    }

    async function buscarReporte(accion: string) {
      reporte.accion = accion
      listado.value = await obtenerReporte()
    }

    return {
      reporte,
      //listados
      listado,
      opcionesCalificacionProveedor,

      opciones,

      //funciones
      buscarReporte,

      //computadas
      configuracionColumnasReporte: computed(() => {
        switch (reporte.tipo) {
          case 'DEPARTAMENTOS PENDIENTES DE CALIFICAR':
          case 'PROVEEDORES PENDIENTES DE CALIFICAR':
            return configuracionColumnasDepartamentosPendientesCalificar
          default:
            return configuracionColumnasDepartamentosPendientesRecalificar
          // return configuracionColumnas
        }
      })
    }
  }
})
