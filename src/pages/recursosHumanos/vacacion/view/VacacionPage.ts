// Dependencias
import { configuracionColumnasVacacion } from '../domain/configuracionColumnasVacacion'
import { required } from 'shared/i18n-validators'
import { maxValue, minValue } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref, computed, reactive } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { VacacionController } from '../infraestructure/VacacionController'
import { Vacacion } from '../domain/Vacacion'
import { ordenarLista, removeAccents } from 'shared/utils'
import { accionesTabla, maskFecha, tabOptionsVacaciones } from 'config/utils'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { useRecursosHumanosStore } from 'stores/recursosHumanos'
import { PeriodoController } from 'pages/recursosHumanos/periodo/infraestructure/PeriodoController'
import { useAuthenticationStore } from 'stores/authentication'
import axios, { AxiosResponse } from 'axios'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'
import { format } from '@formkit/tempo'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export default defineComponent({
  components: { TabLayoutFilterTabs2, SelectorImagen, EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(Vacacion, new VacacionController())
    const { entidad: vacacion, disabled, accion, listadosAuxiliares, } = mixin.useReferencias()
    const { setValidador, obtenerListados, consultar, cargarVista, listar } = mixin.useComportamiento()
    const { onConsultado, onBeforeModificar } = mixin.useHooks()
    /**
     * Stores
     */
    const recursosHumanosStore = useRecursosHumanosStore()
    const store = useAuthenticationStore()
    const cargando = new StatusEssentialLoading()
    /***
     * Inicializacion de  variables
     */
    const autorizaciones = ref()
    const esConsultado = ref(false)
    const periodos = ref([])
    const esAutorizador = ref(false)
    const data_dias_descuento_vacaciones = ref()
    const empleado = ref()
    const esNuevo = computed(() => {
      return accion.value === 'NUEVO'
    })
    const dias_rango1 = ref()
    const dias_rango2 = ref()
    let tabVacacion = '1'

    const dias_descuento_vacaciones = computed(() =>  data_dias_descuento_vacaciones.value)

    const { empleados, filtrarEmpleados } = useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        periodos: {
          controller: new PeriodoController(),
          params: { campos: 'id,nombre', activo: 1 },
        },
        empleados: {
          controller: new EmpleadoController(),
          params: {
            // id: vacacion.empleado == null ? store.user.id : vacacion.empleado,
            estado: 1,
          },
        },
        autorizaciones: {
          controller: new AutorizacionController(),
          params: {
            campos: 'id,nombre',
            es_validado: false,
            es_modulo_rhh: true,
          },
        },
      })
      autorizaciones.value = listadosAuxiliares.autorizaciones
      empleados.value = listadosAuxiliares.empleados
      periodos.value = listadosAuxiliares.periodos
      obtenerDescuentos()
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
        requiredIf: vacacion.numero_rangos == '1' ? true : false,
      },
      fecha_fin: { requiredIf: vacacion.numero_rangos == '1' ? true : false },
      numero_dias: {
        requiredIf: vacacion.numero_rangos == '1' ? true : false,
        maxValue: maxValue(15),
      },
    }))
    const v$ = useVuelidate(reglas, vacacion)
    setValidador(v$.value)

    /*******************************
     * HOOKS
     *******************************/
    onBeforeModificar(() => (esConsultado.value = true))
    onConsultado(() => {
      esAutorizador.value =
        store.user.id == vacacion.id_jefe_inmediato ? true : false
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
    async function obtenerDescuentos() {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const url_acreditacion = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.descuentos_permiso)
        const response: AxiosResponse = await axios.get(url_acreditacion, { params: { empleado: vacacion.empleado ?? store.user.id } })
        const num_dias = response.data.duracion !== null ? response.data.duracion : 0
        vacacion.descuento_vacaciones = response.data.duracion != null ? Math.floor(num_dias / 24) : 0
        data_dias_descuento_vacaciones.value = Math.floor(num_dias / 24).toString()
      } catch (error) {
        console.error(error)
      } finally {
        cargando.desactivar()
      }
    }
    /**
     * La función 'convertirHorasAHumanos' convierte una determinada cantidad de horas a un formato
     * legible por humanos, mostrando la cantidad de días y horas restantes.
     * @param horas - El parámetro 'horas' representa la cantidad de horas que desea convertir a un
     * formato legible por humanos.
     * @returns una cadena que representa las horas de entrada convertidas a un formato legible por
     * humanos.
     */
    // function convertirHorasAHumanos(horas) {
    //   const dias = Math.floor(horas / 24)
    //   const horasRestantes = horas % 24

    //   let resultado = ''
    //   if (dias > 0) {
    //     resultado += dias + ' día'
    //     if (dias > 1) {
    //       resultado += 's'
    //     }
    //     resultado += ' '
    //   }

    //   if (horasRestantes > 0) {
    //     resultado += horasRestantes + ' hora'
    //     if (horasRestantes > 1) {
    //       resultado += 's'
    //     }
    //   }

    //   return resultado
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
     * La función 'convertir_fecha' toma una cadena que representa una fecha en el formato 'dd-mm-yyyy' y
     * devuelve un objeto Date.
     * @param fecha - El parámetro `fecha` es una cadena que representa una fecha en el formato
     * 'dd-mm-yyyy'.
     * @returns un objeto de fecha que representa la fecha convertida.
     */
    // function convertir_fecha(fecha) {
    //   const dateParts = fecha.split('-') // Dividir el string en partes usando el guión como separador

    //   const dia = parseInt(dateParts[0], 10) // Obtener el día como entero
    //   const mes = parseInt(dateParts[1], 10) - 1 // Obtener el mes como entero (restar 1 porque en JavaScript los meses comienzan desde 0)
    //   const anio = parseInt(dateParts[2], 10)
    //   const fecha_convert = new Date(anio, mes, dia, 0)
    //   return fecha_convert
    // }

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
          fechaInicio.getDate() +
          (parseInt(vacacion.numero_dias.toString()))
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
          (parseInt(vacacion.numero_dias_rango1.toString()))
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
          (parseInt(vacacion.numero_dias_rango2.toString()))
        )
        vacacion.fecha_fin_rango2_vacaciones = format(fechaInicio, 'YYYY-MM-DD')
      } else {
        vacacion.fecha_fin_rango2_vacaciones = null
      }
    }


    /**
     * La función `filtrarPeriodo` filtra una lista de períodos en función de un valor dado y actualiza la
     * lista filtrada.
     * @param val - El parámetro `val` es un valor de cadena que representa el valor de entrada para
     * filtrar los períodos. Se utiliza para buscar períodos que tienen un nombre que contiene el valor de
     * entrada.
     * @param update - El parámetro `update` es una función que se utiliza para actualizar el valor de
     * `periodos`. Es una función de devolución de llamada que toma otra función como argumento. La función
     * interna es responsable de actualizar el valor de `periodos` en función del parámetro `val` dado.
     * @returns nada (indefinido).
     */
    function filtrarPeriodo(val, update) {
      if (val === '') {
        update(() => {
          periodos.value = listadosAuxiliares.periodos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        periodos.value = listadosAuxiliares.periodos.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
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
      const fecha_fin_rango1 = vacacion.fecha_fin_rango1_vacaciones !== null ? vacacion.fecha_fin_rango1_vacaciones : new Date().toString()
      const fechaInicio = new Date(fecha_fin_rango1)
      fechaInicio.setDate(
        fechaInicio.getDate() +
        (2)
      )
      const currentDateString = format(fechaInicio, 'YYYY/MM/DD')
      return date >= currentDateString

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
      },
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
      esNuevo,
      numero_dias_rango,
      maskFecha,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasVacacion,
      accion,
      accionesTabla,
      tabVacacion,

      //funciones
      removeAccents,
      optionsFechaInicio,
      optionFechaInicioRango2,
      filtrarPeriodo,
      filtrarVacacion,
      calcular_fecha_fin_rango1,
      calcular_fecha_fin_rango2,
      calcular_fecha_fin,
      ordenarLista,

      // listados
      empleados, filtrarEmpleados,

      // botones de tabla
      editarVacacion,
    }
  },
})
