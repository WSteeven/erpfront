import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion'
import { TransaccionIngresoController } from 'pages/bodega/transacciones/infraestructure/TransaccionIngresoController'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useCargandoStore } from 'stores/cargando'
import { defineComponent, reactive } from 'vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { imprimirArchivo } from 'shared/utils'
import { AxiosResponse } from 'axios'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
  components: { EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Transaccion,
      new TransaccionIngresoController()
    )
    const { listado } = mixin.useReferencias()
    const { notificarError, notificarAdvertencia } = useNotificaciones()

    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())

    const reporte = reactive({
      tipo: '',
      accion: ''
    })

    async function buscarReporte(accion: string) {
      try {
        const axios = AxiosHttpRepository.getInstance()
        const url =
          apiConfig.URL_BASE +
          '/' +
          axios.getEndpoint(endpoints.reporte_vida_util_epps)
        const filename =
          reporte.tipo === 'INVENTARIO'
            ? 'reporte_vida_util_inventario'
            : 'reporte_vida_util_asignados'
        switch (accion) {
          case 'excel':
            reporte.accion = 'excel'
            await imprimirArchivo(
              url,
              'POST',
              'blob',
              'xlsx',
              filename,
              reporte
            )

            break
          default:
            reporte.accion = ''
            const response: AxiosResponse = await axios.post(url, reporte)
            if (response.data.results) {
              listado.value = response.data.results
              if (response.data.results.length < 1)
                notificarAdvertencia('No se obtuvieron resultados')
            }
        }
      } catch (e) {
        console.log(e)
        notificarError('Error al obtener reporte')
      }
    }

    return {
      mixin,
      reporte,
      buscarReporte,
      tiposReportes: [
        { value: 'INVENTARIO', label: 'Vida útil de EPPs en Inventario' },
        {
          value: 'ASIGNADOS',
          label: 'Vida útil de EPPs asignados a Personal'
        }
      ]
    }
  }
})
