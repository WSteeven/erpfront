import { defineComponent, reactive, ref } from 'vue'
import { opcionesEstadosPrestamosEmpresariales } from 'config/recursosHumanos.utils'
import { EmpleadoPrestamosEmpresarialesController } from 'recursosHumanos/empleados/infraestructure/EmpleadoPrestamosEmpresarialesController'
import { imprimirArchivo, ordenarLista } from 'shared/utils'
import { maskFecha } from 'config/utils'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { SelectOption } from 'components/tables/domain/SelectOption'
import { AxiosResponse } from 'axios'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { useNotificaciones } from 'shared/notificaciones'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'

export default defineComponent({
  components: {},
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Empleado,
      new EmpleadoPrestamosEmpresarialesController()
    )
    const { listadosAuxiliares } = mixin.useReferencias()
    const { obtenerListados, cargarVista } = mixin.useComportamiento()
    const { notificarError, notificarAdvertencia } = useNotificaciones()
    const cargando = new StatusEssentialLoading()

    const reporte = reactive({
      todos: false,
      empleado: null,
      estado: null,
      fecha_inicio: '',
      fecha_fin: '',
      accion: ''
    })
    const listado = ref([])
    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        empleados: new EmpleadoPrestamosEmpresarialesController()
      })

      empleados.value = listadosAuxiliares.empleados
    })

    async function buscarReporte(accion: string) {
      try {
        if (reporte.estado == null) {
          notificarAdvertencia('Debe seleccionar un estado')
          return
        }
        if (!reporte.todos && reporte.empleado == null) {
          notificarAdvertencia(
            'Debe seleccionar un empleado o marcar la opción "Todos"'
          )
          return
        }
        const axios = AxiosHttpRepository.getInstance()
        const url =
          apiConfig.URL_BASE +
          '/' +
          axios.getEndpoint(endpoints.reporte_prestamos_empresariales)
        const filename =
          'Reporte de prestamos empresariales con estado ' +
          opcionesEstadosPrestamosEmpresariales.filter(
            (v: SelectOption) => v.value == reporte.estado
          )[0].label

        switch (accion) {
          case 'pdf':
            reporte.accion = 'pdf'
            await imprimirArchivo(url, 'POST', 'blob', 'pdf', filename, reporte)
            break
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
      } catch (e) {}
    }

    return {
      reporte,
      maskFecha,
      listado,
      ordenarLista,
      buscarReporte,

      estados: opcionesEstadosPrestamosEmpresariales,
      empleados,
      filtrarEmpleados
    }
  }
})
