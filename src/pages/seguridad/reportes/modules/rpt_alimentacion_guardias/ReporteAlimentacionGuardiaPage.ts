import { defineComponent, reactive, ref, watch } from 'vue'
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
    const mostrarJornada = ref(false) // variable para mostrar el select de jornada
    const mostrarZona = ref(false) // variable para mostrar el select de zona

    // Variables de resumen
    const resumenGuardia = ref('-')
    const totalMonto = ref(0)

    const mostrarVarios = ref(false)
    const guardiasDetalle = ref<any[]>([])

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

    const columnasDetalle = [
      {
        name: 'fecha',
        label: 'Fecha',
        align: 'left',
        field: 'fecha',
        sortable: true
      },
      {
        name: 'zona',
        label: 'Zona',
        align: 'left',
        field: 'zona',
        sortable: true
      },
      {
        name: 'jornadas',
        label: 'Jornadas',
        align: 'left',
        field: 'jornadas'
      },
      {
        name: 'monto',
        label: 'Monto',
        align: 'right',
        field: 'monto',
        sortable: true
      }
    ]

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
      // empleados con rol de guardia
      empleados.value = listadosAuxiliares.empleados
        .filter((emp: any) => {
          if (!emp.roles) return false
          const roles = emp.roles
            .split(',')
            .map((r: string) => r.trim().toUpperCase())
          return roles.includes('GUARDIA')
        })
        //
        .sort((a: any, b: any) =>
          a.apellidos.localeCompare(b.apellidos, 'es', { sensitivity: 'base' })
        )

      //zonas
      zonas.value = listadosAuxiliares.zonas
    })

    //  limpiar jornada si el toggle se apaga
    watch(mostrarJornada, val => {
      if (!val) {
        filtros.jornada = null
      } else {
        filtros.empleado = null // limpiar empleado al activar filtro por jornada
      }
    })

    //  limpiar zona si el toggle se apaga
    watch(mostrarZona, val => {
      if (!val) {
        filtros.zona = null
      } else {
        filtros.empleado = null // limpiar empleado al activar filtro por zona
      }
    })

    /**
     * Funciones
     */
    async function buscarReporte(accion: string) {
      cargando.value = true
      try {
        const axios = AxiosHttpRepository.getInstance()
        let url = axios.getEndpoint(endpoints.bitacoras) + '/reportes'
        const filename = 'reporte_alimentacion_guardia'

        filtros.accion = accion

        if (accion === 'excel' || accion === 'pdf') {
          url = apiConfig.URL_BASE + url

          const extension = accion === 'excel' ? 'xlsx' : 'pdf'
          await imprimirArchivo(
            url,
            'POST',
            'blob',
            extension,
            filename,
            filtros
          )
          return
        }

        // consulta
        const response: AxiosResponse = await axios.post(url, filtros)
        const data = response.data

        mostrarVarios.value = data.total?.guardia === 'TODOS'

        if (mostrarVarios.value) {
          guardiasDetalle.value = data.detalle || []
          listado.value = []
          resumenGuardia.value = 'TODOS'
        } else {
          listado.value = data.detalle || []
          guardiasDetalle.value = []
          resumenGuardia.value = data.total?.guardia || data.guardia || '-'
        }

        totalMonto.value = mostrarVarios.value
          ? data.total?.monto_total ?? 0
          : data.monto_total ?? 0

        if (
          (!mostrarVarios.value && listado.value.length < 1) ||
          (mostrarVarios.value && guardiasDetalle.value.length < 1)
        ) {
          notificarAdvertencia(
            'No se encontraron registros para los filtros ingresados.'
          )
        }
      } catch (error: any) {
        // Validación (422)
        if (error.response?.status === 422) {
          const errores = error.response.data.errors
          const mensajes = Object.values(errores).flat()
          notificarAdvertencia(mensajes.join('\n'))
        }

        //  No encontrado (404)
        else if (error.response?.status === 404) {
          notificarAdvertencia(
            error.response.data.message || 'No se encontraron resultados'
          )
        }

        // Error inesperado
        else {
          console.error('Error inesperado:', error)
          notificarError('Ocurrió un error inesperado al generar el reporte')
        }
      } finally {
        cargando.value = false
      }
    }

    return {
      filtros,
      listado,
      columnasDetalle,
      empleados,
      zonas,
      mostrarJornada,
      mostrarZona,
      resumenGuardia,
      totalMonto,
      buscarReporte,
      filtrarEmpleados,
      mostrarVarios,
      guardiasDetalle
    }
  }
})
