// Dependencias
import { mediosNotificacion, modosAsignacionTrabajo, destinosTareas, tabOptionsEstadosSubtareas } from 'config/tareas.utils'
import { configuracionColumnasSubtarea } from 'gestionTrabajos/subtareas/domain/configuracionColumnasSubtarea'
import { configuracionColumnasClientes } from 'sistema/clientes/domain/configuracionColumnasClientes'
import { computed, defineComponent, reactive, ref, watch, watchEffect } from 'vue'
import { configuracionColumnasTarea } from '../domain/configuracionColumnasTarea'
import { acciones, accionesTabla, maskFecha, rolesSistema } from 'config/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { required, requiredIf } from 'shared/i18n-validators'
import { useNotificaciones } from 'shared/notificaciones'
import { useSubtareaStore } from 'stores/subtarea'
import { useTareaStore } from 'stores/tarea'
import useVuelidate from '@vuelidate/core'

// Componentes
import DesignarResponsableTrabajo from 'gestionTrabajos/subtareas/modules/designarResponsableTrabajo/view/DesignarResponsableTrabajo.vue'
import TablaSubtareaSuspendida from 'gestionTrabajos/subtareas/modules/tablaSubtareasSuspendidas/view/TablaSubtareaSuspendida.vue'
import TablaSubtareaPausas from 'gestionTrabajos/subtareas/modules/pausasRealizadas/view/PausasRealizadas.vue'
import TiempoSubtarea from 'gestionTrabajos/subtareas/modules/tiemposTrabajos/view/TiempoSubtarea.vue'
import TabLayoutFilterTabs from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { MotivoSuspendidoController } from 'gestionTrabajos/motivosSuspendidos/infraestructure/MotivoSuspendidoController'
import { ComportamientoModalesSubtarea } from 'pages/gestionTrabajos/subtareas/application/ComportamientoModalesSubtarea'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useBotonesTablaSubtarea } from 'pages/gestionTrabajos/subtareas/application/BotonesTablaSubtarea'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { SubtareaController } from 'pages/gestionTrabajos/subtareas/infraestructure/SubtareaController'
import { ClienteFinalController } from 'clientesFinales/infraestructure/ClienteFinalController'
import { GrupoController } from 'pages/recursosHumanos/grupos/infraestructure/GrupoController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { ProvinciaController } from 'sistema/provincia/infraestructure/ProvinciaController'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { TipoTrabajoController } from 'tiposTareas/infraestructure/TipoTrabajoController'
import { ClienteController } from 'sistema/clientes/infraestructure/ClienteController'
import { ComportamientoModalesTarea } from '../application/ComportamientoModalesTarea'
import { ProyectoController } from 'proyectos/infraestructure/ProyectoController'
import { useFiltrosListadosTarea } from '../application/FiltrosListadosTarea'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { useBotonesTablaTarea } from '../application/BotonesTablaTarea'
import { TareaController } from '../infraestructure/TareaController'
import { ClienteFinal } from 'clientesFinales/domain/ClienteFinal'
import { Tarea } from '../domain/Tarea'
import { TipoTrabajo } from 'pages/gestionTrabajos/tiposTareas/domain/TipoTrabajo'
import { TareaModales } from '../domain/TareaModales'

