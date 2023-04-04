import { configuracionColumnasEmpleadoGrupo } from 'gestionTrabajos/subtareas/domain/configuracionColumnasEmpleadoGrupo'
import { useFiltrosListadosTarea } from 'pages/gestionTrabajos/tareas/application/FiltrosListadosTarea'
import { computed, defineComponent, Ref, ref, UnwrapRef, watch, watchEffect } from 'vue'
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
  emits: ['seleccionar-grupo', 'seleccionar-empleado', 'actualizar-empleados'],
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

    const empleadosGrupo: Ref<Empleado[]> = ref([])
    watchEffect(() => {
      /* if (props.subtareaInicial) {
        subtarea.hydrate(props.subtareaInicial)
      } */
      subtarea.modo_asignacion_trabajo = props.subtareaInicial.modo_asignacion_trabajo
      subtarea.grupo = props.subtareaInicial.grupo
      subtarea.empleado = props.subtareaInicial.empleado
    })
    /* subtarea.modo_asignacion_trabajo = props.subtareaInicial.modo_asignacion_trabajo
    subtarea.grupo = props.subtareaInicial.grupo
    subtarea.empleado = props.subtareaInicial.empleado */

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
    // const empleadosAdicionales: Ref<Empleado[]> = ref([])
    /* const empleadosTodos = computed({
      get() {
        return [...empleadosSeleccionados.value, ...empleadosAdicionales.value]
      },
      set(newValue) {
        empleadosSeleccionados.value = newValue
      }
    }) */

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

    /************
    * Observers
    ************/
    let grupoConsultado: number

    watchEffect(() => {
      if (props.accion === acciones.nuevo) {
        if (subtarea.grupo) {
          grupoConsultado = subtarea.grupo
          obtenerTecnicosGrupo(subtarea.grupo)
          emit('seleccionar-grupo', subtarea.grupo)
        } else if (subtarea.empleado) {
          emit('seleccionar-empleado', subtarea.empleado)
        }
      }

      /*if (props.accion === acciones.consultar) {
        if (subtarea.grupo) {
          console.log(props.subtareaInicial.empleados_designados)
          empleadosGrupo.value = mapearResponsable(props.subtareaInicial.empleados_designados)
        }
      } */
    })

    async function obtenerTecnicosGrupo(grupo_id: number) {
      const cargando = new StatusEssentialLoading()

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
        console.log(empleado.roles)
        empleadoGrupo.es_responsable = typeof empleado.roles === 'string' ? extraerRol(empleado.roles.split(','), rolesSistema.tecnico_lider) : false
        // empleadoGrupo.roles = typeof empleado.roles === 'object' ? empleado.roles.join(',') : ''
        return empleadoGrupo
      })
    }

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
    } = useBotonesTablaDesignacionSubtarea(empleadosGrupo, data)

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

    // empleados_adicinoales
    //watchEffect(() => emit('actualizar-empleados', [...empleadosGrupo.value, ...empleadosAdicionales.value]))
    watch(empleadosGrupo, () => emit('actualizar-empleados', empleadosGrupo.value))

    /************
     * Funciones
     ************/
    /* const quitarEmpleadoAdicional: CustomActionTable = {
      titulo: 'Quitar',
      icono: 'bi-x',
      color: 'negative',
      visible: () => [acciones.editar, acciones.nuevo].includes(props.accion + ""),
      accion: ({ posicion }) => {
        empleadosAdicionales.value.splice(posicion, 1)
      },
    } */

    return {
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
