// Dependencias
import { isAxiosError, notificarMensajesError, quitarItemDeArray, stringToArray } from 'shared/utils'
import { configuracionColumnasTecnico } from '../domain/configuracionColumnasTecnico'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useSubtareaListadoStore } from 'stores/subtareaListado'
import { computed, defineComponent, Ref, ref, watch } from 'vue'
import {
  tiposInstalaciones,
  tiposTareasTelconet,
  tiposTareasNedetel,
  regiones,
  atenciones,
  estadosSubtareas,
  rolesAdmitidos,
  acciones,
  opcionesModoAsignacionTrabajo,
  tiposIntervenciones,
  causaIntervencion,
} from 'config/utils'
import useFileList from "components/dropzone/application/fileList"
import { required, requiredIf } from '@vuelidate/validators'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { useTareaStore } from 'stores/tarea'
import useVuelidate from '@vuelidate/core'
import { useQuasar } from 'quasar'

// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import FilePreview from 'components/dropzone/view/FilePreview.vue'
import Dropzone from 'components/dropzone/view/DropZone.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ValidarTecnicosGrupoPrincipal } from '../application/validaciones/ValidarTecnicosGrupoPrincipal'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { TipoTrabajoController } from 'pages/tareas/tiposTareas/infraestructure/TipoTrabajoController'
import { CambiarJefeCuadrillaController } from '../infraestructure/CambiarJefeCuadrillaController'
import { CambiarSecretarioController } from '../infraestructure/CambiarSecretarioController'
import { useOrquestadorSelectorTecnicos } from '../application/OrquestadorSelectorTecnico'
import { GrupoController } from 'pages/tareas/grupos/infraestructure/GrupoController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { SubtareaController } from '../infraestructure/SubtareaController'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Subtarea } from '../domain/Subtarea'

