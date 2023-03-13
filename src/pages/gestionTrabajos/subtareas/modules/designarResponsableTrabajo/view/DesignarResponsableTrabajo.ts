import { configuracionColumnasEmpleadoGrupo } from 'gestionTrabajos/subtareas/domain/configuracionColumnasEmpleadoGrupo'
import { useFiltrosListadosTarea } from 'pages/gestionTrabajos/tareas/application/FiltrosListadosTarea'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { computed, defineComponent, onMounted, Ref, ref, UnwrapRef, watchEffect } from 'vue'
import { modosAsignacionTrabajo } from 'config/tareas.utils'
import { requiredIf } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { accionesTabla } from 'config/utils'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SubtareaController } from 'pages/gestionTrabajos/subtareas/infraestructure/SubtareaController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { GrupoController } from 'pages/recursosHumanos/grupos/infraestructure/GrupoController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { useBotonesTablaDesignacionTrabajo } from 'pages/gestionTrabajos/subtareas/application/BotonesTablaDesignacionTrabajo'
import { useOrquestadorSelectorEmpleadosGrupo } from 'pages/gestionTrabajos/subtareas/application/useOrquestadorSelectorEmpleadosGrupo'

export default defineComponent({
  components: {
    EssentialTable,
    EssentialSelectableTable,
  },
  emits: ['seleccionar-grupo', 'seleccionar-empleado'],
  props: {
    disable: Boolean,
    accion: String,
    v$: Object,
    subtarea: {
      type: Object as () => UnwrapRef<Subtarea>,
      default: null,
    },
    /* empleado: {
      type: Number,
      default: null,
    },
    modo_asignacion_trabajo: {
      type: String,
      required: true,
    } */
  },
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
    const { cargarVista, obtenerListados } = mixin.useComportamiento()
    const { entidad: subtarea, listadosAuxiliares } = mixin.useReferencias()

    watchEffect(() => {
      if (props.subtarea) {
        subtarea.hydrate(props.subtarea)
      }
    })

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
    const empleadosSeleccionados: Ref<Empleado[]> = ref([])
    const tipoSeleccion = computed(() => asignarLider.value || asignarSecretario.value ? 'single' : 'none')

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
    } = useFiltrosListadosTarea(listadosAuxiliares)

    /************
    * Observers
    ************/
    watchEffect(() => {
      if (subtarea.grupo) {
        obtenerTecnicosGrupo(subtarea.grupo)
        emit('seleccionar-grupo', subtarea.grupo)
      } else if (subtarea.empleado) {
        emit('seleccionar-empleado', subtarea.empleado)
      }
    })

    async function obtenerTecnicosGrupo(grupo_id: number) {
      const empleadoController = new EmpleadoController()
      const { result } = await empleadoController.listar({ grupo_id: grupo_id })
      empleadosSeleccionados.value = result
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
      quitarEmpleado,
      entidadSeleccionada,
      cancelarDesignacion,
      designarLider,
      designarLiderDefinitivo,
      designarSecretario,
      designarSecretarioDefinitivo,
      asignarLider,
      asignarSecretario,
    } = useBotonesTablaDesignacionTrabajo(empleadosSeleccionados, data)

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
    } = useOrquestadorSelectorEmpleadosGrupo(empleadosSeleccionados, 'empleados')

    return {
      validate$,
      subtarea,
      modosAsignacionTrabajo,
      columnasEmpleado: [...configuracionColumnasEmpleadoGrupo, accionesTabla],
      configuracionColumnasEmpleadoGrupo,
      empleadosSeleccionados,
      grupos,
      filtrarGrupos,
      empleados,
      filtrarEmpleados,
      tipoSeleccion,
      refEmpleadosGrupo,
      empleadoGrupoQuitar,
      quitarEmpleado,
      entidadSeleccionada,
      cancelarDesignacion,
      designarLider,
      designarLiderDefinitivo,
      designarSecretario,
      designarSecretarioDefinitivo,
      asignarLider,
      asignarSecretario,
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
