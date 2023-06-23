import { configuracionColumnasEmpleadoGrupo } from 'gestionTrabajos/subtareas/domain/configuracionColumnasEmpleadoGrupo'
import { useFiltrosListadosTarea } from 'pages/gestionTrabajos/tareas/application/FiltrosListadosTarea'
import { computed, defineComponent, onMounted, Ref, ref, UnwrapRef, watch, watchEffect } from 'vue'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { modosAsignacionTrabajo } from 'config/tareas.utils'
import { requiredIf } from 'shared/i18n-validators'
import { acciones, accionesTabla, rolesSistema } from 'config/utils'
import useVuelidate from '@vuelidate/core'

// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { useOrquestadorSelectorEmpleadosGrupo } from 'pages/gestionTrabajos/subtareas/application/useOrquestadorSelectorEmpleadosGrupo'
import { useBotonesTablaDesignacionSubtarea } from 'pages/gestionTrabajos/subtareas/application/BotonesTablaDesignacionSubtarea'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SubtareaController } from 'pages/gestionTrabajos/subtareas/infraestructure/SubtareaController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { GrupoController } from 'pages/recursosHumanos/grupos/infraestructure/GrupoController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { extraerRol, isAxiosError, notificarMensajesError } from 'shared/utils'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { EmpleadoGrupo } from 'pages/gestionTrabajos/subtareas/domain/EmpleadoGrupo'