export default defineComponent({
  props: {
    mixinModal: {
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

    const { listado } = props.mixinModal.useReferencias()

    const tareaStore = useTareaStore()
    const subtareaListadoStore = useSubtareaListadoStore()
    const accion = tareaStore.accionSubtarea
    const disable = computed(() => (subtarea.estado !== estadosSubtareas.CREADO && subtarea.estado !== null))

    const asignarJefe = ref(false)
    const asignarSecretario = ref(false)
    const tipoSeleccion = computed(() => asignarJefe.value || asignarSecretario.value ? 'single' : 'none')

    const refEmpleadosAsignados = ref() // Tabla
    const empleadoSeleccionadoAsignacionQuitar = ref()

    const tecnicosGrupoPrincipal: Ref<Empleado[]> = ref([])

    const notificacionStore = useNotificacionStore()
    notificacionStore.setQuasar(useQuasar())

    const notificaciones = useNotificaciones()

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
        grupos: {
          controller: new GrupoController(),
          params: { campos: 'id,nombre' }
        }
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

    function esLider(entidad) {
      return (entidad.roles).replaceAll(', ', ',').split(',').includes(rolesAdmitidos.tecnico_lider)
    }

    function esSecretario(entidad) {
      return (entidad.roles).replaceAll(', ', ',').split(',').includes(rolesAdmitidos.tecnico_secretario)
    }

    const eliminarTecnico: CustomActionTable = {
      titulo: 'Quitar',
      icono: 'bi-x',
      color: 'negative',
      visible: () => [acciones.editar, acciones.nuevo].includes(accion) && !(asignarJefe.value || asignarSecretario.value),
      accion: ({ entidad, posicion }) => {
        if (esLider(entidad)) {
          asignarJefe.value = true
          asignarSecretario.value = false
          empleadoSeleccionadoAsignacionQuitar.value = entidad
          return notificaciones.notificarAdvertencia('Debes asignar a un reemplazo para el jefe de cuadrilla seleccionado!')
        }
        if (esSecretario(entidad)) {
          asignarJefe.value = false
          asignarSecretario.value = true
          empleadoSeleccionadoAsignacionQuitar.value = entidad
          return notificaciones.notificarAdvertencia('Debes asignar a un reemplazo para el secretario de cuadrilla seleccionado')
        }

        tecnicosGrupoPrincipal.value.splice(posicion, 1)
      },
    }

    const asignarNuevoTecnicoLider: CustomActionTable = {
      titulo: 'Designar como nuevo jefe de cuadrilla',
      icono: 'bi-arrow-left-right',
      color: 'positive',
      visible: () => asignarJefe.value,
      accion: async ({ entidad }) => {
        refEmpleadosAsignados.value.seleccionar()
      },
    }

    const designarNuevoSecretario: CustomActionTable = {
      titulo: 'Designar como nuevo secretario de cuadrilla',
      icono: 'bi-arrow-left-right',
      color: 'positive',
      visible: () => asignarSecretario.value,
      accion: () => refEmpleadosAsignados.value.seleccionar()
    }

    const cancelarDesignacion: CustomActionTable = {
      titulo: 'Cancelar',
      icono: 'bi-x',
      color: 'negative',
      visible: () => asignarJefe.value || asignarSecretario.value,
      accion: () => {
        asignarJefe.value = false
        asignarSecretario.value = false
      },
    }

    async function entidadSeleccionada(itemsSeleccionados: EntidadAuditable[]) {
      if (itemsSeleccionados.length) {
        const id = itemsSeleccionados[0].id

        try {
          // Jefe de cuadrilla --
          if (asignarJefe.value) {
            await new CambiarJefeCuadrillaController().guardar({ grupo: subtarea.grupo, nuevo_jefe: id })
            asignarJefe.value = false

            // Quitar rol tabla Jefe cuadrilla
            const roles = stringToArray(empleadoSeleccionadoAsignacionQuitar.value.roles)
            empleadoSeleccionadoAsignacionQuitar.value.roles = quitarItemDeArray(roles, rolesAdmitidos.tecnico_lider).join(',')

            // Designar rol tabla Secretario cuadrilla
            const posicion: any = tecnicosGrupoPrincipal.value.findIndex((empleado: Empleado) => empleado.id === id)
            const entidad: Empleado = tecnicosGrupoPrincipal.value[posicion]
            entidad.roles = entidad.roles + ', ' + rolesAdmitidos.tecnico_lider
            tecnicosGrupoPrincipal.value.splice(posicion, 1, entidad)

            notificaciones.notificarCorrecto('Asignado como jefe de cuadrilla')
          }

          // Secretario de cuadrilla --
          if (asignarSecretario.value) {
            await new CambiarSecretarioController().guardar({ grupo: subtarea.grupo, nuevo_jefe: id })
            asignarSecretario.value = false

            // Quitar rol secretario cuadrilla
            const roles = stringToArray(empleadoSeleccionadoAsignacionQuitar.value.roles)
            empleadoSeleccionadoAsignacionQuitar.value.roles = quitarItemDeArray(roles, rolesAdmitidos.tecnico_secretario).join(',')

            // Designar rol tabla Secretario cuadrilla
            const posicion: any = tecnicosGrupoPrincipal.value.findIndex((empleado: Empleado) => empleado.id === id)
            const entidad: Empleado = tecnicosGrupoPrincipal.value[posicion]
            entidad.roles = entidad.roles + ', ' + rolesAdmitidos.tecnico_secretario
            tecnicosGrupoPrincipal.value.splice(posicion, 1, entidad)

            notificaciones.notificarCorrecto('Asignado como secretario de cuadrilla')
          }
        } catch (e) {
          if (isAxiosError(e)) {
            const mensajes: string[] = e.erroresValidacion
            notificarMensajesError(mensajes, notificaciones)
          }
        }
      }
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
    } = useOrquestadorSelectorTecnicos(tecnicosGrupoPrincipal, 'empleados')

    onBeforeGuardar(() => {
      subtarea.tecnicos_grupo_principal = validarString(tecnicosGrupoPrincipal.value.map((tecnico: Empleado) => tecnico.id).toString())
      subtarea.tarea_id = tareaStore.tarea.id
    })

    onBeforeModificar(() => {
      subtarea.tecnicos_grupo_principal = validarString(tecnicosGrupoPrincipal.value.map((tecnico: Empleado) => tecnico.id).toString())

    })

    onConsultado(() => {
      tecnicosGrupoPrincipal.value = subtarea.tecnicos_grupo_principal
    })

    function validarString(listado: string) {
      return listado !== '' ? listado : null
    }

    async function guardarDatos(subtarea: Subtarea) {
      try {
        await guardar(subtarea, false)

        listado.value = [subtarea, ...listado.value]

        emit('cerrar-modal')

      } catch (e) { }
    }

    async function editarDatos(subtarea: Subtarea) {
      try {
        await editar(subtarea, false)

        const indexElemento = subtareaListadoStore.posicionSubtareaSeleccionada

        listado.value.splice(indexElemento, 1, subtarea)

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
      grupo: { requiredIfGrupo: requiredIf(() => subtarea.modo_asignacion_trabajo === opcionesModoAsignacionTrabajo.por_grupo) },
      tipo_trabajo: { required },
      descripcion_completa: { required },
    }

    const v$ = useVuelidate(rules, subtarea)
    setValidador(v$.value)

    // Validaciones completas
    const validarTecnicosGrupoPrincipal = new ValidarTecnicosGrupoPrincipal(tecnicosGrupoPrincipal)

    mixin.agregarValidaciones(
      validarTecnicosGrupoPrincipal
    )

    const { files, addFiles, removeFile } = useFileList()

    function cargarArchivos(files) {
      console.log(files)
      subtarea.archivos = files
    }

    watch(tecnicosGrupoPrincipal, () => {
      tecnicosGrupoPrincipal.value = tecnicosGrupoPrincipal.value.map((empleado: Empleado) => {
        const tecnico = new Empleado()
        tecnico.hydrate(empleado)

        const roles = stringToArray(tecnico.roles ?? '')
        tecnico.roles = quitarItemDeArray(roles, rolesAdmitidos.empleado).join(',')

        return tecnico
      })
    })

    return {
      // Referencias
      refEmpleadosAsignados,
      // Others
      v$,
      subtarea,
      seleccionBusqueda,
      columnas,
      tecnicoSeleccionado,
      busqueda,
      grupos,
      eliminarTecnico,
      asignarNuevoTecnicoLider,
      designarNuevoSecretario,
      listadosAuxiliares,
      tecnicosGrupoPrincipal,
      tiposInstalaciones,
      tiposTareasTelconet,
      tiposTareasNedetel,
      fab: ref(false),
      // listados predefinidos
      regiones,
      atenciones,
      tiposIntervenciones,
      causaIntervencion,
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
      tipoSeleccion,
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
      opcionesModoAsignacionTrabajo,
      cancelarDesignacion,
      entidadSeleccionada,

    }
  },
})
