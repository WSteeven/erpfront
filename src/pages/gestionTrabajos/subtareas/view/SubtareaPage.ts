// Dependencias
import { configuracionColumnasEmpleadoGrupo } from 'pages/gestionTrabajos/trabajos/domain/configuracionColumnasEmpleadoGrupo'
import { configuracionColumnasEmpleadoSeleccionado } from 'trabajos/domain/configuracionColumnasEmpleadoSeleccionado'
import { configuracionColumnasGrupoSeleccionado } from 'trabajos/domain/configuracionColumnasGrupoSeleccionado'
//import { configuracionColumnasTrabajo } from 'gestionTrabajos/trabajos/domain/configuracionColumnasTrabajo'
import { computed, defineComponent, reactive, Ref, ref, watch, watchEffect } from 'vue'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import {
  tiposInstalaciones,
  tiposTareasTelconet,
  tiposTareasNedetel,
  regiones,
  atenciones,
  estadosTrabajos,
  rolesSistema,
  acciones,
  accionesTabla,
  tiposIntervenciones,
  causaIntervencion,
  maskFecha,
} from 'config/utils'
import { destinosTareas, modosAsignacionTrabajo } from 'config/tareas.utils'
import { required, requiredIf } from 'shared/i18n-validators'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { nivelesTrabajos } from 'config/tareas.utils'
import { useSubtareaStore } from 'stores/subtarea'
import useVuelidate from '@vuelidate/core'
import { useQuasar } from 'quasar'
import { useFiltrosListadosTarea } from 'tareas/application/FiltrosListadosTarea'
// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ClienteFinalController } from 'gestionTrabajos/clientesFinales/infraestructure/ClienteFinalController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoTrabajoController } from 'gestionTrabajos/tiposTareas/infraestructure/TipoTrabajoController'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ProyectoController } from 'gestionTrabajos/proyectos/infraestructure/ProyectoController'
import { ComportamientoModalesSubtarea } from '../application/ComportamientoModalesSubtarea'
import { GrupoController } from 'recursosHumanos/grupos/infraestructure/GrupoController'
import { TareaController } from 'gestionTrabajos/tareas/infraestructure/TareaController'
import { ClienteController } from 'sistema/clientes/infraestructure/ClienteController'
import { ClienteFinal } from 'gestionTrabajos/clientesFinales/domain/ClienteFinal'
import { useBotonesTablaSubtarea } from '../application/BotonesTablaSubtarea'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { Subtarea } from '../domain/Subtarea'
import { CambiarEstadoSubtarea } from '../application/CambiarEstadoSubtarea'

