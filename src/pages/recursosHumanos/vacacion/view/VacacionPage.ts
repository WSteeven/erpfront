// Dependencias
import { configuracionColumnasVacacion } from '../domain/configuracionColumnasVacacion'
import { required } from 'shared/i18n-validators'
import { maxValue, minValue } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref, computed, watchEffect } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { VacacionController } from '../infraestructure/VacacionController'
import { Vacacion } from '../domain/Vacacion'
import { removeAccents } from 'shared/utils'
import { accionesTabla, maskFecha } from 'config/utils'
import { MotivoPermisoEmpleadoController } from 'pages/recursosHumanos/motivo/infraestructure/MotivoPermisoEmpleadoController'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useNotificaciones } from 'shared/notificaciones'
import { useRecursosHumanosStore } from 'stores/recursosHumanos'
import { PeriodoController } from 'pages/recursosHumanos/periodo/infraestructure/PeriodoController'

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
    const empleados = ref([])
    const dias_adicionales = ref(0)
    const dias_descuento_vacaciones = ref (0)
    const recursosHumanosStore = useRecursosHumanosStore()

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
        periodos: {
          controller: new PeriodoController(),
          params: { campos: 'id,nombre', activo: 1 },
        },
      })
      periodos.value = listadosAuxiliares.periodos
      empleados.value = listadosAuxiliares.empleados
    })

    //Reglas de validacion
    const reglas = computed(() => ({
      empleado: { required },
      periodo: { required },
      descuento_vacaciones: { required },
      fecha_inicio_rango1_vacaciones: { required },
      fecha_fin_rango1_vacaciones: { required },
      fecha_inicio_rango2_vacaciones: { required },
      fecha_fin_rango2_vacaciones: { required },
      solicitud: { required, minValue: minValue(1), maxValue: maxValue(12) },
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
    function filtrarEmpleado(val, update) {
      if (val === '') {
        update(() => {
          empleados.value = listadosAuxiliares.empleados
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        empleados.value = listadosAuxiliares.empleados.filter(
          (v) =>
            v.nombres.toLowerCase().indexOf(needle) > -1 ||
            v.apellidos.toLowerCase().indexOf(needle) > -1
        )
      })
    }
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
      empleados,
      watchEffect,
      filtrarEmpleado,
      filtrarPeriodo,
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
