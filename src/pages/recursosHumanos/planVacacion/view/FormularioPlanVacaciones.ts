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
      required: true
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
    const { entidad: planVacacion, accion } = mixin.useReferencias()
    const { setValidador, guardar, editar } = mixin.useComportamiento()
    const { onGuardado, onModificado } = mixin.useHooks()
    const { notificarAdvertencia } = useNotificaciones()

    const mostrarFormularioCrearPlan = ref(false)

    /************
     * INIT
     ************/
    console.log(props)
    if (props.accion == acciones.editar) planVacacion.hydrate(props.plan)
    planVacacion.empleado = props.empleado
    planVacacion.periodo = props.periodo

    /*************
     * HOOKS
     ************/
    onGuardado(() => {
      emit('guardado', accion)
    })
    onModificado(() => {
      emit('guardado', accion)
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
      }
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

      //funciones
      crearPlanVacaciones,
      calcularFechaFin,
      calcularFechaFinPrimerRango,
      calcularFechaFinSegundoRango,
      calcularFechasRangos,
      guardar,
      editar,
      cancelar
    }
  }
})
