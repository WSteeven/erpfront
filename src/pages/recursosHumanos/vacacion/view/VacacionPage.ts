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
import { accionesTabla, maskFecha } from 'config/utils'
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

export default defineComponent({
  components: { TabLayout, SelectorImagen, EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(Vacacion, new VacacionController())
    const {
      entidad: vacacion,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()
    const { onBeforeConsultar, onConsultado, onBeforeModificar } =
      mixin.useHooks()
    const {
      confirmar,
      prompt,
      notificarCorrecto,
      notificarAdvertencia,
      notificarError,
    } = useNotificaciones()
    const tipos = ref([
      { id: 1, nombre: 'Vacacion Descuento' },
      { id: 2, nombre: 'Anticipo' },
    ])
    const esConsultado = ref(false)
    onBeforeModificar(() => (esConsultado.value = true))
    const periodos = ref([])
    const recursosHumanosStore = useRecursosHumanosStore()
    const store = useAuthenticationStore()

    const data = reactive<{
      dias_descuento_vacaciones: string;
      empleado: Empleado | null;
    }>({
      dias_descuento_vacaciones: '',
      empleado: null
    });
    const dias_descuento_vacaciones = computed(() => {
      obtener_descuentos();
      return data.dias_descuento_vacaciones
    })

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
          empleado:   vacacion.empleado == null ? store.user.id:  data.empleado!.id,
        },
      })
        .then((response) => {
          const responseData = response.data
          if (responseData) {
            data.dias_descuento_vacaciones = convertirHorasAHumanos(responseData.duracion)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
    function convertirHorasAHumanos(horas) {
      const dias = Math.floor(horas / 8);
      const horasRestantes = horas % 8;

      let resultado = "";
      if (dias > 0) {
        resultado += dias + " día";
        if (dias > 1) {
          resultado += "s";
        }
        resultado += " ";
      }

      if (horasRestantes > 0) {
        resultado += horasRestantes + " hora";
        if (horasRestantes > 1) {
          resultado += "s";
        }
      }

      return resultado;
    }
    const empleado = ref();
    cargarVista(async () => {
      await obtenerListados({
        periodos: {
          controller: new PeriodoController(),
          params: { campos: 'id,nombre', activo: 1 },
        },
       empleados: {
          controller: new EmpleadoController(),
          params: {id:vacacion.empleado == null ? store.user.id:vacacion.empleado,
           estado: 1 },
        },
      })
     data.empleado = listadosAuxiliares.empleados[0]
      periodos.value = listadosAuxiliares.periodos
    })
    const dias_adicionales = computed(() => {
      const fecha_ingreso = vacacion.empleado !== null ?data.empleado!.fecha_ingreso:store.user.fecha_ingreso;
       if(fecha_ingreso == null){
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
      empleado: { required },
      periodo: { required },
      derecho_vacaciones: { required },
      descuento_vacaciones: { required },
      fecha_inicio_rango1_vacaciones: { required },
      fecha_fin_rango1_vacaciones: { required },
      fecha_inicio_rango2_vacaciones: { required },
      fecha_fin_rango2_vacaciones: { required },
      solicitud: { required },
    }))

    const v$ = useVuelidate(reglas, vacacion)
    setValidador(v$.value)
    const dias_rango1 = computed(() => {
      if (
        vacacion.fecha_inicio_rango1_vacaciones != null &&
        vacacion.fecha_fin_rango1_vacaciones != null
      ) {
        const fechaInicio = convertir_fecha(
          vacacion.fecha_inicio_rango1_vacaciones
        )
        const fechaFin = convertir_fecha(vacacion.fecha_fin_rango1_vacaciones)
        // Calcula la diferencia en dias
        const diferenciaDias = fechaFin.getDate() - fechaInicio.getDate()
        return diferenciaDias
      } else {
        return 0
      }
    })
    const dias_rango2 = computed(() => {
      if (
        vacacion.fecha_inicio_rango2_vacaciones != null &&
        vacacion.fecha_fin_rango2_vacaciones != null
      ) {
        const fechaInicio = convertir_fecha(
          vacacion.fecha_inicio_rango2_vacaciones
        )
        const fechaFin = convertir_fecha(vacacion.fecha_fin_rango2_vacaciones)
        // Calcula la diferencia en dias
        const diferenciaDias = fechaFin.getDate() - fechaInicio.getDate()
        return diferenciaDias
      } else {
        return 0
      }
    })
    const numero_dias = computed(() => {
      return dias_rango1.value + dias_rango2.value
    })

    function convertir_fecha(fecha) {
      const dateParts = fecha.split('-') // Dividir el string en partes usando el guión como separador

      const dia = parseInt(dateParts[0], 10) // Obtener el día como entero
      const mes = parseInt(dateParts[1], 10) - 1 // Obtener el mes como entero (restar 1 porque en JavaScript los meses comienzan desde 0)
      const anio = parseInt(dateParts[2], 10)
      const fecha_convert = new Date(anio, mes, dia, 0)
      return fecha_convert
    }

    watchEffect(() => {
      try {
      } catch (error) {}
    })

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

    return {
      removeAccents,
      mixin,
      vacacion,
      periodos,
      empleado,
      watchEffect,
      filtrarPeriodo,
      recursosHumanosStore,
      dias_adicionales,
      dias_descuento_vacaciones,
      esConsultado,
      dias_rango1,
      dias_rango2,
      numero_dias,
      tipos,
      maskFecha,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasVacacion,
      accion,
      accionesTabla,
    }
  },
})
