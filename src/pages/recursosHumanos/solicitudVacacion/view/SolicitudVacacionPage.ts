// Dependencies
import { configuracionColumnasSolicitudVacacion } from '../domain/configuracionColumnasSolicitudVacacion'
import { maxValue, minValue, required } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, Ref, ref } from 'vue'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SolicitudVacacionController } from '../infraestructure/SolicitudVacacionController'
import { SolicitudVacacion } from '../domain/SolicitudVacacion'
import { imprimirArchivo, ordenarLista, removeAccents } from 'shared/utils'
import {
  acciones,
  accionesTabla,
  maskFecha,
  tabOptionsVacaciones
} from 'config/utils'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { useRecursosHumanosStore } from 'stores/recursosHumanos'
import { useAuthenticationStore } from 'stores/authentication'
import { AxiosResponse } from 'axios'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'
import { addDay, format } from '@formkit/tempo'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useNotificaciones } from 'shared/notificaciones'
import { useQuasar } from 'quasar'
import { useNotificacionStore } from 'stores/notificacion'
import { useCargandoStore } from 'stores/cargando'
import { VacacionController } from 'recursosHumanos/vacaciones/infraestructure/VacacionController'
import { PlanVacacionController } from 'recursosHumanos/planVacacion/infraestructure/PlanVacacionController'
import { Vacacion } from 'recursosHumanos/vacaciones/domain/Vacacion'
import { PlanVacacion } from 'recursosHumanos/planVacacion/domain/PlanVacacion'

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
    const { onConsultado, onBeforeModificar, onReestablecer } = mixin.useHooks()
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
    const vacacionController = new VacacionController()
    const vacaciones: Ref<Vacacion> = ref([])
    const planes_vacaciones: Ref<PlanVacacion> = ref([])
    const dias_disponibles = ref(0)
    const dias_restantes = ref(0)
    const periodos = ref([])
    // const dias_disponibles = computed(() =>
    //   vacaciones.value[0]?.dias_disponibles ??
    //   planes_vacaciones.value[0]?.dias > 0
    //     ? planes_vacaciones.value[0]?.dias
    //     : planes_vacaciones.value[0]?.dias_primer_rango > 0
    //     ? planes_vacaciones.value[0]?.dias_primer_rango
    //     : planes_vacaciones.value[0]?.dias_segundo_rango > 0
    //     ? planes_vacaciones.value[0]?.dias_segundo_rango
    //     : 0
    // )
    const dias_rango1 = ref()
    const dias_rango2 = ref()
    let tabVacacion = '1'

    const dias_descuento_vacaciones = computed(
      () => data_dias_descuento_vacaciones.value
    )

    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
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
        },
        vacaciones: {
          controller: vacacionController,
          params: { completadas: 0, empleado_id: store.user.id }
        },
        planes_vacaciones: {
          controller: new PlanVacacionController(),
          params: { empleado_id: store.user.id }
        }
      })
      solicitud.empleado = store.user.id
      autorizaciones.value = listadosAuxiliares.autorizaciones
      empleados.value = listadosAuxiliares.empleados
      planes_vacaciones.value = listadosAuxiliares.planes_vacaciones
      vacaciones.value = listadosAuxiliares.vacaciones

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
      fecha_inicio: { required },
      fecha_fin: { required }
    }
    const v$ = useVuelidate(reglas, solicitud)
    setValidador(v$.value)

    /*******************************
     * HOOKS
     *******************************/
    onBeforeModificar(() => (esConsultado.value = true))
    onConsultado(async () => {
      await obtenerDerechoVacaciones(solicitud.empleado)
      periodoSeleccionado()
      dias_restantes.value = dias_disponibles.value - solicitud.dias_solicitados
      esAutorizador.value = store.user.id == solicitud.autorizador
    })
    onReestablecer(() => (solicitud.empleado = store.user.id))

    /*******************************
     * FUNCIONES
     *******************************/
    async function obtenerDerechoVacaciones(id: number) {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.derecho_vacaciones) + '/' + id
        const response: AxiosResponse = await axios.get(ruta)
        console.log(response.data)
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

    // async function obtenerDerechoVacacionesOld() {
    //   let dias = 0
    //   let fecha_inicio = null
    //   if (vacaciones.value.length > 0) {
    //     if (planes_vacaciones.value.length > 0) {
    //       // este caso es para usuarios como Wilson Cordova que tienen al menos 1 registro de vacaciones activo
    //       dias =
    //         vacaciones.value[0].periodo === planes_vacaciones.value[0].periodo
    //           ? vacaciones.value[0].dias_disponibles
    //           : 0
    //       fecha_inicio = obtenerFechaInicioCercanaPlanVacaciones()
    //     } else {
    //       // Aqui se tiene al menos un registro de vacaciones activo pero no se tiene plan de vacaciones creado
    //       dias = vacaciones.value[0].dias_disponibles
    //       const anioVacaciones = parseInt(
    //         vacaciones.value[0].periodo.split('-')[1]
    //       )
    //       fecha_inicio = format(
    //         anioVacaciones +
    //           '-' +
    //           store.user.fecha_ingreso.split('-')[1] +
    //           '-' +
    //           store.user.fecha_ingreso.split('-')[2],
    //         maskFecha
    //       )
    //     }
    //   } else {
    //     // Aqui no se tiene registro de vacaciones
    //     if (planes_vacaciones.value.length > 0) {
    //       // aqui debe ir el caso para usuarios como Erick Cañarte que no tienen registro de vacaciones activo, pero si tienen plan de vacaciones creado
    //       // se tienen al menos 1 registro de plan de vacaciones activo
    //       //Como ya tiene plan de vacaciones pero aún no tiene registro de vacaciones creado, toca crearle uno para asociar a este los datos.
    //       // 1. Crear el registro de vacaciones
    //       await crearVacacion(planes_vacaciones.value[0].periodo_id)
    //
    //       //2. Partiendo de que ya se tiene el registro de vacaciones, obtenemos los días disponibles que por defecto son 15, luego la fecha
    //       dias = vacaciones.value[0].dias_disponibles
    //       fecha_inicio = obtenerFechaInicioCercanaPlanVacaciones()
    //     } else {
    //       // Aqui debe ir el caso para usuarios que no tengan ni uno ni otro
    //       // Aqui no se tiene registro de vacaciones activo ni plan de vacaciones creado
    //       // Se verifica si hay algún ultimo registro de vacaciones creado para ese usuarios
    //       const result = (
    //         await vacacionController.listar({
    //           empleado_id: store.user.id,
    //           'f_params[orderBy][field]': 'created_at',
    //           'f_params[orderBy][type]': 'DESC',
    //           'f_params[limit]': 1
    //         })
    //       )[0]
    //       if (result == null) {
    //         // Como no hay plan de vacaciones, la fecha se elige a libertad pero se debe crear el registro de vacaciones igualmente
    //         const periodo = (
    //           await new PeriodoController().listar({
    //             'nombre[like]': store.user.fecha_ingreso.split('-')[0] + '%',
    //             'f_params[limit]': 1
    //           })
    //         )[0]
    //         await crearVacacion(periodo.id)
    //       } else {
    //         const periodo = (
    //           await new PeriodoController().listar({
    //             'nombre[like]': result.periodo.split('-')[1] + '%',
    //             'f_params[limit]': 1
    //           })
    //         )[0]
    //         await crearVacacion(periodo.id)
    //       }
    //       dias = vacaciones.value[0].dias_disponibles
    //       fecha_inicio = obtenerFechaActual(maskFecha)
    //     }
    //   }
    //
    //   return { dias, fecha_inicio }
    // }

    // async function crearVacacion(periodo_id: number) {
    //   const vacacion = new Vacacion()
    //   vacacion.empleado = store.user.id
    //   vacacion.periodo = periodo_id
    //   const response: AxiosResponse = await vacacionController.guardar(vacacion)
    //   if (response.status == 200) vacaciones.value.push(response.data.modelo)
    // }

    // function obtenerFechaInicioCercanaPlanVacaciones() {
    //   const hoy = new Date()
    //   const fechas = [
    //     new Date(planes_vacaciones.value[0].fecha_inicio),
    //     new Date(planes_vacaciones.value[0].fecha_inicio_primer_rango),
    //     new Date(planes_vacaciones.value[0].fecha_inicio_segundo_rango)
    //   ].filter(fecha => !isNaN(fecha))
    //
    //   const fechasHaciaAdelante = fechas.filter(fecha => fecha >= hoy)
    //   let fechaCercana
    //
    //   if (fechasHaciaAdelante.length > 0) {
    //     fechaCercana = fechasHaciaAdelante.reduce((a, b) => (a < b ? a : b))
    //   } else {
    //     fechaCercana = fechas.reduce((a, b) => (a > b ? a : b))
    //   }
    //
    //   return format(fechaCercana, maskFecha)
    // }

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
     * la variable tabVacacion.
     * @param {string} tabSeleccionado - Una cadena que representa la pestaña seleccionada.
     */
    function filtrarSolicitudes(tabSeleccionado: string) {
      listar({ autorizacion_id: tabSeleccionado }, false)
      tabVacacion = tabSeleccionado
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
          `Solicitud vacaciones ${entidad.periodo} ${entidad.empleado}`
        )
      },
      visible: () => ['1', '2'].includes(tabVacacion)
    }

    return {
      mixin,
      solicitud,
      empleado,
      autorizaciones,
      tabOptionsVacaciones,
      recursosHumanosStore,
      esAutorizador,
      dias_descuento_vacaciones,
      esConsultado,
      dias_rango1,
      dias_rango2,
      maskFecha,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasSolicitudVacacion,
      accion,
      acciones,
      accionesTabla,
      tabVacacion,
      dias_disponibles,
      dias_restantes,

      //funciones
      removeAccents,
      optionsFechaInicio,
      filtrarSolicitudes,

      calcularFechaFin,
      ordenarLista,
      periodoSeleccionado,

      // listados
      empleados,
      filtrarEmpleados,
      vacaciones,
      planes_vacaciones,
      periodos,

      // botones de tabla
      editarVacacion,
      btnImprimir
    }
  }
})
