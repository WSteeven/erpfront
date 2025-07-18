import { AxiosResponse } from 'axios'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { apiConfig, endpoints } from 'config/api'
import { maskFecha } from 'config/utils'
import { CategoriaController } from 'pages/bodega/categorias/infraestructure/CategoriaController'
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion'
import { TransaccionIngresoController } from 'pages/bodega/transacciones/infraestructure/TransaccionIngresoController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useQuasar } from 'quasar'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useNotificaciones } from 'shared/notificaciones'
import { imprimirArchivo, obtenerFechaActual } from 'shared/utils'
import { useCargandoStore } from 'stores/cargando'
import { useNotificacionStore } from 'stores/notificacion'
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  components: { EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Transaccion,
      new TransaccionIngresoController()
    )
    const { listadosAuxiliares, listado } = mixin.useReferencias()
    const { obtenerListados, cargarVista } = mixin.useComportamiento()
    const { notificarError, notificarAdvertencia } = useNotificaciones()
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())

    const reporte = reactive({
      fecha_inicio: '',
      fecha_fin: '',
      responsable: null,
      categorias: null,
      accion: ''
    })
    const { empleados, filtrarEmpleados, categorias } =
      useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        empleados: new EmpleadoController(),
        categorias: new CategoriaController()
      })

      categorias.value = listadosAuxiliares.categorias
      reporte.fecha_fin = obtenerFechaActual(maskFecha)
    })

    async function buscarReporte(accion: string) {
      try {
        const axios = AxiosHttpRepository.getInstance()
        const url =
          apiConfig.URL_BASE +
          '/' +
          axios.getEndpoint(endpoints.transacciones_egresos) +
          '/reportes-epps'
        const filename = 'reporte_epps_bodega'
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
          case 'pdf':
            reporte.accion = 'pdf'
            await imprimirArchivo(url, 'POST', 'blob', 'pdf', filename, reporte)
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
      reporte,
      maskFecha,
      listado,

      // listados
      empleados,
      filtrarEmpleados,
      categorias,

      //funciones
      buscarReporte
    }
  }
})
