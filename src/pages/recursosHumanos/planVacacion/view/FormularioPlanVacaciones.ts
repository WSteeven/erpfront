import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { computed, defineComponent, ref, watch } from 'vue'
import { acciones, maskFecha } from 'config/utils'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PlanVacacion } from 'recursosHumanos/planVacacion/domain/PlanVacacion'
import { requiredIf } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { PlanVacacionController } from 'recursosHumanos/planVacacion/infraestructure/PlanVacacionController'
import { addDay, format } from '@formkit/tempo'
import { useNotificaciones } from 'shared/notificaciones'
import { PeriodoController } from 'recursosHumanos/periodo/infraestructure/PeriodoController'
import { useEmpleadoStore } from 'stores/empleado'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { Periodo } from 'recursosHumanos/periodo/domain/Periodo'

export default defineComponent({
  components: { ButtonSubmits },
  props: {
    identificador: { type: Number, default: -1 },
    accion: {
      type: String,
      default: acciones.nuevo
    },
    plan: {
      type: PlanVacacion,
      required: true
    },
    diasDisponibles: {
      type: Number,
      required: true
    },
    empleado: {
      type: Number,
      required: true
    },
    periodo: {
      type: Number,
      default: -1
    },
    habilitarBotones: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(
      PlanVacacion,
      new PlanVacacionController()
    )
    const {
      entidad: planVacacion,
      accion,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { setValidador, guardar, editar, cargarVista, obtenerListados } =
      mixin.useComportamiento()
    const { onGuardado, onModificado } = mixin.useHooks()
    const { notificarAdvertencia } = useNotificaciones()

    const mostrarFormularioCrearPlan = ref(false)
    const empleadoStore = useEmpleadoStore()

    /************
     * INIT
     ************/
    console.log(props)
    if (props.accion == acciones.editar) planVacacion.hydrate(props.plan)
    planVacacion.empleado = props.empleado
    planVacacion.periodo = props.periodo
    console.log(props.periodo)
    if (props.plan!=undefined)
      planVacacion.periodo = props.plan?.periodo_id

    /*************
     * HOOKS
     ************/
    onGuardado(() => {
      emit('guardado', accion)
    })
    onModificado(() => {
      emit('guardado', accion)
    })
    const { periodos, filtrarPeriodos } =
      useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        periodos: props.periodo == -1 ? new PeriodoController() : []
      })

      // Carga inicial de los listados
      periodos.value = listadosAuxiliares.periodos
    })

    const reglas = {
      fecha_inicio: { required: requiredIf(() => planVacacion.rangos == 1) },
      fecha_fin: { required: requiredIf(() => planVacacion.rangos == 1) },
      fecha_inicio_primer_rango: {
        required: requiredIf(() => planVacacion.rangos == 2)
      },
      fecha_fin_primer_rango: {
        required: requiredIf(() => planVacacion.rangos == 2)
      },
      fecha_inicio_segundo_rango: {
        required: requiredIf(() => planVacacion.rangos == 2)
      },
      fecha_fin_segundo_rango: {
        required: requiredIf(() => planVacacion.rangos == 2)
      },
      dias_primer_rango: {
        required: requiredIf(() => planVacacion.rangos == 2)
      },
      dias_segundo_rango: {
        required: requiredIf(() => planVacacion.rangos == 2)
      },
      periodo: { required: requiredIf(() => props.periodo == -1) }
    }
    const v$ = useVuelidate(reglas, planVacacion)
    v$.value = setValidador(v$.value)

    const crearPlanVacaciones = () => {
      mostrarFormularioCrearPlan.value = true
    }
    const cancelar = () => {
      emit('cancelar', props.identificador)
      mostrarFormularioCrearPlan.value = false
    }
    const calcularFechaFin = () => {
      planVacacion.fecha_fin = format(
        addDay(planVacacion.fecha_inicio, props.diasDisponibles - 1),
        maskFecha
      )
    }

    function obtenerPeriodos() {
      if (empleadoStore.idEmpleado) {
        const anioIngreso = parseInt(
          empleadoStore.empleado.fecha_ingreso.split('-')[0]
        )
        listadosAuxiliares.periodos = listadosAuxiliares.periodos.filter(
          (periodo: Periodo) => {
            const anioInicial = parseInt(periodo.nombre.split('-')[0])
            return anioInicial >= anioIngreso
          }
        )
      }
      periodos.value = listadosAuxiliares.periodos
    }

    watch(() => {
      if (
        Number(planVacacion.dias_primer_rango) +
          Number(planVacacion.dias_segundo_rango) >
        props.diasDisponibles
      )
        notificarAdvertencia(
          `La suma de los días para el primer y segundo rango no deben exceder ${props.diasDisponibles} días`
        )
    })

    const calcularFechaFinPrimerRango = () => {
      if (
        planVacacion.fecha_inicio_primer_rango &&
        planVacacion.dias_primer_rango > 0
      ) {
        planVacacion.fecha_fin_primer_rango = format(
          addDay(
            planVacacion.fecha_inicio_primer_rango,
            planVacacion.dias_primer_rango - 1
          ),
          maskFecha
        )
      }
    }
    const calcularFechaFinSegundoRango = () => {
      if (
        planVacacion.fecha_inicio_segundo_rango &&
        planVacacion.dias_segundo_rango > 0
      ) {
        planVacacion.fecha_fin_segundo_rango = format(
          addDay(
            planVacacion.fecha_inicio_segundo_rango,
            planVacacion.dias_segundo_rango - 1
          ),
          maskFecha
        )
      }
    }

    const calcularFechasRangos = () => {
      calcularFechaFinPrimerRango()
      calcularFechaFinSegundoRango()
    }

    return {
      v$,
      disabled: computed(() => !props.habilitarBotones),
      maskFecha,
      planVacacion,
      mostrarFormularioCrearPlan,
      empleadoStore,

      // listados
      periodos,
      filtrarPeriodos,

      //funciones
      crearPlanVacaciones,
      calcularFechaFin,
      calcularFechaFinPrimerRango,
      calcularFechaFinSegundoRango,
      calcularFechasRangos,
      guardar,
      editar,
      cancelar,
      obtenerPeriodos
    }
  }
})
