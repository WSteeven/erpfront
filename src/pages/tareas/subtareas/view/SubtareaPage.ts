// Dependencias
import { configuracionColumnasTecnico } from '../domain/configuracionColumnasTecnico'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useSubtareaListadoStore } from 'stores/subtareaListado'
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
import { required } from '@vuelidate/validators'
import { useTareaStore } from 'stores/tarea'
import useVuelidate from '@vuelidate/core'
import useFileList from "components/dropzone/application/fileList"

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import Dropzone from 'components/dropzone/view/DropZone.vue'
import FilePreview from 'components/dropzone/view/FilePreview.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ValidarTecnicosGrupoPrincipal } from '../application/validaciones/ValidarTecnicosGrupoPrincipal'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { TipoTrabajoController } from 'pages/tareas/tiposTareas/infraestructure/TipoTrabajoController'
import { useOrquestadorSelectorTecnicos } from '../application/OrquestadorSelectorTecnico'
import { GrupoController } from 'pages/tareas/grupos/infraestructure/GrupoController'
import { SubtareaController } from '../infraestructure/SubtareaController'
import { Subtarea } from '../domain/Subtarea'
import { Tecnico } from '../domain/Tecnico'

export default defineComponent({
  props: {
    mixin: {
      type: Object as () => ContenedorSimpleMixin<any>,
      required: true,
    },
  },
  components: { EssentialTable, ButtonSubmits, EssentialSelectableTable, FilePreview, Dropzone },
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
    const { entidad: subtarea, listadosAuxiliares } = mixin.useReferencias()
    const { obtenerListados, cargarVista, consultar, guardar, editar, reestablecer, setValidador } = mixin.useComportamiento()
    const { onBeforeGuardar, onBeforeModificar, onConsultado } = mixin.useHooks()

    const { listado } = props.mixin.useReferencias()

    const tareaStore = useTareaStore()
    const subtareaListadoStore = useSubtareaListadoStore()
    const accion = tareaStore.accionSubtarea
    const disable = computed(() => (subtarea.estado !== estadosSubtareas.CREADO && subtarea.estado !== null))

    const tecnicosOtrosGrupos = ref([])
    const tecnicosGrupoPrincipal = ref([])

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

    // Carga de la subtarea
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
      accion: ({ posicion }) => tecnicosGrupoPrincipal.value.splice(posicion, 1),
    }

    const eliminarTecnicoOtroGrupo: CustomActionTable = {
      titulo: 'Quitar',
      icono: 'bi-x',
      color: 'negative',
      visible: () => ([acciones.editar, acciones.nuevo].includes(accion)),
      accion: ({ posicion }) => tecnicosOtrosGrupos.value.splice(posicion, 1),
    }

    function obtenerResponsables(grupo_id: number) {
      if (grupo_id) obtenerTecnicosGrupo(grupo_id)
      else tecnicosGrupoPrincipal.value = []
    }

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
    } = useOrquestadorSelectorTecnicos(tecnicosOtrosGrupos, 'empleados')

    onBeforeGuardar(() => {
      subtarea.tecnicos_grupo_principal = tecnicosGrupoPrincipal.value.map((tecnico: Tecnico) => tecnico.id).toString()
      subtarea.tecnicos_otros_grupos = tecnicosOtrosGrupos.value.map((tecnico: Tecnico) => tecnico.id).toString()
      subtarea.tarea_id = tareaStore.tarea.id
    })

    onBeforeModificar(() => {
      subtarea.tecnicos_grupo_principal = tecnicosGrupoPrincipal.value.map((tecnico: Tecnico) => tecnico.id).toString()
      subtarea.tecnicos_otros_grupos = tecnicosOtrosGrupos.value.map((tecnico: Tecnico) => tecnico.id).toString()
    })

    onConsultado(() => {
      tecnicosGrupoPrincipal.value = subtarea.tecnicos_grupo_principal
      tecnicosOtrosGrupos.value = subtarea.tecnicos_otros_grupos
    })

    async function guardarDatos(subtarea: Subtarea) {
      try {
        await guardar(subtarea, false)

        listado.value = [...listado.value, subtarea]

        emit('cerrar-modal')

      } catch (e) { }
    }

    async function editarDatos(subtarea: Subtarea) {
      try {
        await editar(subtarea, false)

        const indexElemento = subtareaListadoStore.posicionSubtareaSeleccionada

        listado.value.splice(indexElemento, 1, subtarea)
        listado.value = [...listado.value]

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

    const { files, addFiles, removeFile } = useFileList()

    function cargarArchivos(files) {
      console.log(files)
      subtarea.archivos = files
    }

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
      tecnicosGrupoPrincipal,
      tecnicosOtrosGrupos,
      provincias,
      ciudades,
      tiposInstalaciones,
      tiposTareasTelconet,
      tiposTareasNedetel,
      fab: ref(false),
      regiones,
      atenciones,
      listadosAuxiliares,
      filtrarTiposTrabajos,
      tiposTrabajos,
      filtrarSubtareas,
      subtareas,
      filtrarGrupos,
      obtenerResponsables,
      guardarDatos, editarDatos, reestablecerDatos,
      accion,
      disable,
      configuracionColumnasTecnico,
      // orquestador
      refListadoSeleccionableTecnicos,
      criterioBusquedaTecnico,
      listadoTecnicos,
      listarTecnicos,
      limpiarTecnico,
      seleccionarTecnico,
      // ---
      files, addFiles, removeFile,
      cargarArchivos,
    }
  },
})