export default defineComponent({
  components: {
    EssentialSelectableTable,
    LabelAbrirModal,
    ModalesEntidad,
    TabLayoutFilterTabs,
    EssentialTableTabs,
    DesignarResponsableTrabajo,
    TiempoSubtarea,
    TablaSubtareaSuspendida,
    TablaSubtareaPausas,
    EssentialTable,
  },
  setup() {
    /*********
     * Stores
     *********/
    const tareaStore = useTareaStore()
    const subtareaStore = useSubtareaStore()

    /*******
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(Tarea, new TareaController())
    const { entidad: tarea, listadosAuxiliares, accion, disabled, listado } = mixin.useReferencias()
    const { guardar, editar, eliminar, reestablecer, setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()
    const { onReestablecer, onConsultado, onBeforeGuardar } = mixin.useHooks()

    // -- Mixin subtarea
    const mixinSubtarea = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
    const { listado: subtareas } = mixinSubtarea.useReferencias()
    const { listar: listarSubtareas } = mixinSubtarea.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        clientes: new ClienteController(),
        provincias: new ProvinciaController(),
        cantones: new CantonController(),
        proyectos: new ProyectoController(),
        fiscalizadores: {
          controller: new EmpleadoController(),
          params: { rol: rolesSistema.fiscalizador },
        },
        coordinadores: {
          controller: new EmpleadoController(),
          params: { rol: rolesSistema.coordinador },
        },
        tiposTrabajos: {
          controller: new TipoTrabajoController(),
          params: { cliente: tareaStore.tarea.cliente ?? tareaStore.idCliente }
        },
        grupos: new GrupoController(),
        empleados: new EmpleadoController(),
        motivosSuspendidos: new MotivoSuspendidoController(),
      })

      // Necesario al consultar
      clientes.value = listadosAuxiliares.clientes
      fiscalizadores.value = listadosAuxiliares.fiscalizadores
      coordinadores.value = listadosAuxiliares.coordinadores
      // tiposTrabajosSource.value = listadosAuxiliares.tiposTrabajos
      listadosAuxiliares.clientesFinales = []
    })

    /************
     * Variables
     ************/
    const { notificarAdvertencia } = useNotificaciones()
    const paraProyecto = computed(() => tarea.para_cliente_proyecto === destinosTareas.paraProyecto)
    const paraClienteFinal = computed(() => tarea.para_cliente_proyecto === destinosTareas.paraClienteFinal)
    const tab = ref('tarea')
    /*const tiposTrabajosSource = ref([])
    listadosAuxiliares.tiposTrabajos = computed(() =>
      tiposTrabajosSource.value.filter((tipo: TipoTrabajo) => tipo.cliente_id === (tarea.cliente ? tarea.cliente : false))
    ).value*/

    /*************
    * Validaciones
    **************/
    const reglas = {
      cliente: { requiredIfCliente: requiredIf(() => paraClienteFinal.value) },
      titulo: { required },
      codigo_tarea_cliente: { required },
      proyecto: { required: requiredIf(() => paraProyecto.value) },
      descripcion_completa: { required: requiredIf(() => !tarea.tiene_subtareas) },
      tipo_trabajo: { required: requiredIf(() => !tarea.tiene_subtareas) },
      fecha_inicio_trabajo: { required: requiredIf(() => !tarea.tiene_subtareas) },
      hora_inicio_trabajo: { required: requiredIf(() => !tarea.tiene_subtareas && tarea.es_ventana) },
      hora_fin_trabajo: { required: requiredIf(() => !tarea.tiene_subtareas && tarea.es_ventana) },
      grupo: { required: requiredIf(() => !tarea.tiene_subtareas && tarea.modo_asignacion_trabajo === modosAsignacionTrabajo.por_grupo) },
      empleado: { required: requiredIf(() => !tarea.tiene_subtareas && tarea.modo_asignacion_trabajo === modosAsignacionTrabajo.por_empleado) },
    }

    const v$ = useVuelidate(reglas, tarea)
    setValidador(v$.value)

    /*********
    * Filtros
    **********/
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
      filtrarProvincias,
      cantones,
      filtrarCantones,
      proyectos,
      filtrarProyectos,
      tiposTrabajos,
      filtrarTiposTrabajos,
      grupos,
      filtrarGrupos,
      empleados,
      filtrarEmpleados,
    } = useFiltrosListadosTarea(listadosAuxiliares, tarea)

    /************
    * Funciones
    ************/
    async function obtenerClienteFinal(clienteFinalId: number) {
      const clienteFinalController = new ClienteFinalController()
      const { result } = await clienteFinalController.consultar(clienteFinalId)
      return result
    }

    function establecerCliente() {
      tareaStore.tarea.cliente = tarea.cliente
      tarea.tipo_trabajo = null
    }

    async function guardado(paginaModal: keyof TareaModales) {
      switch (paginaModal) {
        case 'ProyectoPage':
          const { result } = await new ProyectoController().listar()
          console.log(result)
          listadosAuxiliares.proyectos = result
          proyectos.value = result
          break
        case 'ClienteFinalPage':
          if (tarea.cliente) {
            obtenerClientesFinales()
          }
          break
      }
      modalesTarea.cerrarModalEntidad()
    }

    /************
    * Observers
    ************/
    const controller = new ClienteFinalController()
    const cargando = new StatusEssentialLoading()

    watch(computed(() => tarea.cliente), async () => {
      clienteFinal.hydrate(new ClienteFinal())
      // tarea.cliente_final = null

      if (tarea.cliente) {
        obtenerClientesFinales()
      }
    })

    async function obtenerClientesFinales() {
      cargando.activar()
      listadosAuxiliares.clientesFinales = (await controller.listar({ cliente: tarea.cliente })).result
      clientesFinales.value = listadosAuxiliares.clientesFinales
      cargando.desactivar()
    }

    watchEffect(async () => {
      if (tarea.cliente_final) {
        cargando.activar()
        const res = await obtenerClienteFinal(tarea.cliente_final)
        clienteFinal.hydrate(res)
        cargando.desactivar()
      }
    })

    watchEffect(() => {
      if (!tarea.id) subtareas.value = []
    })

    function verificarEsVentana() {
      if (!tarea.es_ventana) tarea.hora_fin_trabajo = null
    }

    // Informacion de cliente final
    const clienteFinal = reactive(new ClienteFinal())

    async function setCliente() {
      if (tarea.proyecto) {
        const proyectoController = new ProyectoController()
        const { result } = await proyectoController.consultar(tarea.proyecto)
        tarea.cliente = result.cliente
      }
    }

    const mostrarLabelModal = computed(() => [acciones.nuevo, acciones.editar].includes(accion.value))

    /**********
    * Modales
    **********/
    const modalesTarea = new ComportamientoModalesTarea()
    const modalesSubtarea = new ComportamientoModalesSubtarea()

    /*********
     * Hooks
     *********/
    onReestablecer(() => {
      clienteFinal.hydrate(new ClienteFinal())
      clientesFinales.value = []
    })

    onConsultado(() => {
      filtrarSubtareas('')

      if (!tarea.tiene_subtareas) tab.value = 'tarea'
      if (tarea.subtarea && !tarea.tiene_subtareas) {
        tarea.titulo = tarea.subtarea.titulo
        tarea.observacion = tarea.subtarea.observacion
        tarea.descripcion_completa = tarea.subtarea.descripcion_completa
        tarea.tipo_trabajo = tarea.subtarea.tipo_trabajo
        tarea.es_ventana = tarea.subtarea.es_ventana
        tarea.fecha_inicio_trabajo = tarea.subtarea.fecha_inicio_trabajo
        tarea.hora_inicio_trabajo = tarea.subtarea.hora_inicio_trabajo
        tarea.hora_fin_trabajo = tarea.subtarea.hora_fin_trabajo
        tarea.grupo = tarea.subtarea.grupo
        tarea.empleado = tarea.subtarea.empleado
        tarea.modo_asignacion_trabajo = tarea.subtarea.modo_asignacion_trabajo
      }
    })

    onBeforeGuardar(() => {
      if (!tarea.tiene_subtareas) {
        // tarea.subtarea = new Subtarea()
        tarea.subtarea.titulo = tarea.titulo
        tarea.subtarea.observacion = tarea.observacion
        tarea.subtarea.descripcion_completa = tarea.descripcion_completa
        tarea.subtarea.tipo_trabajo = tarea.tipo_trabajo
        tarea.subtarea.es_ventana = tarea.es_ventana
        tarea.subtarea.fecha_inicio_trabajo = tarea.fecha_inicio_trabajo
        tarea.subtarea.hora_inicio_trabajo = tarea.hora_inicio_trabajo
        tarea.subtarea.hora_fin_trabajo = tarea.hora_fin_trabajo
        tarea.subtarea.grupo = tarea.grupo
        tarea.subtarea.empleado = tarea.empleado
        tarea.subtarea.modo_asignacion_trabajo = tarea.modo_asignacion_trabajo
      }
    })

    // Subtareas
    const { btnVerPausas: btnVerPausasTarea, btnFinalizar: btnFinalizarTarea, btnFormulario: btnFormularioTarea, btnReagendar: btnReagendarTarea, botonCancelar: btnCancelarTarea } = useBotonesTablaTarea(listado, modalesTarea, listadosAuxiliares)
    const { botonFormulario, botonReagendar, botonCancelar, botonFinalizar, btnAnular } = useBotonesTablaSubtarea(subtareas, modalesSubtarea, listadosAuxiliares)

    const btnAgregarSubtarea: CustomActionTable = {
      titulo: 'Agregar subtarea',
      icono: 'bi-plus',
      color: 'positive',
      accion: () => {
        if (!tarea.id) return notificarAdvertencia('Primero debe seleccionar una tarea.')
        subtareaStore.idTarea = tarea.id
        subtareaStore.codigoTarea = tarea.codigo_tarea
        subtareaStore.observacionTarea = tarea.observacion
        subtareaStore.accion = acciones.nuevo
        subtareaStore.idSubtareaSeleccionada = null
        subtareaStore.idCliente = tarea.cliente
        modalesSubtarea.abrirModalEntidad('SubtareaPage')
      },
    }

    const btnConsultarSubtarea: CustomActionTable = {
      titulo: 'Consultar',
      icono: 'bi-eye',
      accion: ({ entidad }) => {
        subtareaStore.codigoTarea = tarea.codigo_tarea
        subtareaStore.idSubtareaSeleccionada = entidad.id
        subtareaStore.accion = acciones.consultar
        modalesSubtarea.abrirModalEntidad('SubtareaPage')
      },
    }

    function filtrarSubtareas(estado) {
      console.log(estado)
      listarSubtareas({ tarea_id: tarea.id, estado: estado })
    }

    function seleccionarGrupo(grupo_id) {
      tarea.subtarea.modo_asignacion_trabajo = modosAsignacionTrabajo.por_grupo
      tarea.subtarea.grupo = grupo_id
      // tarea.subtarea.empleado = null

      tarea.grupo = grupo_id
      // tarea.empleado = null
    }

    function seleccionarEmpleado(empleado_id) {
      tarea.subtarea.modo_asignacion_trabajo = modosAsignacionTrabajo.por_empleado
      tarea.subtarea.empleado = empleado_id
      // tarea.subtarea.grupo = null

      tarea.empleado = empleado_id
      //tarea.grupo = null
    }

    return {
      seleccionarGrupo,
      seleccionarEmpleado,
      mixinSubtarea,
      filtrarSubtareas,
      btnAgregarSubtarea,
      btnConsultarSubtarea,
      btnAnular,
      subtareas,
      v$,
      tarea,
      accion,
      disabled,
      destinosTareas,
      provincias,
      cantones,
      tiposTrabajos,
      guardar,
      editar,
      eliminar,
      tareaStore,
      reestablecer,
      clientes,
      filtrarClientes,
      clientesFinales,
      filtrarClientesFinales,
      filtrarProvincias,
      filtrarCantones,
      filtrarFiscalizadores,
      filtrarProyectos,
      filtrarTiposTrabajos,
      obtenerClienteFinal,
      fiscalizadores,
      coordinadores,
      filtrarCoordinadores,
      proyectos,
      clienteFinal,
      paraProyecto,
      paraClienteFinal,
      listadosAuxiliares,
      establecerCliente,
      configuracionColumnasClientes,
      setCliente,
      modalesTarea,
      modalesSubtarea,
      mostrarLabelModal,
      configuracionColumnasTarea,
      mixin,
      mediosNotificacion,
      tab,
      verificarEsVentana,
      grupos,
      filtrarGrupos,
      empleados,
      filtrarEmpleados,
      modosAsignacionTrabajo,
      configuracionColumnasSubtarea,
      columnasSubtareas: [...configuracionColumnasSubtarea, accionesTabla],
      botonFormulario, botonReagendar, botonCancelar, botonFinalizar,
      tabOptionsEstadosSubtareas,
      indicatorColor: computed(() => tarea.tiene_subtareas ? 'primary' : 'white'),
      maskFecha,
      guardado,
      // Botones tareas
      btnVerPausasTarea,
      btnFinalizarTarea,
      btnFormularioTarea,
      btnReagendarTarea,
      btnCancelarTarea,
    }
  },
})
