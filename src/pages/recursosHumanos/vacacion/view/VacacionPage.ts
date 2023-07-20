// Dependencias
import { configuracionColumnasVacacion } from '../domain/configuracionColumnasVacacion'
import { required } from 'shared/i18n-validators'
import { maxValue, minValue } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref, computed, watchEffect, reactive } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { VacacionController } from '../infraestructure/VacacionController'
import { Vacacion } from '../domain/Vacacion'
import { removeAccents } from 'shared/utils'
import { accionesTabla, maskFecha, tabOptionsVacaciones } from 'config/utils'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { useNotificaciones } from 'shared/notificaciones'
import { useRecursosHumanosStore } from 'stores/recursosHumanos'
import { PeriodoController } from 'pages/recursosHumanos/periodo/infraestructure/PeriodoController'
import { useAuthenticationStore } from 'stores/authentication'
import axios from 'axios'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { LocalStorage } from 'quasar'

export default defineComponent({
  components: { TabLayoutFilterTabs2, SelectorImagen, EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(Vacacion, new VacacionController())
    const {
      entidad: vacacion,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, consultar, cargarVista, listar } =
      mixin.useComportamiento()
    /* El código anterior usa un mixin para acceder y usar ganchos en una base de código de TypeScript.
       Está desestructurando las funciones `onConsultado` y `onBeforeModificar` de la función
      `mixin.useHooks()` y asignándolas a variables. */
    const { onConsultado, onBeforeModificar } = mixin.useHooks()
    /**
     * Stores
     */
    const recursosHumanosStore = useRecursosHumanosStore()
    const store = useAuthenticationStore()
    /* El código anterior define una función TypeScript llamada `onBeforeModificar` que no acepta
      argumentos. Dentro de la función, establece el valor de una variable `esConsultado` a `true`. */
    onBeforeModificar(() => (esConsultado.value = true))
    /* El código anterior define una función de devolución de llamada que se ejecutará cuando ocurra un
      evento "consultado". Dentro de la función de devolución de llamada, verifica si la ID del usuario
      es igual a la ID del jefe inmediato de la solicitud de vacaciones. Si son iguales pone el valor
      de "esAutorizador" a verdadero, en caso contrario lo pone a falso. */
    /* El código anterior está escrito en TypeScript y define una función llamada `onConsultado`. Dentro de
       la función se está comprobando si el `id` del usuario en la tienda es igual al `id_jefe_inmediato`
       del objeto `vacacion`. Si son iguales pone el valor de `esAutorizador` en `true`, en caso contrario
       lo pone en `false`. */
    onConsultado(() => {
      esAutorizador.value =
        store.user.id == vacacion.id_jefe_inmediato ? true : false
    })
    cargarVista(async () => {
      await obtenerListados({
        periodos: {
          controller: new PeriodoController(),
          params: { campos: 'id,nombre', activo: 1 },
        },
        empleados: {
          controller: new EmpleadoController(),
          params: {
            id: vacacion.empleado == null ? store.user.id : vacacion.empleado,
            estado: 1,
          },
        },
      })
      autorizaciones.value =
        LocalStorage.getItem('autorizaciones') == null
          ? []
          : JSON.parse(LocalStorage.getItem('autorizaciones')!.toString())
      data.empleado = listadosAuxiliares.empleados[0]
      periodos.value = listadosAuxiliares.periodos
    })

    /***
     * Inicializacion de  variables
     */
    const autorizaciones = ref()
    const esConsultado = ref(false)
    const periodos = ref([])
    const esAutorizador = ref(false)
    const data = reactive<{
      dias_descuento_vacaciones: string
      empleado: Empleado | null
    }>({
      dias_descuento_vacaciones: '',
      empleado: null,
    })
    const empleado = ref()
    const esNuevo = computed(() => {
      return accion.value === 'NUEVO'
    })
    const dias_rango1 = ref()
    const dias_rango2 = ref()
    let tabVacacion = '1'

    /* El código anterior define una propiedad computada llamada "dias_descuento_vacaciones" en TypeScript.
       Esta propiedad calculada utiliza una función para calcular su valor. Dentro de la función llama a la
       función "obtener_descuentos()" y luego devuelve el valor de "data.dias_descuento_vacaciones". */
    const dias_descuento_vacaciones = computed(() => {
      obtener_descuentos()
      return data.dias_descuento_vacaciones
    })

    /**
     * La función "obtener_descuentos" realiza una solicitud GET a una URL específica y recupera
     * información de descuento para vacaciones.
     */
    function obtener_descuentos() {
      const axiosHttpRepository = AxiosHttpRepository.getInstance()
      const url_acreditacion =
        apiConfig.URL_BASE +
        '/' +
        axiosHttpRepository.getEndpoint(endpoints.descuentos_permiso)
      axios({
        url: url_acreditacion,
        method: 'GET',
        responseType: 'json',
        headers: {
          Authorization: axiosHttpRepository.getOptions().headers.Authorization,
        },
        params: {
          empleado:
            vacacion.empleado == null ? store.user.id : data.empleado!.id,
        },
      })
        .then((response) => {
          const responseData = response.data
          if (responseData) {
            vacacion.descuento_vacaciones =
              responseData.duracion != null ? responseData.duracion : 0
            data.dias_descuento_vacaciones = convertirHorasAHumanos(
              responseData.duracion
            )
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
    /**
     * La función "convertirHorasAHumanos" convierte una determinada cantidad de horas a un formato
     * legible por humanos, mostrando la cantidad de días y horas restantes.
     * @param horas - El parámetro "horas" representa la cantidad de horas que desea convertir a un
     * formato legible por humanos.
     * @returns una cadena que representa las horas de entrada convertidas a un formato legible por
     * humanos.
     */
    function convertirHorasAHumanos(horas) {
      const dias = Math.floor(horas / 24)
      const horasRestantes = horas % 24

      let resultado = ''
      if (dias > 0) {
        resultado += dias + ' día'
        if (dias > 1) {
          resultado += 's'
        }
        resultado += ' '
      }

      if (horasRestantes > 0) {
        resultado += horasRestantes + ' hora'
        if (horasRestantes > 1) {
          resultado += 's'
        }
      }

      return resultado
    }
    const dias_adicionales = computed(() => {
      const fecha_ingreso =
        vacacion.empleado !== null
          ? data.empleado!.fecha_ingreso
          : store.user.fecha_ingreso
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
    //Reglas de validacion
    const reglas = computed(() => ({
      empleado: { reqiredIf: esAutorizador },
      periodo: { required },
      derecho_vacaciones: { reqiredIf: esAutorizador },
      fecha_inicio: { required },
      fecha_fin: { required },
      solicitud: { required },
    }))
    const v$ = useVuelidate(reglas, vacacion)
    setValidador(v$.value)

    /* El código define una propiedad computada `numero_dias_rango` que calcula el número total de días en
        un rango. */
    const numero_dias_rango = computed(() => {
      if (
        vacacion.numero_dias_rango1 != null &&
        vacacion.numero_dias_rango2!= null
      ) {
        return parseInt(vacacion.numero_dias_rango1.toString()) + parseInt(vacacion.numero_dias_rango2.toString())
      } else {
        return 0
      }
    })
    /**
     * La función "convertir_fecha" toma una cadena que representa una fecha en el formato "dd-mm-yyyy" y
     * devuelve un objeto Date.
     * @param fecha - El parámetro `fecha` es una cadena que representa una fecha en el formato
     * "dd-mm-yyyy".
     * @returns un objeto de fecha que representa la fecha convertida.
     */
    function convertir_fecha(fecha) {
      const dateParts = fecha.split('-') // Dividir el string en partes usando el guión como separador

      const dia = parseInt(dateParts[0], 10) // Obtener el día como entero
      const mes = parseInt(dateParts[1], 10) - 1 // Obtener el mes como entero (restar 1 porque en JavaScript los meses comienzan desde 0)
      const anio = parseInt(dateParts[2], 10)
      const fecha_convert = new Date(anio, mes, dia, 0)
      return fecha_convert
    }

    /**
     * La función "calcular_fecha_fin" calcula la fecha de finalización de unas vacaciones en función de la
     * fecha de inicio y el número de días.
     */
    function calcular_fecha_fin() {
      if (
        vacacion.fecha_inicio !== null &&
        vacacion.numero_dias !== null &&
        vacacion.numero_dias !== undefined
      ) {
        const fechaInicio = convertir_fecha(vacacion.fecha_inicio)
        const fechaFinal = fechaInicio
        fechaFinal.setDate(fechaInicio.getDate() + parseInt(vacacion.numero_dias.toString()))
        // Formatear la fecha a "año-mes-día"
        const anio = fechaFinal.getFullYear()
        const mes = ('0' + (fechaFinal.getMonth() + 1)).slice(-2)
        const dia = ('0' + fechaFinal.getDate()).slice(-2)
        vacacion.fecha_fin = dia + '-' + mes + '-' + anio
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
        const fechaInicio = convertir_fecha(
          vacacion.fecha_inicio_rango1_vacaciones
        )
        const fechaFinal = fechaInicio
        fechaFinal.setDate(fechaInicio.getDate() + parseInt(vacacion.numero_dias_rango1.toString()));
        // Formatear la fecha a "año-mes-día"
        const anio = fechaFinal.getFullYear()
        const mes = ('0' + (fechaFinal.getMonth() + 1)).slice(-2)
        const dia = ('0' + fechaFinal.getDate()).slice(-2)
        vacacion.fecha_fin_rango1_vacaciones = dia + '-' + mes + '-' + anio
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
        const fechaInicio = convertir_fecha(
          vacacion.fecha_inicio_rango2_vacaciones
        )
        const fechaFinal = fechaInicio
        fechaFinal.setDate(fechaInicio.getDate() + parseInt(vacacion.numero_dias_rango2.toString()));
        // Formatear la fecha a "año-mes-día"
        const anio = fechaFinal.getFullYear()
        const mes = ('0' + (fechaFinal.getMonth() + 1)).slice(-2)
        const dia = ('0' + fechaFinal.getDate()).slice(-2)
        vacacion.fecha_fin_rango2_vacaciones = dia + '-' + mes + '-' + anio
      } else {
        vacacion.fecha_fin_rango2_vacaciones = null
      }
    }

    /* El código anterior define una variable constante llamada `editarVacacion` que es del tipo
`CustomActionTable`. Tiene las siguientes propiedades: */
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
     * La función "filtrarVacacion" filtra las vacaciones en función de la pestaña seleccionada y actualiza
     * la variable tabVacacion.
     * @param {string} tabSeleccionado - Una cadena que representa la pestaña seleccionada.
     */
    function filtrarVacacion(tabSeleccionado: string) {
      listar({ estado: tabSeleccionado }, false)
      tabVacacion = tabSeleccionado
    }

    return {
      removeAccents,
      mixin,
      vacacion,
      periodos,
      empleado,
      editarVacacion,
      filtrarPeriodo,
      filtrarVacacion,
      calcular_fecha_fin_rango1,
      calcular_fecha_fin_rango2,
      calcular_fecha_fin,
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
    }
  },
})
