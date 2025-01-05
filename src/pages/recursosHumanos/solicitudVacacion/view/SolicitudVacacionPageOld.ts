// Dependencias
import { configuracionColumnasSolicitudVacacion } from '../domain/configuracionColumnasSolicitudVacacion'
import { required } from 'shared/i18n-validators'
import { maxValue, minValue } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref } from 'vue'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SolicitudVacacionController } from '../infraestructure/SolicitudVacacionController'
import { SolicitudVacacion } from '../domain/SolicitudVacacion'
import { imprimirArchivo, ordenarLista, removeAccents } from 'shared/utils'
import { accionesTabla, maskFecha, tabOptionsVacaciones, acciones } from 'config/utils'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { useRecursosHumanosStore } from 'stores/recursosHumanos'
import { PeriodoController } from 'pages/recursosHumanos/periodo/infraestructure/PeriodoController'
import { useAuthenticationStore } from 'stores/authentication'
import { AxiosResponse } from 'axios'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'
import { format } from '@formkit/tempo'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useNotificaciones } from 'shared/notificaciones'
import { useQuasar } from 'quasar'
import { useNotificacionStore } from 'stores/notificacion'
import { useCargandoStore } from 'stores/cargando'

export default defineComponent({
  components: { TabLayoutFilterTabs2, EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(SolicitudVacacion, new SolicitudVacacionController())
    const {
      entidad: vacacion,
      disabled,
      accion,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, consultar, cargarVista, listar } =
      mixin.useComportamiento()
    const { onConsultado, onBeforeModificar } = mixin.useHooks()

    const { notificarAdvertencia } = useNotificaciones()

    /**
     * Stores
     */
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const recursosHumanosStore = useRecursosHumanosStore()
    const store = useAuthenticationStore()
    const cargando = new StatusEssentialLoading()
    /***
     * Inicializacion de  variables
     */
    const autorizaciones = ref()
    const esConsultado = ref(false)
    const esAutorizador = ref(false)
    const data_dias_descuento_vacaciones = ref()
    const empleado = ref()

    const dias_rango1 = ref()
    const dias_rango2 = ref()
    let tabVacacion = '1'

    const dias_descuento_vacaciones = computed(
      () => data_dias_descuento_vacaciones.value
    )

    const { empleados, filtrarEmpleados, periodos, filtrarPeriodos } =
      useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        periodos: {
          controller: new PeriodoController(),
          params: { campos: 'id,nombre', activo: 1 }
        },
        empleados: {
          controller: new EmpleadoController(),
          params: {
            // id: vacacion.empleado == null ? store.user.id : vacacion.empleado,
            estado: 1
          }
        },
        autorizaciones: {
          controller: new AutorizacionController(),
          params: {
            campos: 'id,nombre',
            es_validado: false,
            es_modulo_rhh: true
          }
        }
      })
      autorizaciones.value = listadosAuxiliares.autorizaciones
      empleados.value = listadosAuxiliares.empleados
      periodos.value = listadosAuxiliares.periodos
      await obtenerDescuentos()
    })

    //Reglas de validacion
    const reglas = computed(() => ({
      empleado: { reqiredIf: esAutorizador },
      reemplazo: { required },
      funciones: { required },
      periodo: { required },
      derecho_vacaciones: { reqiredIf: esAutorizador },
      numero_rangos: { required, minValue: minValue(1), maxValue: maxValue(2) },
      fecha_inicio: {
        requiredIf: vacacion.numero_rangos == '1'
      },
      fecha_fin: { requiredIf: vacacion.numero_rangos == '1' },
      numero_dias: {
        requiredIf: vacacion.numero_rangos == '1',
        maxValue: maxValue(15)
      }
    }))
    const v$ = useVuelidate(reglas, vacacion)
    setValidador(v$.value)

    /*******************************
     * HOOKS
     *******************************/
    onBeforeModificar(() => (esConsultado.value = true))
    onConsultado(() => {
      esAutorizador.value = store.user.id == vacacion.id_jefe_inmediato
      setTimeout(() => {
        vacacion.derecho_vacaciones =
          15 +
          dias_adicionales.value -
          parseInt(
            vacacion.descuento_vacaciones != null
              ? vacacion.descuento_vacaciones.toString()
              : '0'
          )
      }, 3000)
    })

    /**
     * La función 'obtenerDescuentos' realiza una solicitud GET a una URL específica y recupera
     * información de descuento para vacaciones.
     */
    // async function obtenerDescuentos() {
    //   try {
    //     cargando.activar()
    //     const axios = AxiosHttpRepository.getInstance()
    //     const url_acreditacion =
    //       apiConfig.URL_BASE +
    //       '/' +
    //       axios.getEndpoint(endpoints.descuentos_permiso)
    //     const response: AxiosResponse = await axios.get(url_acreditacion, {
    //       params: { empleado: vacacion.empleado ?? store.user.id }
    //     })
    //     const num_dias =
    //       response.data.duracion !== null ? response.data.duracion : 0
    //     vacacion.descuento_vacaciones =
    //       response.data.duracion != null ? Math.floor(num_dias / 24) : 0
    //     data_dias_descuento_vacaciones.value = Math.floor(
    //       num_dias / 24
    //     ).toString()
    //   } catch (error) {
    //     console.error(error)
    //   } finally {
    //     cargando.desactivar()
    //   }
    // }

    const dias_adicionales = computed(() => {
      const fecha_ingreso =
        vacacion.empleado == null ? store.user.id : vacacion.empleado

      if (fecha_ingreso == null) {
        return 0
      }
      const fechaInicio = new Date(store.user.fecha_ingreso)
      const fechaActual = new Date() // Obtiene la fecha actual
      let diasAdicionales = 0
      const aniosServicio =
        fechaActual.getFullYear() - fechaInicio.getFullYear() // Calcula los años de servicio
      if (aniosServicio >= 5) {
        const aniosExcedentes = aniosServicio - 4 // Calcula los años de excedente
        diasAdicionales = Math.min(aniosExcedentes, 15) // Limita los días adicionales a un máximo de 15
      }
      return diasAdicionales
    })

    /* El código define una propiedad computada `numero_dias_rango` que calcula el número total de días en
        un rango. */
    const numero_dias_rango = computed(() => {
      if (
        vacacion.numero_dias_rango1 != null &&
        vacacion.numero_dias_rango2 != null
      ) {
        return (
          parseInt(vacacion.numero_dias_rango1.toString()) +
          parseInt(vacacion.numero_dias_rango2.toString())
        )
      } else {
        return 0
      }
    })

    /**
     * La función 'calcular_fecha_fin' calcula la fecha de finalización de unas vacaciones en función de la
     * fecha de inicio y el número de días.
     */
    function calcular_fecha_fin() {
      if (
        vacacion.fecha_inicio !== null &&
        vacacion.numero_dias !== null &&
        vacacion.numero_dias !== undefined
      ) {
        const fechaInicio = new Date(vacacion.fecha_inicio)

        fechaInicio.setDate(
          fechaInicio.getDate() + parseInt(vacacion.numero_dias.toString())
        )
        vacacion.fecha_fin = format(fechaInicio, 'YYYY-MM-DD')
      } else {
        vacacion.fecha_fin = null
      }
    }

    /**
     * La función calcula la fecha de finalización de unas vacaciones en función de la fecha de inicio y el
     * número de días.
     */
    function calcular_fecha_fin_rango1() {
      if (
        vacacion.fecha_inicio_rango1_vacaciones !== null &&
        vacacion.numero_dias_rango1 !== null &&
        vacacion.numero_dias_rango1 !== undefined
      ) {
        const fechaInicio = new Date(vacacion.fecha_inicio_rango1_vacaciones)
        fechaInicio.setDate(
          fechaInicio.getDate() +
            parseInt(vacacion.numero_dias_rango1.toString())
        )
        vacacion.fecha_fin_rango1_vacaciones = format(fechaInicio, 'YYYY-MM-DD')
      } else {
        vacacion.fecha_fin_rango1_vacaciones = null
      }
    }

    /**
     * La función calcula la fecha de finalización de un intervalo de vacaciones en función de la fecha de
     * inicio y el número de días.
     */
    function calcular_fecha_fin_rango2() {
      if (
        vacacion.fecha_inicio_rango2_vacaciones !== null &&
        vacacion.numero_dias_rango2 !== null &&
        vacacion.numero_dias_rango2 !== undefined
      ) {
        const fechaInicio = new Date(vacacion.fecha_inicio_rango2_vacaciones)
        fechaInicio.setDate(
          fechaInicio.getDate() +
            parseInt(vacacion.numero_dias_rango2.toString())
        )
        vacacion.fecha_fin_rango2_vacaciones = format(fechaInicio, 'YYYY-MM-DD')
      } else {
        vacacion.fecha_fin_rango2_vacaciones = null
      }
    }

    /**
     * La función 'filtrarVacacion' filtra las vacaciones en función de la pestaña seleccionada y actualiza
     * la variable tabVacacion.
     * @param {string} tabSeleccionado - Una cadena que representa la pestaña seleccionada.
     */
    function filtrarVacacion(tabSeleccionado: string) {
      listar({ estado: tabSeleccionado }, false)
      tabVacacion = tabSeleccionado
    }

    function optionsFechaInicio(date) {
      const currentDateString = format(new Date(), 'YYYY/MM/DD')

      return date > currentDateString
    }

    function optionFechaInicioRango2(date) {
      const fecha_fin_rango1 =
        vacacion.fecha_fin_rango1_vacaciones !== null
          ? vacacion.fecha_fin_rango1_vacaciones
          : new Date().toString()
      const fechaInicio = new Date(fecha_fin_rango1)
      fechaInicio.setDate(fechaInicio.getDate() + 2)
      const currentDateString = format(fechaInicio, 'YYYY/MM/DD')
      return date >= currentDateString
    }

    // async function imprimir(id, filename) {
    //   try {
    //     cargando.activar()
    //     const axios = AxiosHttpRepository.getInstance()
    //     const url =
    //       apiConfig.URL_BASE +
    //       '/' +
    //       axios.getEndpoint(endpoints.solicitudes_vacaciones) +
    //       '/imprimir/' +
    //       id
    //     await imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
    //   } catch (e) {
    //     notificarAdvertencia('Error al imprimir el documento. ' + e)
    //   } finally {
    //     cargando.desactivar()
    //   }
    // }

    /**************************
     * BOTONES DE TABLAS
     **************************/
    const editarVacacion: CustomActionTable = {
      titulo: ' ',
      icono: 'bi-pencil-square',
      color: 'secondary',
      visible: ({ entidad }) => entidad.empleado !== store.user.id,
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
        console.log('Presionaste imprimir', entidad)
        await imprimir(
          entidad.id,
          `Solicitud vacaciones ${entidad.periodo} ${entidad.empleado_info}`
        )
      },
      visible: () => ['1', '2'].includes(tabVacacion)
    }

    return {
      mixin,
      vacacion,
      periodos,
      empleado,
      autorizaciones,
      tabOptionsVacaciones,
      recursosHumanosStore,
      esAutorizador,
      dias_adicionales,
      dias_descuento_vacaciones,
      esConsultado,
      dias_rango1,
      dias_rango2,
      numero_dias_rango,
      maskFecha,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasSolicitudVacacion,
      accion,
      acciones,
      accionesTabla,
      tabVacacion,

      //funciones
      removeAccents,
      optionsFechaInicio,
      optionFechaInicioRango2,
      filtrarPeriodos,
      filtrarVacacion,
      calcular_fecha_fin_rango1,
      calcular_fecha_fin_rango2,
      calcular_fecha_fin,
      ordenarLista,

      // listados
      empleados,
      filtrarEmpleados,

      // botones de tabla
      editarVacacion,
      btnImprimir
    }
  }
})
