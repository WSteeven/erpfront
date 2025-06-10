import { defineComponent, UnwrapRef } from 'vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { DetalleVacacion } from 'recursosHumanos/vacaciones/modules/detallesVacaciones/domain/DetalleVacacion'
import { DetalleVacacionController } from 'recursosHumanos/vacaciones/modules/detallesVacaciones/infraestructura/DetalleVacacionController'
import { required } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { acciones, maskFecha } from 'config/utils'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import dayjs from 'dayjs'
import { DetalleVacacionPropsInterface } from 'recursosHumanos/vacaciones/domain/DetalleVacacionPropsInterface'

export default defineComponent({
  components: { ButtonSubmits },
  props: {
    datos: Object as () => UnwrapRef<DetalleVacacionPropsInterface>
  },
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(
      DetalleVacacion,
      new DetalleVacacionController()
    )
    const { entidad: detalle, accion, disabled } = mixin.useReferencias()
    const { setValidador, guardar, editar } = mixin.useComportamiento()
    const { onGuardado, onModificado } = mixin.useHooks()

    /**********
     * INIT
     **********/
    detalle.vacacion_id = props.datos?.vacacion_id
    if (props.datos?.accion === acciones.editar)
      detalle.hydrate(props.datos.entidad)

    /*************
     * HOOKS
     ************/
    onGuardado((id, response_data) => {
      emit('guardado', { id: id, response: response_data , accion: props.datos?.accion})
      emit('cerrar-modal', false)
    })
    onModificado((id, response_data) => {
      emit('guardado', { id, response: response_data , accion: props.datos?.accion})
      emit('cerrar-modal', false)
    })

    const reglas = {
      fecha_inicio: { required },
      fecha_fin: { required },
      observacion: { required }
    }
    const v$ = useVuelidate(reglas, detalle)
    v$.value = setValidador(v$.value)

    /***************
     * FUNCIONES
     ***************/
    const calcularFechaFin = () => {
      detalle.fecha_fin = detalle.fecha_inicio
      detalle.dias_utilizados = 1
    }
    const calcularDiasUtilizados = () => {
      detalle.dias_utilizados =
        dayjs(detalle.fecha_fin).diff(detalle.fecha_inicio, 'day') + 1
    }
    const cancelar = () => {
      emit('cerrar-modal', false)
    }
    return {
      mixin,
      detalle,
      v$,
      accion,
      disabled,

      //funciones
      guardar,
      editar,
      cancelar,
      maskFecha,
      calcularFechaFin,
      calcularDiasUtilizados
    }
  }
})
