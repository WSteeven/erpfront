// Dependencias
import { configuracionColumnasEmpleadoSeleccionado } from 'subtareas/domain/configuracionColumnasEmpleadoSeleccionado'
import { configuracionColumnasGrupoSeleccionado } from 'subtareas/domain/configuracionColumnasGrupoSeleccionado'
import { configuracionColumnasEmpleado } from 'subtareas/domain/configuracionColumnasEmpleado'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useSubtareaListadoStore } from 'stores/subtareaListado'
import { quitarItemDeArray, stringToArray } from 'shared/utils'
import { computed, defineComponent, Ref, ref } from 'vue'
import {
  tiposInstalaciones,
  tiposTareasTelconet,
  tiposTareasNedetel,
  regiones,
  atenciones,
  estadosSubtareas,
  rolesSistema,
  acciones,
  opcionesModoAsignacionTrabajo,
  tiposIntervenciones,
  causaIntervencion,
} from 'config/utils'
import { required, requiredIf } from 'shared/i18n-validators'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { useTareaStore } from 'stores/tarea'
import useVuelidate from '@vuelidate/core'
import { useQuasar } from 'quasar'

// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ValidarEmpleadosSeleccionados } from '../application/validaciones/ValidarEmpleadosSeleccionados'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { TipoTrabajoController } from 'pages/tareas/tiposTareas/infraestructure/TipoTrabajoController'
import { ValidarEmpleadoResponsable } from '../application/validaciones/ValidarEmpleadoResponsable'
import { ValidarGrupoResponsable } from '../application/validaciones/ValidarGrupoResponsable'
import { useOrquestadorSelectorTecnicos } from '../application/OrquestadorSelectorTecnico'
import { ValidarGrupoAsignado } from '../application/validaciones/ValidarGrupoAsignado'
import { GrupoController } from 'pages/tareas/grupos/infraestructure/GrupoController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { SubtareaController } from '../infraestructure/SubtareaController'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { TipoTrabajo } from 'pages/tareas/tiposTareas/domain/TipoTrabajo'
import { EmpleadoSeleccionado } from '../domain/EmpleadoSeleccionado'
import { GrupoSeleccionado } from '../domain/GrupoSeleccionado'
import { Grupo } from 'pages/tareas/grupos/domain/Grupo'
import { Subtarea } from '../domain/Subtarea'