export default defineComponent({
  components: {
    EssentialTable,
    EssentialSelectableTable,
  },
  emits: ['seleccionar-grupo', 'seleccionar-empleado', 'actualizar-empleados', 'seleccionar-modo-designacion', 'seleccionar-responsable'],
  props: {
    disable: Boolean,
    accion: String,
    v$: Object,
    subtareaInicial: {
      type: Object as () => UnwrapRef<Subtarea>,
      default: null,
    },
  },
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
    const { cargarVista, obtenerListados } = mixin.useComportamiento()
    const { entidad: subtarea, listadosAuxiliares } = mixin.useReferencias()

    cargarVista(async () => {
      await obtenerListados({
        grupos: {
          controller: new GrupoController(),
          params: { campos: 'id,nombre' }
        },
        empleados: new EmpleadoController(),
      })

      grupos.value = listadosAuxiliares.grupos
      empleados.value = listadosAuxiliares.empleados
    })

    /************
     * Variables
    ************/
    const tipoSeleccion = computed(() => cambiarResponsable.value ? 'single' : 'none')
    const notificaciones = useNotificaciones()
    const empleadosGrupo: Ref<Empleado[]> = ref([])
    const cargando = new StatusEssentialLoading()

    /*************
    * Validaciones
    **************/
    const rules = {
      grupo: { required: requiredIf(() => subtarea.modo_asignacion_trabajo === modosAsignacionTrabajo.por_grupo) },
      empleado: { required: requiredIf(() => subtarea.modo_asignacion_trabajo === modosAsignacionTrabajo.por_empleado) },
    }

    const validate$ = props.v$ ?? useVuelidate(rules, subtarea)

    const {
      grupos,
      filtrarGrupos,
      empleados,
      filtrarEmpleados,
    } = useFiltrosListadosTarea(listadosAuxiliares, subtarea)

    /**********
     * Botones
     **********/
    const data = computed(() => {
      return {
        accion: props.accion,
        modo_asignacion_trabajo: subtarea.modo_asignacion_trabajo,
        grupo: computed(() => subtarea.grupo),
      }
    })

    const {
      refEmpleadosGrupo,
      empleadoGrupoQuitar,
      entidadSeleccionadaResponsable,
      quitarEmpleado,
      cambiarResponsable,
      btnCambiarResponsable,
      btnConfirmarDesignarResponsable,
      btnCancelarDesignacionResponsable,
      setEmit
    } = useBotonesTablaDesignacionSubtarea(empleadosGrupo, data)
    setEmit(emit)

    /*****************
     * Orquestadores
     *****************/
    const {
      refListadoSeleccionable: refListadoSeleccionableEmpleadosGrupo,
      criterioBusqueda: criterioBusquedaEmpleadosGrupo,
      listado: listadoEmpleadosGrupo,
      listar: listarEmpleadosGrupo,
      limpiar: limpiarEmlpeadosGrupo,
      seleccionar: seleccionarEmpleadosGrupo,
    } = useOrquestadorSelectorEmpleadosGrupo(empleadosGrupo, 'empleados')

    /************
     * Observers
     ************/
    watchEffect(() => {
      subtarea.modo_asignacion_trabajo = props.subtareaInicial.modo_asignacion_trabajo
      subtarea.grupo = props.subtareaInicial.grupo
      subtarea.empleado = props.subtareaInicial.empleado
    })

    watch(empleadosGrupo, () => emit('actualizar-empleados', empleadosGrupo.value))

    watchEffect(() => {
      empleadosGrupo.value = props.subtareaInicial.empleados_designados
    })

    /************
     * Funciones
     ************/
    async function seleccionarGrupo() {
      if (subtarea.grupo) {
        await obtenerTecnicosGrupo(subtarea.grupo)
        const lider = encontrarLiderGrupo()
        if (lider) emit('seleccionar-responsable', lider.id)
        return emit('seleccionar-grupo', subtarea.grupo)
      }
    }

    function seleccionarEmpleado() {
      return emit('seleccionar-empleado', subtarea.empleado)
    }

    function limpiarSelector() {
      subtarea.empleado = null
      subtarea.grupo = null
      empleadosGrupo.value = []
      return emit('seleccionar-modo-designacion', subtarea.modo_asignacion_trabajo)
    }

    function encontrarLiderGrupo() {
      return empleadosGrupo.value.find((empleado: EmpleadoGrupo) => empleado.es_responsable)
    }

    async function obtenerTecnicosGrupo(grupo_id: number) {

      try {
        cargando.activar()
        const empleadoController = new EmpleadoController()
        const { result } = await empleadoController.listar({ grupo_id: grupo_id })
        empleadosGrupo.value = mapearResponsable(result)
      } catch (error) {
        if (isAxiosError(error)) {
          const mensajes: string[] = error.erroresValidacion
          await notificarMensajesError(mensajes, notificaciones)
        }
      } finally {
        cargando.desactivar()
      }
    }

    function mapearResponsable(empleados: Empleado[]) {
      return empleados.map((empleado) => {
        const empleadoGrupo = new EmpleadoGrupo()
        empleadoGrupo.hydrate(empleado)
        empleadoGrupo.es_responsable = typeof empleado.roles === 'string' ? extraerRol(empleado.roles.split(','), rolesSistema.tecnico_lider) : false
        return empleadoGrupo
      })
    }

    return {
      seleccionarGrupo,
      seleccionarEmpleado,
      limpiarSelector,
      validate$,
      subtarea,
      modosAsignacionTrabajo,
      columnasEmpleado: [...configuracionColumnasEmpleadoGrupo, accionesTabla],
      configuracionColumnasEmpleadoGrupo,
      empleadosGrupo,
      // empleadosAdicionales,
      grupos,
      filtrarGrupos,
      empleados,
      filtrarEmpleados,
      tipoSeleccion,
      refEmpleadosGrupo,
      empleadoGrupoQuitar,
      entidadSeleccionadaResponsable,
      // quitarEmpleadoAdicional,
      quitarEmpleado,
      btnCambiarResponsable,
      btnConfirmarDesignarResponsable,
      btnCancelarDesignacionResponsable,
      // Orquesatdor
      refListadoSeleccionableEmpleadosGrupo,
      criterioBusquedaEmpleadosGrupo,
      listadoEmpleadosGrupo,
      listarEmpleadosGrupo,
      limpiarEmlpeadosGrupo,
      seleccionarEmpleadosGrupo,
    }
  }
})
