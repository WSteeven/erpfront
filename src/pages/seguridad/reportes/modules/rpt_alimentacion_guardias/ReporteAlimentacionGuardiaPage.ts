import { defineComponent, reactive, ref } from 'vue'
import { useQuasar, LocalStorage } from 'quasar'

// Componentes
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'

// Utilidades y lógica
import { useNotificaciones } from 'shared/notificaciones'
import { useNotificacionStore } from 'stores/notificacion'
import { useCargandoStore } from 'stores/cargando'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { imprimirArchivo, obtenerFechaActual } from 'shared/utils'
import { maskFecha } from 'config/utils'
import { Bitacora } from 'pages/seguridad/bitacoras/doman/Bitacora'
import { BitacoraController } from 'pages/seguridad/bitacoras/infraestructure/BitacoraController'
import { ZonaController } from 'pages/seguridad/zonas/infraestructure/ZonaController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

export default defineComponent({
  components: {
    ModalEntidad
  },
  setup() {
    const $q = useQuasar()
    useNotificacionStore().setQuasar($q)
    useCargandoStore().setQuasar($q)

    const cargando = ref(false)

    const { notificarError, notificarAdvertencia } = useNotificaciones()

    const filtros = reactive({
      empleado: null,
      zona: null,
      jornada: null,
      fecha_inicio: '',
      fecha_fin: '',
      accion: ''
    })

    const listado = ref([])
    const zonas = ref([])

    // Lógica de mezcla para reutilizar carga
    const mixin = new ContenedorSimpleMixin(Bitacora, new BitacoraController())
    const { listadosAuxiliares } = mixin.useReferencias()
    const { obtenerListados, cargarVista } = mixin.useComportamiento()

    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)

    // Carga inicial
    cargarVista(async () => {
      await obtenerListados({
        empleados: new EmpleadoController(),
        zonas: new ZonaController()
      })
      filtros.fecha_fin = obtenerFechaActual(maskFecha)

      //listados
      //empleados con rol de guardia
      empleados.value = listadosAuxiliares.empleados.filter((emp: any) => {
        if (!emp.roles) return false
        const roles = emp.roles
          .split(',')
          .map((r: string) => r.trim().toUpperCase())
        return roles.includes('GUARDIA')
      })
      //zonas
      zonas.value = listadosAuxiliares.zonas
    })

    /**
     * Funciones
     */
    async function buscarReporte(accion: string) {
      cargando.value = true;
      try {
        const axios = AxiosHttpRepository.getInstance()
        let url = axios.getEndpoint(endpoints.bitacoras) + '/reportes'
        const filename = 'reporte_alimentacion_guardia'
        switch (accion) {
          case 'excel':
            url =
              apiConfig.URL_BASE +
              axios.getEndpoint(endpoints.bitacoras) +
              '/' +
              'reportes'
            filtros.accion = 'excel'
            await imprimirArchivo(
              url,
              'POST',
              'blob',
              'xlsx',
              filename,
              filtros
            )
            break
          case 'pdf':
            url =
              apiConfig.URL_BASE +
              axios.getEndpoint(endpoints.bitacoras) +
              '/' +
              'reportes'
            filtros.accion = 'pdf'
            await imprimirArchivo(url, 'POST', 'blob', 'pdf', filename, filtros)
            break
          default:
            filtros.accion = ''
            const response: AxiosResponse = await axios.post(url, filtros)
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
      filtros,
      listado,
      empleados,
      zonas,
      buscarReporte,
      filtrarEmpleados
    }
  }
})
