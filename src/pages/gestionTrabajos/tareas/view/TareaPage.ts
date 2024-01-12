// Dependencias
import { mediosNotificacion, modosAsignacionTrabajo, destinosTareas, tabOptionsEstadosSubtareas, ubicacionesTrabajo, tabOptionsEstadosTareas } from 'config/tareas.utils'
import { configuracionColumnasSubtarea } from 'gestionTrabajos/subtareas/domain/configuracionColumnasSubtarea'
import { configuracionColumnasClientes } from 'sistema/clientes/domain/configuracionColumnasClientes'
import { computed, defineComponent, reactive, ref, watch, watchEffect } from 'vue'
import { configuracionColumnasTarea } from '../domain/configuracionColumnasTarea'
import { acciones, accionesTabla, maskFecha, rolesSistema } from 'config/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { required, requiredIf } from 'shared/i18n-validators'
import { useNotificaciones } from 'shared/notificaciones'
import { convertirNumeroPositivo } from 'shared/utils'
import { useSubtareaStore } from 'stores/subtarea'
import { useCargandoStore } from 'stores/cargando'
import { useTareaStore } from 'stores/tarea'
import useVuelidate from '@vuelidate/core'
import { useQuasar } from 'quasar'

// Componentes
import DesignarResponsableTrabajo from 'gestionTrabajos/subtareas/modules/designarResponsableTrabajo/view/DesignarResponsableTrabajo.vue'
import TablaSubtareaSuspendida from 'gestionTrabajos/subtareas/modules/tablaSubtareasSuspendidas/view/TablaSubtareaSuspendida.vue'
import TablaSubtareaPausas from 'gestionTrabajos/subtareas/modules/pausasRealizadas/view/PausasRealizadas.vue'
import TiempoSubtarea from 'gestionTrabajos/subtareas/modules/tiemposTrabajos/view/TiempoSubtarea.vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import SolicitarImagen from 'shared/prompts/SolicitarImagen.vue'
import VisorImagen from 'components/VisorImagen.vue'

// Logica y controladores
import { CausaIntervencionController } from 'pages/gestionTrabajos/causasIntervenciones/infraestructure/CausaIntervencionController'
import { MotivoSuspendidoController } from 'gestionTrabajos/motivosSuspendidos/infraestructure/MotivoSuspendidoController'
import { ComportamientoModalesSubtarea } from 'pages/gestionTrabajos/subtareas/application/ComportamientoModalesSubtarea'
import { MotivoPausaController } from 'pages/gestionTrabajos/motivosPausas/infraestructure/MotivoPausaController'
import { EtapaController } from 'pages/gestionTrabajos/proyectos/modules/etapas/infraestructure/EtapaController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useBotonesTablaSubtarea } from 'pages/gestionTrabajos/subtareas/application/BotonesTablaSubtarea'
import { SubtareaController } from 'pages/gestionTrabajos/subtareas/infraestructure/SubtareaController'
import { RutaTareaController } from 'pages/gestionTrabajos/rutas/infraestructure/RutaTareaController'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ClienteFinalController } from 'clientesFinales/infraestructure/ClienteFinalController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { ClienteController } from 'sistema/clientes/infraestructure/ClienteController'
import { ComportamientoModalesTarea } from '../application/ComportamientoModalesTarea'
import { ProyectoController } from 'proyectos/infraestructure/ProyectoController'
import { useFiltrosListadosTarea } from '../application/FiltrosListadosTarea'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { useBotonesTablaTarea } from '../application/BotonesTablaTarea'
import { TareaController } from '../infraestructure/TareaController'
import { ClienteFinal } from 'clientesFinales/domain/ClienteFinal'
import { useAuthenticationStore } from 'stores/authentication'
import { TareaModales } from '../domain/TareaModales'
import { Tarea } from '../domain/Tarea'
import { Proyecto } from 'pages/gestionTrabajos/proyectos/domain/Proyecto'
import { Etapa } from '../../proyectos/modules/etapas/domain/Etapa'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { CentroCostoController } from 'pages/gestionTrabajos/centroCostos/infraestructure/CentroCostosController'