export default defineComponent({
  components: { TabLayout, EssentialTable, ButtonSubmits, EssentialSelectableTable, LabelAbrirModal, ModalesEntidad },
  emits: ['cerrar-modal'],
  props: {
    mixinModal: {
      type: Object as () => ContenedorSimpleMixin<Subtarea>,
      required: true,
    },
  },
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const subtareaStore = useSubtareaStore()
    const notificacionStore = useNotificacionStore()
    notificacionStore.setQuasar(useQuasar())

    /********
    * Mixin
    *********/
    const { entidad: subtarea, listadosAuxiliares, accion, listado, disabled } = props.mixinModal.useReferencias()
    const { obtenerListados, cargarVista, consultar, guardar, editar, reestablecer, setValidador, filtrar } = props.mixinModal.useComportamiento()
    const { onBeforeGuardar, onConsultado } = props.mixinModal.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        tiposTrabajos: new TipoTrabajoController(),
        tareas: new TareaController(),
        grupos: {
          controller: new GrupoController(),
          params: { campos: 'id,nombre' }
        },
        clientes: new ClienteController(),
        coordinadores: {
          controller: new EmpleadoController(),
          params: { rol: rolesSistema.coordinador },
        },
        empleados: new EmpleadoController(),
      })

      // Necesario al consultar
      tiposTrabajos.value = listadosAuxiliares.tiposTrabajos
      grupos.value = listadosAuxiliares.grupos
      empleados.value = listadosAuxiliares.empleados
    })

    /*******
     * Init
     *******/
    if (subtareaStore.idSubtareaSeleccionada) consultar({ id: subtareaStore.idSubtareaSeleccionada })
    else subtarea.hydrate(new Subtarea())

    subtarea.tarea = subtareaStore.codigoTarea
    subtarea.observacion = subtareaStore.observacionTarea
    accion.value = subtareaStore.accion

    /************
     * Variables
     ************/
    const asignarJefe = ref(false)
    const asignarSecretario = ref(false)
    const tipoSeleccion = computed(() => asignarJefe.value || asignarSecretario.value ? 'single' : 'none')
    const tecnicosGrupoPrincipal: Ref<Empleado[]> = ref([])
    const { notificarAdvertencia } = useNotificaciones()
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
    const columnasEmpleadoSeleccionado = [
      ...configuracionColumnasEmpleadoSeleccionado,
      {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'center',
      },
    ]

    const columnasGrupoSeleccionado = [
      ...configuracionColumnasGrupoSeleccionado,
      {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'center',
      },
    ]

    /**********
     * Modales
     **********/
    const modales = new ComportamientoModalesSubtarea()

    /***************
    * Botones tabla
    ***************/
    /*const designarGrupoPrincipal: CustomActionTable = {
      titulo: 'Designar como responsable',
      icono: 'bi-check',
      color: 'positive',
      visible: ({ entidad }) => [acciones.editar, acciones.nuevo].includes(accion.value) && !entidad.es_responsable && !disabled.value,
      accion: ({ posicion }) => {
        subtarea.grupos_seleccionados = subtarea.grupos_seleccionados.map((grupo: GrupoSeleccionado) => {
          const grupoSeleccionado = new GrupoSeleccionado()
          grupoSeleccionado.hydrate(grupo)
          grupoSeleccionado.es_responsable = false
          return grupoSeleccionado
        })
        subtarea.grupos_seleccionados[posicion].es_responsable = true
      },
    }*/

    // Quitar elemento de grupos seleccionados
    /*const quitarGrupo: CustomActionTable = {
      titulo: 'Quitar',
      icono: 'bi-x',
      color: 'negative',
      visible: () => !disabled.value,//[acciones.editar, acciones.nuevo].includes(accion.value), //accion),
      accion: ({ entidad, posicion }) => {
        entidad.principal = false
        subtarea.grupos_seleccionados.splice(posicion, 1)
      },
    }

    const designarEmpleadoResponsable: CustomActionTable = {
      titulo: 'Designar como responsable',
      icono: 'bi-check',
      color: 'positive',
      visible: ({ entidad }) => [acciones.editar, acciones.nuevo].includes(accion.value) && !entidad.es_responsable,
      accion: ({ posicion }) => {
        subtarea.empleados_seleccionados = subtarea.empleados_seleccionados.map((empleado: EmpleadoSeleccionado) => {
          const empleadoSeleccionado = new EmpleadoSeleccionado()
          empleadoSeleccionado.hydrate(empleado)
          empleadoSeleccionado.es_responsable = false
          return empleadoSeleccionado
        })
        subtarea.empleados_seleccionados[posicion].es_responsable = true
      },
    } */

    const quitarEmpleado: CustomActionTable = {
      titulo: 'Quitar',
      icono: 'bi-x',
      color: 'negative',
      visible: () => [acciones.editar, acciones.nuevo].includes(accion.value) && !(asignarJefe.value || asignarSecretario.value),
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

        // subtarea.empleados_seleccionados.splice(posicion, 1)
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

    const { botonFormulario, botonSubirArchivos, botonReagendar, botonCancelar, botonFinalizar, botonVerPausas } = useBotonesTablaSubtarea(listado, modales)

    const botonEditarTrabajo: CustomActionTable = {
      titulo: 'Editar',
      icono: 'bi-pencil',
      color: 'primary',
      accion: ({ entidad }) => {
        accion.value = acciones.editar
        consultar(entidad)
      },
    }

    /*********
    * Filtros
    **********/
    // - Filtro tipos de trabajos
    /*const tiposTrabajosSource = computed(() =>
      listadosAuxiliares.tiposTrabajos.filter((tipo: TipoTrabajo) => tipo.cliente_id === (subtarea.tarea ? obtenerIdCliente(subtarea.tarea) : false))
    ) */

    const {
      clientes,
      filtrarClientes,
      clientesFinales,
      filtrarClientesFinales,
      fiscalizadores,
      filtrarFiscalizadores,
      coordinadores,
      filtrarCoordinadores,
      provincias,
      cantones,
      proyectos,
      filtrarProyectos,
      tiposTrabajos,
      filtrarTiposTrabajos,
      grupos,
      filtrarGrupos,
      empleados,
      filtrarEmpleados,
    } = useFiltrosListadosTarea(listadosAuxiliares)

    /********
    * Hooks
    *********/
    onBeforeGuardar(() => {
      subtarea.tarea = subtareaStore.idTarea
    })

    /* onBeforeModificar(() => {
      // subtarea.tecnicos_grupo_principal = validarString(tecnicosGrupoPrincipal.value.map((tecnico: Empleado) => tecnico.id).toString())
    }) */

    onConsultado(() => {
      /* if (subtarea.modo_asignacion_trabajo === modosAsignacionTrabajo.por_grupo) {
        subtarea.grupos_seleccionados.forEach((grupo: GrupoSeleccionado) => {
          console.log(grupo)
          if (grupo.id) obtenerTecnicosGrupo(grupo.id)
        })
      }*/
      // tecnicosGrupoPrincipal.value = subtarea.tecnicos_grupo_principal
    })

    /*function validarString(listado: string) {
      return listado !== '' ? listado : null
    }*/

    async function guardarDatos(subtarea: Subtarea) {
      try {
        //const idSubtarea = subtarea.id
        const entidad: Subtarea = await guardar(subtarea, false)

        /*console.log('trabajo guardado')
        console.log(subtarea)
        listado.value = [subtarea, ...listado.value]*/
        const cambiarEstadoTrabajo = new CambiarEstadoSubtarea()

        console.log(entidad)

        if (entidad.id) {
          console.log(entidad)
          const { result } = await cambiarEstadoTrabajo.asignar(entidad.id)
          entidad.estado = estadosTrabajos.ASIGNADO
          entidad.fecha_hora_asignacion = result.fecha_hora_asignacion
          listado.value = [...listado.value, entidad]
          //actualizarElemento(posicion, entidad)
        }

        emit('cerrar-modal')

      } catch (e) { }
    }

    async function editarDatos(subtarea: Subtarea) {
      try {
        await editar(subtarea, false)

        const indexElemento = subtareaStore.posicionSubtareaSeleccionada

        listado.value.splice(indexElemento, 1, subtarea)

        emit('cerrar-modal')
      } catch (e) { }
    }

    function reestablecerDatos() {
      reestablecer()
      // emit('cerrar-modal')
    }

    const paraProyecto = computed(() => subtarea.para_cliente_proyecto === destinosTareas.paraProyecto)
    const paraClienteFinal = computed(() => subtarea.para_cliente_proyecto === destinosTareas.paraClienteFinal)

    /*************
    * Validaciones
    **************/
    const rules = {
      titulo: { required },
      descripcion_completa: { required },
      tipo_trabajo: { required },
      tarea: { required },
      fecha_agendado: { required: requiredIf(() => subtarea.es_ventana) },
      hora_inicio_agendado: { required: requiredIf(() => subtarea.es_ventana) },
      hora_fin_agendado: { required: requiredIf(() => subtarea.es_ventana) },
      subtarea_dependiente: { required: requiredIf(() => subtarea.es_dependiente) },
    }

    const v$ = useVuelidate(rules, subtarea)
    setValidador(v$.value)

    /************
    * Funciones
    *************/
    async function obtenerClienteFinal(clienteFinalId: number) {
      const clienteFinalController = new ClienteFinalController()
      const { result } = await clienteFinalController.consultar(clienteFinalId)
      return result
    }

    /*function establecerCliente() {
      tareaStore.tarea.cliente = subtarea.cliente
    }*/

    /*function agregarGrupoSeleccionado(grupo_id: number) {
      if (grupo_id) {
        const existe = subtarea.grupos_seleccionados.some((grupo: GrupoSeleccionado) => grupo.id === grupo_id)

        if (existe) return notificarAdvertencia('El grupo seleccionado ya ha sido agregado')

        obtenerTecnicosGrupo(grupo_id)
        const index = grupos.value.findIndex((item: Grupo) => item.id === grupo_id)
        const grupoSeleccionado: GrupoSeleccionado = grupos.value[index]

        if (subtarea.grupos_seleccionados.length === 0) {
          grupoSeleccionado.es_responsable = true
          //console.log(subtarea.grupos_seleccionados.length)
        }
        subtarea.grupos_seleccionados.push(grupoSeleccionado)
        subtarea.grupo = null

      } else notificarAdvertencia('Debe seleccionar un grupo')
    }

    async function obtenerTecnicosGrupo(grupo_id: number) {
      const empleadoController = new EmpleadoController()
      const { result } = await empleadoController.listar({ grupo_id: grupo_id })
      subtarea.empleados_seleccionados.push(...result)
    } */

    /* function cargarArchivos(files: File[]) {
      subtarea.archivos = files
    } */

    function verificarEsVentana() {
      if (!subtarea.es_ventana) {
        // subtarea.fecha_agendado = null
        // subtarea.hora_inicio_ventana = null
        subtarea.hora_fin_agendado = null
      }
    }

    /************
    * Observers
    ************/
    // const controller = new ClienteFinalController()

    /*watchEffect(async () => {
      if (subtarea.cliente) {
        clientesFinalesSource.value = (await controller.listar({ cliente: subtarea.cliente })).result
        clientesFinales.value = clientesFinalesSource.value
      }
    })*/

    watchEffect(async () => {
      if (subtarea.cliente_final) {
        const res = await obtenerClienteFinal(subtarea.cliente_final)
        clienteFinal.hydrate(res)
      }
    })

    // Informacion de ubicacion
    const clienteFinal = reactive(new ClienteFinal())

    watch(computed(() => subtarea.para_cliente_proyecto), (valor) => {
      if (accion.value !== acciones.editar) {
        subtarea.hydrate(new Subtarea())
        clienteFinal.hydrate(new ClienteFinal())
        subtarea.para_cliente_proyecto = valor
      }
    })

    async function setCliente() {
      if (subtarea.proyecto) {
        const proyectoController = new ProyectoController()
        const { result } = await proyectoController.consultar(subtarea.proyecto)
        subtarea.cliente = result.cliente
      }
    }

    const mostrarLabelModal = computed(() => [acciones.nuevo, acciones.editar].includes(accion.value))

    function filtrarTodos(filtros) {
      filtrar(filtros)
    }

    /* watchEffect(async () => {
      if (subtarea.tarea) {
        const idCliente = obtenerIdCliente(subtarea.tarea)
        const { result } = await new TipoTrabajoController().listar({ cliente_id: idCliente })
        tiposTrabajosSource.value = result
        subtarea.tipo_trabajo = null
      }
    }) */

    /* function obtenerIdCliente(idTarea: number) {
      const tarea: Tarea = tareas.value.filter((tarea: Tarea) => tarea.id === idTarea)[0]
      return tarea.cliente_id
    } */

    return {
      filtrarTodos,
      // Referencias
      refEmpleadosAsignados,
      // Others
      v$,
      //mixin,
      listado,
      subtarea,
      seleccionBusqueda,
      columnasEmpleadoSeleccionado,
      columnasGrupoSeleccionado,
      tecnicoSeleccionado,
      busqueda,
      quitarEmpleado,
      asignarNuevoTecnicoLider,
      designarNuevoSecretario,
      // designarEmpleadoResponsable,
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
      //agregarGrupoSeleccionado,
      guardarDatos,
      reestablecerDatos,
      accion,
      disabled,
      configuracionColumnasEmpleadoGrupo,
      tipoSeleccion,
      // quitarGrupo,
      // cargarArchivos,
      modosAsignacionTrabajo,
      cancelarDesignacion,
      verificarEsVentana,
      Empleado,
      // designarGrupoPrincipal,
      destinosTareas,
      paraProyecto,
      paraClienteFinal,
      guardar,
      editar,
      reestablecer,
      obtenerClienteFinal,
      setCliente,
      mostrarLabelModal,
      modales,
      //configuracionColumnasTrabajo,
      subtareaStore,
      nivelesTrabajos,
      acciones,
      clienteFinal,
      maskFecha,
      botonFormulario, botonSubirArchivos, botonReagendar, botonCancelar, botonFinalizar, botonVerPausas,
      accionesTabla,
      botonEditarTrabajo,
      configuracionColumnasEmpleadoSeleccionado,
      // Filtros
      clientes,
      filtrarClientes,
      clientesFinales,
      filtrarClientesFinales,
      fiscalizadores,
      filtrarFiscalizadores,
      coordinadores,
      filtrarCoordinadores,
      proyectos,
      filtrarProyectos,
      tiposTrabajos,
      filtrarTiposTrabajos,
      grupos,
      filtrarGrupos,
      empleados,
      filtrarEmpleados,
    }
  },
})