export default defineComponent({
  props: {
    mixinModal: {
      type: Object as () => ContenedorSimpleMixin<EntidadAuditable>,
      required: true,
    },
  },
  components: { EssentialTable, ButtonSubmits, EssentialSelectableTable },
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const tareaStore = useTareaStore()
    const subtareaListadoStore = useSubtareaListadoStore()
    const notificacionStore = useNotificacionStore()
    notificacionStore.setQuasar(useQuasar())

    /********
    * Mixin
    *********/
    const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
    const { entidad: subtarea, listadosAuxiliares } = mixin.useReferencias()
    const { obtenerListados, cargarVista, consultar, guardar, editar, reestablecer, setValidador } = mixin.useComportamiento()
    const { onBeforeGuardar, onBeforeModificar, onConsultado } = mixin.useHooks()

    const { listado } = props.mixinModal.useReferencias()

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

    if (subtareaListadoStore.idSubtareaSeleccionada) consultar(subtareaListadoStore.idSubtareaSeleccionada)

    const accion = tareaStore.accionSubtarea
    const disable = computed(() => (subtarea.estado !== estadosSubtareas.CREADO && subtarea.estado !== null))

    /************
     * Variables
     ************/
    const asignarJefe = ref(false)
    const asignarSecretario = ref(false)
    const tipoSeleccion = computed(() => asignarJefe.value || asignarSecretario.value ? 'single' : 'none')
    // const empleadoSeleccionadoAsignacionQuitar = ref()
    const tecnicosGrupoPrincipal: Ref<Empleado[]> = ref([])
    const notificaciones = useNotificaciones()
    const seleccionBusqueda = ref('por_tecnico')
    const tecnicoSeleccionado = ref()
    const busqueda = ref()

    /**************
     * Referencias
     **************/
    const refEmpleadosAsignados = ref()

    /***************************
    * Configuracion de columnas
    ****************************/
    const columnas = [
      ...configuracionColumnasEmpleadoSeleccionado,
      {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'center',
      },
    ]

    const columnasGrupo = [
      ...configuracionColumnasGrupoSeleccionado,
      {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'center',
      },
    ]

    /***************
    * Botones tabla
    ***************/
    const designarGrupoPrincipal: CustomActionTable = {
      titulo: 'Designar como responsable',
      icono: 'bi-check-circle-fill',
      color: 'positive',
      visible: ({ entidad }) => [acciones.editar, acciones.nuevo].includes(accion) && !entidad.responsable,
      accion: ({ posicion }) => {
        subtarea.grupos_seleccionados = subtarea.grupos_seleccionados.map((grupo: GrupoSeleccionado) => {
          const grupoSeleccionado = new GrupoSeleccionado()
          grupoSeleccionado.hydrate(grupo)
          grupoSeleccionado.responsable = false
          return grupoSeleccionado
        })
        subtarea.grupos_seleccionados[posicion].responsable = true
      },
    }

    // Quitar elemento de grupos seleccionados
    const quitarGrupo: CustomActionTable = {
      titulo: 'Quitar',
      icono: 'bi-x',
      color: 'negative',
      visible: () => [acciones.editar, acciones.nuevo].includes(accion),
      accion: ({ entidad, posicion }) => {
        entidad.principal = false
        subtarea.grupos_seleccionados.splice(posicion, 1)
      },
    }

    const designarEmpleadoResponsable: CustomActionTable = {
      titulo: 'Designar como responsable',
      icono: 'bi-check-circle-fill',
      color: 'positive',
      visible: ({ entidad }) => [acciones.editar, acciones.nuevo].includes(accion) && !entidad.responsable,
      accion: ({ posicion }) => {
        subtarea.empleados_seleccionados = subtarea.empleados_seleccionados.map((empleado: EmpleadoSeleccionado) => {
          const empleadoSeleccionado = new EmpleadoSeleccionado()
          empleadoSeleccionado.hydrate(empleado)
          empleadoSeleccionado.responsable = false
          return empleadoSeleccionado
        })
        subtarea.empleados_seleccionados[posicion].responsable = true
      },
    }

    const quitarEmpleado: CustomActionTable = {
      titulo: 'Quitar',
      icono: 'bi-x',
      color: 'negative',
      visible: () => [acciones.editar, acciones.nuevo].includes(accion) && !(asignarJefe.value || asignarSecretario.value),
      accion: ({ entidad, posicion }) => {
        // NO BORRAR
        /* if (subtarea.modo_asignacion_trabajo === opcionesModoAsignacionTrabajo.por_grupo) {
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
        } */

        subtarea.empleados_seleccionados.splice(posicion, 1)
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

    /*********
    * Filtros
    **********/
    // - Filtro tipos de trabajos
    const tiposTrabajos: Ref<TipoTrabajo[]> = ref([])
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
          (v) => v.descripcion.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // - Filtros subtareas
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

    // - Filtros grupos
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

    /********
    * Hooks
    *********/
    onBeforeGuardar(() => {
      subtarea.tarea_id = tareaStore.tarea.id

      /* if (subtarea.modo_asignacion_trabajo === opcionesModoAsignacionTrabajo.por_grupo) {
        subtarea.grupos_seleccionados = subtarea.grupos_seleccionados.map((grupo: GrupoSeleccionado) => {
          return {
            grupo_id: grupo.id,
            principal: grupo.principal,
          }
        })
      } */

      /*subtarea.tecnicos_grupo_principal = validarString(tecnicosGrupoPrincipal.value.map((tecnico: Empleado) => tecnico.id).toString()) */
    })

    onBeforeModificar(() => {
      // subtarea.tecnicos_grupo_principal = validarString(tecnicosGrupoPrincipal.value.map((tecnico: Empleado) => tecnico.id).toString())
    })

    onConsultado(() => {
      if (subtarea.modo_asignacion_trabajo === opcionesModoAsignacionTrabajo.por_grupo) {
        subtarea.grupos_seleccionados.forEach((grupo: GrupoSeleccionado) => {
          console.log(grupo)
          if (grupo.id) obtenerTecnicosGrupo(grupo.id)
        })
      }
      // tecnicosGrupoPrincipal.value = subtarea.tecnicos_grupo_principal
    })

    /*function validarString(listado: string) {
      return listado !== '' ? listado : null
    }*/

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

    /*************
    * Validaciones
    **************/
    const rules = {
      detalle: { required },
      // grupo: { required: requiredIf(() => subtarea.modo_asignacion_trabajo === opcionesModoAsignacionTrabajo.por_grupo) },
      tipo_trabajo: { required },
      descripcion_completa: { required },
      fecha_ventana: { required: requiredIf(() => subtarea.es_ventana) },
      hora_inicio_ventana: { required: requiredIf(() => subtarea.es_ventana) },
      hora_fin_ventana: { required: requiredIf(() => subtarea.es_ventana) },
      subtarea_dependiente: { required: requiredIf(() => subtarea.es_dependiente) },
    }

    const v$ = useVuelidate(rules, subtarea)
    setValidador(v$.value)

    const validarGrupoAsignado = new ValidarGrupoAsignado(subtarea)
    const validarGrupoResponsable = new ValidarGrupoResponsable(subtarea)
    const validarEmpleadosSeleccionados = new ValidarEmpleadosSeleccionados(subtarea)
    const validarEmpleadoResponsable = new ValidarEmpleadoResponsable(subtarea)
    mixin.agregarValidaciones(validarGrupoAsignado, validarGrupoResponsable, validarEmpleadosSeleccionados, validarEmpleadoResponsable)

    /************
    * Funciones
    *************/
    function esLider(entidad) {
      return (entidad.roles).replaceAll(', ', ',').split(',').includes(rolesSistema.tecnico_lider)
    }

    function esSecretario(entidad) {
      return (entidad.roles).replaceAll(', ', ',').split(',').includes(rolesSistema.tecnico_secretario)
    }

    /* async function entidadSeleccionada(itemsSeleccionados: EntidadAuditable[]) {
      if (itemsSeleccionados.length) {
        const id = itemsSeleccionados[0].id

        try {
          // Jefe de cuadrilla --
          if (asignarJefe.value) {
            await new CambiarJefeCuadrillaController().guardar({ grupo: subtarea.grupo, nuevo_jefe: id })
            asignarJefe.value = false

            // Quitar rol tabla Jefe cuadrilla
            const roles = stringToArray(empleadoSeleccionadoAsignacionQuitar.value.roles)
            empleadoSeleccionadoAsignacionQuitar.value.roles = quitarItemDeArray(roles, rolesSistema.tecnico_lider).join(',')

            // Designar rol tabla Secretario cuadrilla
            const posicion: any = tecnicosGrupoPrincipal.value.findIndex((empleado: Empleado) => empleado.id === id)
            const entidad: Empleado = tecnicosGrupoPrincipal.value[posicion]
            entidad.roles = entidad.roles + ', ' + rolesSistema.tecnico_lider
            tecnicosGrupoPrincipal.value.splice(posicion, 1, entidad)

            notificaciones.notificarCorrecto('Asignado como jefe de cuadrilla')
          }

          // Secretario de cuadrilla --
          if (asignarSecretario.value) {
            await new CambiarSecretarioController().guardar({ grupo: subtarea.grupo, nuevo_jefe: id })
            asignarSecretario.value = false

            // Quitar rol secretario cuadrilla
            const roles = stringToArray(empleadoSeleccionadoAsignacionQuitar.value.roles)
            empleadoSeleccionadoAsignacionQuitar.value.roles = quitarItemDeArray(roles, rolesSistema.tecnico_secretario).join(',')

            // Designar rol tabla Secretario cuadrilla
            const posicion: any = tecnicosGrupoPrincipal.value.findIndex((empleado: Empleado) => empleado.id === id)
            const entidad: Empleado = tecnicosGrupoPrincipal.value[posicion]
            entidad.roles = entidad.roles + ', ' + rolesSistema.tecnico_secretario
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
    } */

    function agregarGrupoSeleccionado(grupo_id: number) {
      if (grupo_id) {
        const existe = subtarea.grupos_seleccionados.some((grupo: GrupoSeleccionado) => grupo.id === grupo_id)

        if (existe) return notificaciones.notificarAdvertencia('El grupo seleccionado ya ha sido agregado')

        obtenerTecnicosGrupo(grupo_id)
        const index = grupos.value.findIndex((item: Grupo) => item.id === grupo_id)
        const grupoSeleccionado: GrupoSeleccionado = grupos.value[index]

        if (subtarea.grupos_seleccionados.length === 0) {
          grupoSeleccionado.responsable = true
        }
        subtarea.grupos_seleccionados.push(grupoSeleccionado)

      } else notificaciones.notificarAdvertencia('Debe seleccionar un grupo')
    }

    async function obtenerTecnicosGrupo(grupo_id: number) {
      const empleadoController = new EmpleadoController()
      const { result } = await empleadoController.listar({ grupo_id: grupo_id })
      subtarea.empleados_seleccionados.push(...result)

      subtarea.empleados_seleccionados = subtarea.empleados_seleccionados.map((empleado: Empleado) => {
        const tecnico = new EmpleadoSeleccionado()
        tecnico.hydrate(empleado)

        const roles = tecnico.roles && typeof (tecnico.roles) === 'string' ? stringToArray(tecnico.roles) : []
        tecnico.roles = quitarItemDeArray(roles, rolesSistema.empleado).join(',')

        return tecnico
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

    function seleccionarEmpleado(empleados: EmpleadoSeleccionado[]) {
      empleados = empleados.map((empleado: Empleado) => {
        const emp = new EmpleadoSeleccionado()
        emp.hydrate(empleado)
        emp.responsable = false
        return emp
      })

      seleccionarTecnico(empleados)
    }

    function cargarArchivos(files: File[]) {
      subtarea.archivos = files
    }

    function verificarEsVentana() {
      if (!subtarea.es_ventana) {
        subtarea.fecha_ventana = null
        subtarea.hora_inicio_ventana = null
        subtarea.hora_fin_ventana = null
      }
    }

    function resetListados() {
      subtarea.empleados_seleccionados = []
      subtarea.grupos_seleccionados = []
    }

    return {
      // Referencias
      refEmpleadosAsignados,
      // Others
      v$,
      subtarea,
      seleccionBusqueda,
      columnas,
      columnasGrupo,
      tecnicoSeleccionado,
      busqueda,
      grupos,
      quitarEmpleado,
      asignarNuevoTecnicoLider,
      designarNuevoSecretario,
      designarEmpleadoResponsable,
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
      agregarGrupoSeleccionado,
      guardarDatos, editarDatos, reestablecerDatos,
      accion,
      disable,
      configuracionColumnasEmpleado,
      tipoSeleccion,
      quitarGrupo,
      // orquestador
      refListadoSeleccionableTecnicos,
      criterioBusquedaTecnico,
      listadoTecnicos,
      //listarEmpleados,
      listarTecnicos,
      limpiarTecnico,
      seleccionarTecnico,
      seleccionarEmpleado,
      cargarArchivos,
      opcionesModoAsignacionTrabajo,
      cancelarDesignacion,
      // entidadSeleccionada,
      verificarEsVentana,
      Empleado,
      designarGrupoPrincipal,
      resetListados,
      // mostrarEmergencia,
      //verificarTipoTrabajo,
    }
  },
})