export default defineComponent({
  components: {
    EssentialSelectableTable,
    LabelAbrirModal,
    ModalesEntidad,
    TabLayoutFilterTabs2,
    EssentialTableTabs,
    DesignarResponsableTrabajo,
    TiempoSubtarea,
    TablaSubtareaSuspendida,
    TablaSubtareaPausas,
    EssentialTable,
    SolicitarImagen,
    VisorImagen,
  },
  setup() {
    /*********
     * Stores
     *********/
    const tareaStore = useTareaStore()
    const subtareaStore = useSubtareaStore()
    const authenticationStore = useAuthenticationStore()
    useCargandoStore().setQuasar(useQuasar())

    /*******
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(Tarea, new TareaController())
    const { entidad: tarea, listadosAuxiliares, accion, disabled } = mixin.useReferencias()
    const { guardar, editar, eliminar, reestablecer, setValidador, obtenerListados, cargarVista, listar } =
      mixin.useComportamiento()
    const { onBeforeGuardar, onReestablecer, onConsultado } = mixin.useHooks()

    // -- Mixin subtarea
    const mixinSubtarea = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
    const { listado: subtareas } = mixinSubtarea.useReferencias()
    const { listar: listarSubtareas } = mixinSubtarea.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        clientes: {
          controller: new ClienteController(),
          params: { campos: 'id,razon_social' },
        },
        proyectos: {
          controller: new ProyectoController(),
          params: {
            campos: 'id,nombre,codigo_proyecto,cliente_id,etapas',
            finalizado: 0,
            coordinador_id: authenticationStore.esJefeTecnico ? null : authenticationStore.user.id,
          },
        },
        proyectosEtapas: {
          controller: new ProyectoController(),
          params: {
            campos: 'id,nombre,codigo_proyecto,cliente_id,etapas',
            finalizado: 0,
            filter: `etapas[responsable_id]=${authenticationStore.user.id}&etapas[activo]=1`,
          },
        },
        fiscalizadores: {
          controller: new EmpleadoController(),
          params: { rol: rolesSistema.fiscalizador, campos: 'id,nombres,apellidos' },
        },
        coordinadores: {
          controller: new EmpleadoController(),
          params: { rol: rolesSistema.coordinador, campos: 'id,nombres,apellidos' },
        },
        rutas: {
          controller: new RutaTareaController(),
          params: { activo: 1 },
        },
        motivosSuspendidos: new MotivoSuspendidoController(),
        motivosPausas: new MotivoPausaController(),
        causasIntervenciones: new CausaIntervencionController(),
      })

      listadosAuxiliares.proyectos = [...listadosAuxiliares.proyectos, ...listadosAuxiliares.proyectosEtapas]
    })

    /**********
    * Modales
    **********/
    const modalesTarea = new ComportamientoModalesTarea()
    const modalesSubtarea = new ComportamientoModalesSubtarea()

    /************
     * Variables
     ************/
    const { notificarAdvertencia, prompt, confirmar } = useNotificaciones()
    const paraProyecto = computed(() => tarea.para_cliente_proyecto === destinosTareas.paraProyecto)
    const paraClienteFinal = computed(() => tarea.para_cliente_proyecto === destinosTareas.paraClienteFinal)
    const tab = ref('tarea')
    const tabActual = ref()
    const esCoordinadorBackup = authenticationStore.esCoordinadorBackup
    const clienteFinal = reactive(new ClienteFinal())

    const { btnFinalizarTarea, mostrarSolicitarImagen, imagenSubida, btnVerImagenInforme, refVisorImagen } = useBotonesTablaTarea(mixin)
    const { btnIniciar, btnPausar, btnReanudar, btnRealizar, btnReagendar, btnCancelar, btnFinalizar, btnSeguimiento, btnSuspender, setFiltrarTrabajoAsignado } = useBotonesTablaSubtarea(subtareas, modalesSubtarea, listadosAuxiliares)
    setFiltrarTrabajoAsignado(filtrarSubtareas)

    const proyectoController = new ProyectoController()
    /********
     * Init
     *******/
    // tarea.coordinador = 5

    /*************
    * Validaciones
    **************/
    const reglas = {
      cliente: { required: requiredIf(() => paraClienteFinal.value) },
      titulo: { required },
      proyecto: { required: requiredIf(() => paraProyecto.value) },
      coordinador: { required: requiredIf(() => esCoordinadorBackup && paraClienteFinal.value) },
      ruta_tarea: { required: requiredIf(() => paraClienteFinal.value && tarea.ubicacion_trabajo === ubicacionesTrabajo.ruta) },
      centro_costo: { required: requiredIf(() => paraClienteFinal.value && centros_costos.value.length > 0) },
      // tarea: { requiredIf: requiredIf(() => preingreso.etapa && centros_costos.value.length) },
      // etapa: {
      //   requiredIf: requiredIf(() => { if (etapas.value) return etapas.value.length && preingreso.proyecto })
      // },
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
      proyectos,
      filtrarProyectos,
      tiposTrabajos,
      filtrarTiposTrabajos,
      grupos,
      filtrarGrupos,
      empleados,
      filtrarEmpleados,
      rutas,
      filtrarRutas,
      etapas,
      filtrarEtapas,
    } = useFiltrosListadosTarea(listadosAuxiliares, tarea)
    const { centros_costos, filtrarCentrosCostos } = useFiltrosListadosSelects(listadosAuxiliares)

    /************
    * Funciones
    ************/
    let tabActualTarea = '0'

    function filtrarTarea(tabSeleccionado: string) {
      listar({ finalizado: tabSeleccionado }, false)
      tabActualTarea = tabSeleccionado
    }

    function checkCentroCosto(val, evt) {
      if (val) notificarAdvertencia('No se creará centro de costos ni se asociará la tarea a un centro de costos')
    }


    async function obtenerClienteFinal(clienteFinalId: number) {
      const clienteFinalController = new ClienteFinalController()
      const { result } = await clienteFinalController.consultar(clienteFinalId)
      return result
    }

    async function establecerCliente() {
      tareaStore.tarea.cliente = tarea.cliente
      tarea.tipo_trabajo = null
      tarea.centro_costo = null
      await obtenerRutas()
      //aqui se obtiene los centros de costos del cliente seleccionado
      await obtenerCentrosCostos()
    }

    async function guardado(paginaModal: keyof TareaModales) {
      switch (paginaModal) {
        case 'ProyectoPage':
          const { result } = await proyectoController.listar({ campos: 'id,nombre,codigo_proyecto', finalizado: 0, coordinador_id: authenticationStore.user.id })
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

    const controller = new ClienteFinalController()
    async function obtenerClientesFinales() {
      cargando.activar()
      listadosAuxiliares.clientesFinales = (await controller.listar({ cliente: tarea.cliente })).result
      clientesFinales.value = listadosAuxiliares.clientesFinales
      cargando.desactivar()
    }

    const rutaTareaController = new RutaTareaController()
    async function obtenerRutas() {
      cargando.activar()
      listadosAuxiliares.rutas = (await rutaTareaController.listar({ cliente_id: tarea.cliente })).result
      rutas.value = listadosAuxiliares.rutas
      cargando.desactivar()
    }

    async function obtenerCentrosCostos() {
      cargando.activar()
      listadosAuxiliares.centros_costos = (await (new CentroCostoController().listar({ cliente_id: tarea.cliente, activo: 1 }))).result
      centros_costos.value = listadosAuxiliares.centros_costos
      cargando.desactivar()
    }

    /************
    * Observers
    ************/
    const cargando = new StatusEssentialLoading()

    watch(computed(() => tarea.cliente), async () => {
      clienteFinal.hydrate(new ClienteFinal())

      if (tarea.cliente && paraClienteFinal.value) {
        obtenerClientesFinales()
      }
    })

    // Limpiar proyecto
    watch(paraClienteFinal, () => {
      if (paraClienteFinal.value) {
        tarea.etapa = null
        tarea.proyecto = null
      }
    })

    // Limpiar cliente final y mantenimiento
    watch(paraProyecto, () => {
      if (paraProyecto.value) {
        tarea.fiscalizador = null
        tarea.fecha_solicitud = null
        tarea.ruta_tarea = null
        tarea.cliente_final = null
      }
    })

    watchEffect(async () => {
      if (tarea.cliente_final) {
        cargando.activar()
        const res = await obtenerClienteFinal(tarea.cliente_final)
        clienteFinal.hydrate(res)
        cargando.desactivar()
      } else {
        clienteFinal.hydrate(new ClienteFinal())
      }
    })

    watchEffect(() => {
      if (!tarea.id) subtareas.value = []
    })

    const recargarTareas = computed(() => tareaStore.recargaTareasActivas)
    watch(recargarTareas, () => {
      if (recargarTareas.value) {
        console.log(tabActualTarea)
        if (tabActualTarea == '0') filtrarTarea('0')
        tareaStore.recargaTareasActivas = false
      }
    })

    async function seleccionarProyecto() {
      tarea.cliente = listadosAuxiliares.proyectos.find((proyecto: Proyecto) => proyecto.id === tarea.proyecto).cliente_id
      tarea.etapa = null
      if (tarea.proyecto) obtenerEtapasProyecto(tarea.proyecto)
    }

    async function obtenerEtapasProyecto(idProyecto: number) {
      const etapasProyecto = listadosAuxiliares.proyectos.filter((proyecto: Proyecto) => proyecto.id === tarea.proyecto)[0].etapas
      const etapasResponsable = authenticationStore.esJefeTecnico || authenticationStore.esAdministrador ? etapasProyecto : etapasProyecto.filter((etapa: Etapa) => etapa.responsable === authenticationStore.user.id)
      listadosAuxiliares.etapas = etapasResponsable
      etapas.value = etapasResponsable
    }

    const mostrarLabelModal = computed(() => [acciones.nuevo, acciones.editar].includes(accion.value))

    /*********
     * Hooks
     *********/
    onBeforeGuardar(() => tarea.coordinador = paraProyecto.value ? authenticationStore.user.id : tarea.coordinador)

    onReestablecer(() => {
      clienteFinal.hydrate(new ClienteFinal())
      clientesFinales.value = []
    })

    onConsultado(async () => {
      cargando.activar()
      filtrarSubtareas('')
      proyectos.value = listadosAuxiliares.proyectos
      rutas.value = listadosAuxiliares.rutas
      if (tarea.proyecto_id) obtenerEtapasProyecto(tarea.proyecto_id)
      listadosAuxiliares.centros_costos = (await (new CentroCostoController().listar({ cliente_id: tarea.cliente }))).result
      centros_costos.value = listadosAuxiliares.centros_costos
      cargando.desactivar()
    })

    const btnAgregarSubtarea: CustomActionTable = {
      titulo: 'Agregar subtarea',
      icono: 'bi-plus',
      color: 'positive',
      accion: () => {
        if (!tarea.id) return notificarAdvertencia('Primero debe seleccionar una tarea.')
        if (tarea.finalizado) return notificarAdvertencia('No puede agregar más subtareas porque la tarea ha finalizado.')
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
      listarSubtareas({ tarea_id: tarea.id, estado: estado })
      tabActual.value = estado
    }

    return {
      convertirNumeroPositivo,
      refVisorImagen,
      mixinSubtarea,
      filtrarSubtareas,
      btnIniciar,
      btnPausar,
      btnReanudar,
      btnRealizar,
      btnSeguimiento,
      btnAgregarSubtarea,
      btnConsultarSubtarea,
      btnSuspender,
      subtareas,
      v$,
      tarea,
      accion,
      disabled,
      destinosTareas,
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
      filtrarFiscalizadores,
      filtrarProyectos,
      filtrarTiposTrabajos,
      etapas,
      filtrarEtapas,
      obtenerClienteFinal,
      fiscalizadores,
      coordinadores,
      filtrarCoordinadores,
      rutas,
      filtrarRutas,
      proyectos,
      clienteFinal,
      paraProyecto,
      paraClienteFinal,
      listadosAuxiliares,
      establecerCliente,
      configuracionColumnasClientes,
      seleccionarProyecto,
      modalesTarea,
      modalesSubtarea,
      mostrarLabelModal,
      configuracionColumnasTarea,
      mixin,
      mediosNotificacion,
      tab,
      tabActual,
      // verificarEsVentana,
      grupos,
      filtrarGrupos,
      empleados,
      filtrarEmpleados,
      modosAsignacionTrabajo,
      configuracionColumnasSubtarea,
      columnasSubtareas: [...configuracionColumnasSubtarea, accionesTabla],
      btnReagendar, btnCancelar, btnFinalizar,
      tabOptionsEstadosSubtareas,
      indicatorColor: computed(() => tarea.tiene_subtareas ? 'primary' : 'white'),
      maskFecha,
      guardado,
      // botonFinalizarTarea,
      ubicacionesTrabajo,
      tabOptionsEstadosTareas,
      filtrarTarea,
      esCoordinadorBackup,
      // Botones tareas
      btnFinalizarTarea,
      mostrarSolicitarImagen,
      imagenSubida,
      btnVerImagenInforme,
      obtenerEtapasProyecto,
      acciones,
      centros_costos, filtrarCentrosCostos,
      checkCentroCosto,
    }
  },
})
