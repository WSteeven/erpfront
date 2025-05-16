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
import {imprimirArchivo, obtenerFechaActual, ordenarLista, sumarFechas} from 'shared/utils'
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
import ErrorComponent from 'components/ErrorComponent.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'

export default defineComponent({
  components: {
    NoOptionComponent,
    ErrorComponent,
    TabLayoutFilterTabs2,
    EssentialTable
  },
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
    const {
      confirmar,
      prompt,
      notificarAdvertencia,
      notificarCorrecto,
      notificarError
    } = useNotificaciones()

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
      await obtenerDerechoVacaciones(Number(solicitud.empleado))
      periodoSeleccionado()
      dias_restantes.value =
        dias_disponibles.value - Number(solicitud.dias_solicitados)
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
      const periodo: { periodo: string; dias_disponibles: number } =
        periodos.value.filter(
          (v: { periodo: string; dias_disponibles: number }) =>
            v.periodo === solicitud.periodo
        )[0]
      dias_disponibles.value = periodo ? periodo.dias_disponibles : 0
    }

    const calcularFechaFin = () => {
      dias_restantes.value =
        dias_disponibles.value - (solicitud.dias_solicitados || 0)
      if (
        solicitud.fecha_inicio !== null &&
        (solicitud.dias_solicitados ?? 0) > 0
      )
        solicitud.fecha_fin = format(
          addDay(solicitud.fecha_inicio, (solicitud.dias_solicitados || 0) - 1),
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

    function optionsFechaInicio(date: string) {
      // const currentDateString = format(new Date(), 'YYYY/MM/DD')
      const currentDateString =sumarFechas(obtenerFechaActual(), 0,0,-15, 'YYYY/MM/DD')

      return date >= currentDateString
    }

    async function imprimir(id: number, filename: string) {
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

    async function anular(id: number, motivo: string) {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const url =
          apiConfig.URL_BASE +
          '/' +
          axios.getEndpoint(endpoints.solicitudes_vacaciones) +
          '/anular/' +
          id
        const response: AxiosResponse = await axios.patch(url, {
          motivo: motivo
        })
        if (response.status === 200) {
          notificarCorrecto(response.data.mensaje)
          filtrarSolicitudes(tabDefecto.value)
        } else notificarError(response.data.mensaje)
      } catch (e: any) {
        console.error(e)
        if (e.response)
          if (e.response.status === 422) {
            notificarAdvertencia(
              e.response.data.message || 'Error de validación'
            )
          } else
            notificarAdvertencia('Error al anular la solicitud de vacaciones.')
        else notificarAdvertencia('Error de red o inesperado.')
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
        entidad.autorizador_id === store.user.id &&
        Number(tabDefecto.value) == 1,
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

    const btnAnular: CustomActionTable = {
      titulo: 'Anular',
      color: 'negative',
      icono: 'bi-x',
      accion: ({ entidad }) => {
        confirmar(
          '¿Está seguro que desea anular esta solicitud de vacación?',
          async () => {
            const data: CustomActionPrompt = {
              titulo: 'Motivo',
              mensaje: 'Ingrese un motivo de anulación',
              requerido: true,
              accion: async data => {
                await anular(entidad.id, data)
              }
            }
            prompt(data)
          }
        )
      },
      visible: () => store.esRecursosHumanos && tabDefecto.value === '2' //Aprobados
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
      btnImprimir,
      btnAnular
    }
  }
})
