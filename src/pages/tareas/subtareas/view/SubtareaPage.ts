// Dependencias
import { configuracionColumnasTecnico } from '../domain/configuracionColumnasTecnico'
import { computed, defineComponent, ref } from 'vue'
import {
  provincias,
  ciudades,
  tiposInstalaciones,
  tiposTareasTelconet,
  tiposTareasNedetel,
  regiones,
  atenciones,
  estadosSubtareas,
  rolesAdmitidos,
  acciones,
} from 'config/utils'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ValidarTecnicosGrupoPrincipal } from '../application/validaciones/ValidarTecnicosGrupoPrincipal'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useOrquestadorSelectorTecnicos } from '../application/OrquestadorSelectorTecnico'
import { GrupoController } from 'pages/tareas/grupos/infraestructure/GrupoController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { SubtareaController } from '../infraestructure/SubtareaController'
import { useSubtareaListadoStore } from 'stores/subtareaListado'
import { Subtarea } from '../domain/Subtarea'
import { useTareaStore } from 'stores/tarea'
import { Tecnico } from '../domain/Tecnico'
import { TipoTrabajoController } from 'pages/tareas/tiposTareas/infraestructure/TipoTrabajoController'

export default defineComponent({
  components: { EssentialTable, ButtonSubmits, EssentialSelectableTable },
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
    const { entidad: subtarea, listadosAuxiliares } = mixin.useReferencias()
    const { obtenerListados, cargarVista, consultar, guardar, editar, reestablecer, setValidador } = mixin.useComportamiento()
    const { onBeforeGuardar, onBeforeModificar } = mixin.useHooks()

    const tareaStore = useTareaStore()
    const subtareaListadoStore = useSubtareaListadoStore()
    const accion = tareaStore.accionSubtarea
    const disable = computed(() => (subtarea.estado !== estadosSubtareas.CREADO && subtarea.estado !== null))

    cargarVista(async () => {
      await obtenerListados({
        tiposTrabajos: {
          controller: new TipoTrabajoController(),
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
    })

    if (subtareaListadoStore.idSubtareaSeleccionada) consultar({ id: subtareaListadoStore.idSubtareaSeleccionada })

    const busqueda = ref()
    const tecnicoSeleccionado = ref()

    const seleccionBusqueda = ref('por_tecnico')

    const columnas = [
      ...configuracionColumnasTecnico,
      {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'center',
      },
    ]

    const eliminarTecnico: CustomActionTable = {
      titulo: 'Quitar',
      icono: 'bi-x',
      color: 'negative',
      visible: ({ entidad }) => entidad.roles !== rolesAdmitidos.tecnico_lider && ([acciones.editar, acciones.nuevo].includes(accion)),
      accion: ({ posicion }) => subtarea.tecnicos_grupo_principal.splice(posicion, 1),
    }

    const eliminarTecnicoOtroGrupo: CustomActionTable = {
      titulo: 'Quitar',
      icono: 'bi-x',
      color: 'negative',
      visible: () => ([acciones.editar, acciones.nuevo].includes(accion)),
      accion: ({ posicion }) => subtarea.tecnicos_otros_grupos.splice(posicion, 1),
    }

    // const causasIntervencion = computed(() => causaIntervencion.filter((causa: any) => causa.categoria === subtarea.tipo_intervencion))

    function obtenerResponsables(grupo_id: number) {
      if (grupo_id) obtenerTecnicosGrupo(grupo_id)
      else subtarea.tecnicos_grupo_principal = []
    }

    async function obtenerTecnicosGrupo(grupo_id: number) {
      const empleadoController = new EmpleadoController()
      const { result } = await empleadoController.listar({ grupo_id: grupo_id })
      subtarea.tecnicos_grupo_principal = result
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

    onBeforeGuardar(() => {
      subtarea.tecnicos_grupo_principal = subtarea.tecnicos_grupo_principal.map((tecnico: Tecnico) => tecnico.id).toString()
      subtarea.tecnicos_otros_grupos = subtarea.tecnicos_otros_grupos.map((tecnico: Tecnico) => tecnico.id).toString()
      subtarea.tarea_id = tareaStore.tarea.id
    })

    onBeforeModificar(() => {
      subtarea.tecnicos_grupo_principal = subtarea.tecnicos_grupo_principal.map((tecnico: Tecnico) => tecnico.id).toString()
      subtarea.tecnicos_otros_grupos = subtarea.tecnicos_otros_grupos.map((tecnico: Tecnico) => tecnico.id).toString()
    })

    async function guardarDatos(subtarea: Subtarea) {
      try {
        await guardar(subtarea)
        emit('cerrar-modal')
        subtareaListadoStore.nuevoElementoInsertado = true
      } catch (e) { }
    }

    async function editarDatos(subtarea: Subtarea) {
      try {
        await editar(subtarea)
        emit('cerrar-modal')
      } catch (e) { }
    }

    function reestablecerDatos() {
      reestablecer()
      emit('cerrar-modal')
    }

    // Validaciones simples
    const rules = {
      detalle: { required },
      grupo: { required },
      tipo_trabajo: { required },
    }

    const v$ = useVuelidate(rules, subtarea)
    setValidador(v$.value)

    // Validaciones completas
    const validarTecnicosGrupoPrincipal = new ValidarTecnicosGrupoPrincipal(subtarea)

    mixin.agregarValidaciones(
      validarTecnicosGrupoPrincipal
    )

    return {
      v$,
      subtarea,
      seleccionBusqueda,
      columnas,
      tecnicoSeleccionado,
      busqueda,
      grupos,
      eliminarTecnico,
      eliminarTecnicoOtroGrupo,
      //modalesSubtarea,
      provincias,
      ciudades,
      tiposInstalaciones,
      tiposTareasTelconet,
      tiposTareasNedetel,
      fab: ref(false),
      regiones,
      atenciones,
      /*tiposIntervenciones,
      causasIntervencion,*/
      listadosAuxiliares,
      filtrarTiposTrabajos,
      tiposTrabajos,
      filtrarSubtareas,
      subtareas,
      filtrarGrupos,
      obtenerResponsables,
      guardarDatos, editarDatos, reestablecerDatos,
      accion,
      // tecnicosGrupoPrincipal,
      // tecnicosTemporales,
      disable,
      configuracionColumnasTecnico,
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
