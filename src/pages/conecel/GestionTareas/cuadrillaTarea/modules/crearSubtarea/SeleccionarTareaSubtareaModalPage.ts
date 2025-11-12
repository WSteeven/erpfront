import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Tarea } from 'tareas/domain/Tarea'
import { TareaController } from 'tareas/infraestructure/TareaController'
import ErrorComponent from 'components/ErrorComponent.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import { required } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import {
  isApiError,
  notificarMensajesError,
  obtenerFechaActual
} from 'shared/utils'
import { acciones } from 'config/utils'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { useNotificaciones } from 'shared/notificaciones'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { SubtareaController } from 'subtareas/infraestructure/SubtareaController'
import { modosAsignacionTrabajo } from 'config/tareas.utils'
import { useQuasar } from 'quasar'
import { useNotificacionStore } from 'stores/notificacion'
import { useCargandoStore } from 'stores/cargando'

export default defineComponent({
  components: { ButtonSubmits, NoOptionComponent, ErrorComponent },
  props: {
    datos: Object as () => UnwrapRef<{
      tarea: number
      grupo: number
      grupos: any
    }>
  },
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(Tarea, new TareaController()) // mixin de tareas
    const { listadosAuxiliares, listado } = mixin.useReferencias()
    const { listar, setValidador } = mixin.useComportamiento()
    const { notificarAdvertencia, notificarCorrecto } = useNotificaciones()
    // Stores
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const cargando = new StatusEssentialLoading()
    const aidTareaNumber = props.datos?.tarea
    const grupoId = ref(props.datos?.grupo)
    const grupos = props.datos?.grupos
    const aid = aidTareaNumber?.toString().substring(0, 7)
    const appt_number = aidTareaNumber?.toString().substring(7, 21)
    const request = reactive({
      // valores fijos
      tipo_trabajo: 132,
      modo_asignacion_trabajo: modosAsignacionTrabajo.por_grupo,
      subtarea_dependiente: null,
      // valores dinamicos
      tarea: null,
      grupo: null,
      titulo: ''
    })
    const { tareas, filtrarTareas } =
      useFiltrosListadosSelects(listadosAuxiliares)

    /**********
     * HOOKS
     **********/
    onMounted(() => {
      filtrarTareasConecel()
      request.grupo = grupoId.value == 0 ? null : grupoId.value
      request.titulo = `${obtenerNombreGrupo()} // INSTALACIONES UM CONECEL CLARO // ${obtenerFechaActual()} // AID: ${aid} // ACTIVIDAD: ${appt_number}`
    })

    /****************
     * VALIDACIONES
     ****************/
    const reglas = {
      tarea: { required },
      grupo: { required },
      titulo: { required }
    }
    const v$ = useVuelidate(reglas, request)
    setValidador(v$.value)

    /************
     * FUNCIONES
     ************/
    const obtenerNombreGrupo = () => {
      return grupos.filter((grupo: any) => grupo.id == grupoId.value)[0]?.nombre
    }

    const filtrarTareasConecel = async () => {
      await listar({
        todas: 1,
        cliente_id: 8,
        finalizado: 0
      })
      tareas.value = listado.value
      listadosAuxiliares.tareas = listado.value
    }

    const actualizarNombreGrupo = () => {
      grupoId.value = request.grupo
      request.titulo = `${obtenerNombreGrupo()} // INSTALACIONES UM CONECEL CLARO // ${obtenerFechaActual()} // AID: ${aid} // ACTIVIDAD: ${appt_number}`
    }

    const reestablecer = () => {
      request.tarea = null
      request.grupo = null
      request.titulo = ''
      emit('cerrar-modal')
    }
    const guardarSubtarea = async () => {
      v$.value.$touch()
      if (v$.value.$invalid) {
        notificarAdvertencia('Verifique el formulario')
        return
      }

      try {
        cargando.activar()
        const result = await new SubtareaController().guardar(request)
        if (result.response.status === 200) {
          notificarCorrecto(result.response.data.mensaje)
          emit('cerrar-modal')
        }
      } catch (error) {
        if (isApiError(error)) {
          await notificarMensajesError(
            error.erroresValidacion,
            useNotificaciones()
          )
        }
      } finally {
        cargando.desactivar()
      }
    }
    return {
      v$,
      tareas,
      acciones,
      grupoId,
      filtrarTareas,
      actualizarNombreGrupo,
      guardarSubtarea,
      request,
      grupos,
      reestablecer
    }
  }
})
/**
 // aid=7 longitud
 //appt_number=14 longitud
 // ejmplo
 // 4399200
 // 20004495150473
 **/
