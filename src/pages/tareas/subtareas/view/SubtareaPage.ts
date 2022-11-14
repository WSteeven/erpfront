// Dependencias
import { configuracionColumnasTecnico } from '../domain/configuracionColumnasTecnico'
import { computed, defineComponent, ref, watchEffect } from 'vue'
import {
  provincias,
  ciudades,
  tiposInstalaciones,
  tiposTareasTelconet,
  tiposTareasNedetel,
  regiones,
  atenciones,
  tiposIntervenciones,
  causaIntervencion,
} from 'config/utils'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { TipoTareaController } from 'pages/tareas/tiposTareas/infraestructure/TipoTareaController'
import { useOrquestadorSelectorTecnicos } from '../application/OrquestadorSelectorTecnico'
import { GrupoController } from 'pages/tareas/grupos/infraestructure/GrupoController'
import { SubtareaController } from '../infraestructure/SubtareaController'
import { Subtarea } from '../domain/Subtarea'
import { useTareaStore } from 'stores/tarea'
import { Tecnico } from '../domain/Tecnico'

export default defineComponent({
  components: { EssentialTable, ButtonSubmits },
  setup() {
    const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
    const { entidad: subtarea, listadosAuxiliares } = mixin.useReferencias()
    const { obtenerListados, cargarVista, guardar, editar, reestablecer, setValidador } = mixin.useComportamiento()
    const { onBeforeGuardar, onBeforeModificar } = mixin.useHooks()

    const tareaStore = useTareaStore()
    const accion = tareaStore.accionSubtarea

    cargarVista(async () => {
      await obtenerListados({
        tiposTrabajos: {
          controller: new TipoTareaController(),
          params: { cliente: tareaStore.tarea.cliente }
        },
        subtareas: {
          controller: new SubtareaController(),
          params: { tarea_id: tareaStore.tarea.id }
        },
        grupos: new GrupoController(),
      })

      grupos.value = listadosAuxiliares.grupos
      tiposTrabajos.value = listadosAuxiliares.tiposTrabajos
      subtareas.value = listadosAuxiliares.subtareas
      subtarea.hydrate(tareaStore.subtarea)
    })

    const busqueda = ref()
    const tecnicoSeleccionado = ref()

    const seleccionBusqueda = ref('por_tecnico')

    const columnas = [
      ...configuracionColumnasTecnico,
      {
        name: 'observacion',
        field: 'observacion',
        label: 'Observación',
        align: 'left',
        sortable: true,
      },
      {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'center',
      },
    ]

    function eliminarTecnico({ posicion }) {
      tecnicosGrupoPrincipal.value.splice(posicion, 1)
    }

    const causasIntervencion = computed(() => causaIntervencion.filter((causa: any) => causa.categoria === subtarea.tipo_intervencion))

    function obtenerResponsables(grupo_id: number) {
      obtenerTecnicoResponsable(grupo_id)
      obtenerTecnicosGrupo(grupo_id)
    }

    async function obtenerTecnicoResponsable(grupo_id: number) {
      // Obtener grupo
      const grupoController = new GrupoController()
      const { result } = await grupoController.consultar(grupo_id)
      const responsable = result.empleado_id

      const empleadoController = new EmpleadoController()
      const { result: tecnicoResponsable } = await empleadoController.consultar(responsable)

      subtarea.tecnico_responsable = tecnicoResponsable.nombres + ' ' + tecnicoResponsable.apellidos
    }

    const tecnicosGrupoPrincipal = ref()
    const tecnicosTemporales = ref()

    async function obtenerTecnicosGrupo(grupo_id: number) {
      const empleadoController = new EmpleadoController()
      const { result } = await empleadoController.listar({ grupo_id: grupo_id })
      tecnicosGrupoPrincipal.value = result
    }

    // Filtro tipos de trabajos
    const tiposTrabajos = ref([])
    function filtrarTiposTrabajos(val, update) {
      if (val === '') {
        update(() => {
          tiposTrabajos.value = listadosAuxiliares.tiposTrabajos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tiposTrabajos.value = listadosAuxiliares.tiposTrabajos.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // Filtros subtareas
    const subtareas = ref([])
    function filtrarSubtareas(val, update) {
      if (val === '') {
        update(() => {
          subtareas.value = listadosAuxiliares.subtareas
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        subtareas.value = listadosAuxiliares.subtareas.filter(
          (v) => v.codigo_subtarea.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // Filtros grupos
    const grupos = ref([])
    function filtrarGrupos(val, update) {
      if (val === '') {
        update(() => {
          grupos.value = listadosAuxiliares.grupos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        grupos.value = listadosAuxiliares.grupos.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    const {
      refListadoSeleccionable: refListadoSeleccionableTecnicos,
      criterioBusqueda: criterioBusquedaTecnico,
      listado: listadoTecnicos,
      listar: listarTecnicos,
      limpiar: limpiarTecnico,
      seleccionar: seleccionarTecnico
    } = useOrquestadorSelectorTecnicos(subtarea, 'empleados')

    const rules = {
      detalle: { required },
      grupo: { required },
      tipo_trabajo: { required },
    }

    const v$ = useVuelidate(rules, subtarea)
    setValidador(v$.value)

    onBeforeGuardar(() => {
      subtarea.tecnicos_grupo_principal = tecnicosGrupoPrincipal.value.map((tecnico: Tecnico) => tecnico.id).toString() //"[2, 3]"
    })

    onBeforeModificar(() => {
      subtarea.tecnicos_grupo_principal = tecnicosGrupoPrincipal.value.map((tecnico: Tecnico) => tecnico.id).toString() //"[2, 3]"
    })

    // onReestablecer(() => tecnicosGrupoPrincipal.value = [])

    watchEffect(() => {
      if (subtarea.grupo)
        obtenerResponsables(subtarea.grupo)
      else {
        subtarea.tecnico_responsable = null
        tecnicosGrupoPrincipal.value = null
      }
    })

    return {
      v$,
      subtarea,
      seleccionBusqueda,
      columnas,
      tecnicoSeleccionado,
      busqueda,
      grupos,
      eliminarTecnico,
      //modalesSubtarea,
      provincias,
      ciudades,
      tiposInstalaciones,
      tiposTareasTelconet,
      tiposTareasNedetel,
      fab: ref(false),
      regiones,
      atenciones,
      tiposIntervenciones,
      causasIntervencion,
      listadosAuxiliares,
      filtrarTiposTrabajos,
      tiposTrabajos,
      filtrarSubtareas,
      subtareas,
      filtrarGrupos,
      obtenerResponsables,
      guardar, editar, reestablecer,
      accion,
      tecnicosGrupoPrincipal,
      tecnicosTemporales,
      // orquestador
      refListadoSeleccionableTecnicos,
      criterioBusquedaTecnico,
      listadoTecnicos,
      listarTecnicos,
      limpiarTecnico,
      seleccionarTecnico,
    }
  },
})
