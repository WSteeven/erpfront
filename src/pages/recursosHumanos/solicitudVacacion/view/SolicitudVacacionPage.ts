// Dependencies
import { configuracionColumnasSolicitudVacacion } from '../domain/configuracionColumnasSolicitudVacacion'
import {
  maxValue,
  minValue,
  required,
  requiredIf
} from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref } from 'vue'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SolicitudVacacionController } from '../infraestructure/SolicitudVacacionController'
import { SolicitudVacacion } from '../domain/SolicitudVacacion'
import { imprimirArchivo, ordenarLista } from 'shared/utils'
import {
  acciones,
  autorizaciones,
  maskFecha,
  tabOptionsVacaciones
} from 'config/utils'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { useAuthenticationStore } from 'stores/authentication'
import { AxiosResponse } from 'axios'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { addDay, format } from '@formkit/tempo'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useNotificaciones } from 'shared/notificaciones'
import { useQuasar } from 'quasar'
import { useNotificacionStore } from 'stores/notificacion'
import { useCargandoStore } from 'stores/cargando'

export default defineComponent({
  components: { TabLayoutFilterTabs2, EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      SolicitudVacacion,
      new SolicitudVacacionController()
    )
    const {
      entidad: solicitud,
      disabled,
      accion,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, consultar, cargarVista, listar } =
      mixin.useComportamiento()
    const { onConsultado, onReestablecer } = mixin.useHooks()
    const { notificarAdvertencia } = useNotificaciones()

    /**
     * Stores
     */
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const store = useAuthenticationStore()
    const cargando = new StatusEssentialLoading()
    /***
     * Inicializacion de  variables
     */
    const esAutorizador = ref(false)

    const dias_disponibles = ref(0)
    const dias_restantes = ref(0)
    const periodos = ref([])
    const tabDefecto = ref('1')

    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            estado: 1
          }
        }
      })
      solicitud.empleado = store.user.id
      empleados.value = listadosAuxiliares.empleados

      await obtenerDerechoVacaciones(store.user.id)
    })

    //Reglas de validacion
    const reglas = {
      reemplazo: { required },
      funciones: { required },
      dias_solicitados: {
        required,
        minValue: minValue(1),
        maxValue: maxValue(computed(() => dias_disponibles.value))
      },
      periodo: { required },
      observacion: { required: requiredIf(() => esAutorizador.value) },
      fecha_inicio: { required },
      fecha_fin: { required }
    }
    const v$ = useVuelidate(reglas, solicitud)
    setValidador(v$.value)

    /*******************************
     * HOOKS
     *******************************/
    onConsultado(async () => {
      await obtenerDerechoVacaciones(solicitud.empleado)
      periodoSeleccionado()
      dias_restantes.value = dias_disponibles.value - solicitud.dias_solicitados
      esAutorizador.value = store.user.id == solicitud.autorizador
    })
    onReestablecer(async () => {
      solicitud.empleado = store.user.id
      await obtenerDerechoVacaciones(store.user.id)
    })

    /*******************************
     * FUNCIONES
     *******************************/
    async function obtenerDerechoVacaciones(id: number) {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.derecho_vacaciones) + '/' + id
        const response: AxiosResponse = await axios.get(ruta)

        periodos.value = response.data.results
        // dias_disponibles.value = response.data.dias > 15 ? 15 : response.data.dias
      } catch (e) {
        notificarAdvertencia('Error ' + e)
      } finally {
        cargando.desactivar()
      }
    }

    const periodoSeleccionado = () => {
      const periodo = periodos.value.filter(
        v => v.periodo === solicitud.periodo
      )[0]
      dias_disponibles.value = periodo.dias_disponibles
    }

    const calcularFechaFin = () => {
      dias_restantes.value = dias_disponibles.value - solicitud.dias_solicitados
      if (solicitud.fecha_inicio !== null && solicitud.dias_solicitados > 0)
        solicitud.fecha_fin = format(
          addDay(solicitud.fecha_inicio, solicitud.dias_solicitados - 1),
          maskFecha
        )
    }

    /**
     * La función 'filtrarSolicitudes' filtra las solicitudes de vacaciones en función de la pestaña seleccionada y actualiza
     * la variable tabDefecto.
     * @param {string} tab - Una cadena que representa la pestaña seleccionada.
     */
    function filtrarSolicitudes(tab: string) {
      listar({ autorizacion_id: tab }, false)
      tabDefecto.value = tab
    }

    function optionsFechaInicio(date) {
      const currentDateString = format(new Date(), 'YYYY/MM/DD')

      return date >= currentDateString
    }

    async function imprimir(id, filename) {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const url =
          apiConfig.URL_BASE +
          '/' +
          axios.getEndpoint(endpoints.solicitudes_vacaciones) +
          '/imprimir/' +
          id
        await imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
      } catch (e) {
        notificarAdvertencia('Error al imprimir el documento. ' + e)
      } finally {
        cargando.desactivar()
      }
    }

    /**************************
     * BOTONES DE TABLAS
     **************************/
    const editarVacacion: CustomActionTable = {
      titulo: ' ',
      icono: 'bi-pencil-square',
      color: 'secondary',
      visible: ({ entidad }) =>
        entidad.autorizador_id === store.user.id && tabDefecto.value == 1,
      accion: ({ entidad }) => {
        accion.value = 'EDITAR'
        consultar(entidad)
      }
    }

    const btnImprimir: CustomActionTable = {
      titulo: 'Imprimir',
      color: 'secondary',
      icono: 'bi-printer',
      accion: async ({ entidad }) => {
        await imprimir(
          entidad.id,
          `Solicitud vacaciones ${entidad.periodo} ${entidad.empleado}`
        )
      },
      visible: () => ['1', '2'].includes(tabDefecto.value)
    }

    return {
      mixin,
      solicitud,
      autorizaciones,
      tabOptionsVacaciones,
      esAutorizador,
      maskFecha,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasSolicitudVacacion,
      accion,
      acciones,
      tabDefecto,
      dias_disponibles,
      dias_restantes,

      //funciones
      optionsFechaInicio,
      filtrarSolicitudes,

      calcularFechaFin,
      ordenarLista,
      periodoSeleccionado,

      // listados
      empleados,
      filtrarEmpleados,
      periodos,

      // botones de tabla
      editarVacacion,
      btnImprimir
    }
  }
})
