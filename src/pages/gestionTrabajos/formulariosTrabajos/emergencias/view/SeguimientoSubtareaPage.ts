// Dependencias
import { configuracionColumnasMaterialOcupadoFormulario } from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/configuracionColumnasMaterialOcupadoFormulario'
import { configuracionColumnasTrabajoRealizado } from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/configuracionColumnasTrabajoRealizado'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { regiones, atenciones, accionesTabla, estadosTrabajos } from 'config/utils'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { computed, defineComponent, onMounted, Ref, ref, watch } from 'vue'
import { useNotificaciones } from 'shared/notificaciones'
import { apiConfig, endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

// Componentes
import ArchivoSeguimiento from 'gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/view/ArchivoSeguimiento.vue'
import TablaObservaciones from 'gestionTrabajos/formulariosTrabajos/tablaObservaciones/view/TablaObservacion.vue'
import TablaDevolucionProducto from 'components/tables/view/TablaDevolucionProducto.vue'
import TablaFilasDinamicas from 'components/tables/view/TablaFilasDinamicas.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import VisorImagen from 'components/VisorImagen.vue'

// Logica y controladores
import { ActividadRealizadaSeguimientoSubtareaController } from '../infraestructure/ActividadRealizadaSeguimientoSubtareaController'
import { MaterialOcupadoFormulario } from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/MaterialOcupadoFormulario'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import ActividadRealizadaSeguimientoSubtarea from '../domain/ActividadRealizadaSeguimientoSubtarea'
import { configuracionColumnasSumaMaterial } from '../domain/configuracionColumnasSumaMaterial'
import { ArchivoSeguimientoController } from '../infraestructure/ArchivoSeguimientoController'
import { EmergenciaController } from '../infraestructure/EmergenciaController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { imprimirArchivo, obtenerFechaActual } from 'shared/utils'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { useAuthenticationStore } from 'stores/authentication'
import { Emergencia } from '../domain/Emergencia'
import { useGestionAtsApplication } from '../application/GestionAtsApplication'
import { configuracionColumnasTicket } from 'pages/gestionTickets/tickets/domain/configuracionColumnasTicket'
import { configuracionColumnasSolicitudAts } from '../domain/configuracionColumnasSolicitudAts'
import { Ticket } from 'pages/gestionTickets/tickets/domain/Ticket'
import { useBotonesTablaTicket } from 'pages/gestionTickets/tickets/application/BotonesTablaTicket'
import { ComportamientoModalesTicketAsignado } from 'pages/gestionTickets/ticketsAsignados/application/ComportamientoModalesTicketAsignado'
import { TicketController } from 'pages/gestionTickets/tickets/infraestructure/TicketController'
import { MotivoCanceladoTicketController } from 'pages/gestionTickets/motivosCanceladosTickets/infraestructure/MotivoCanceladoTicketController'

export default defineComponent({
  components: {
    EssentialTable,
    SelectorImagen,
    ButtonSubmits,
    TablaDevolucionProducto,
    TablaObservaciones,
    ArchivoSeguimiento,
    TablaFilasDinamicas,
    VisorImagen,
    ModalesEntidad,
  },
  props: {
    mixinModal: {
      type: Object as () => ContenedorSimpleMixin<Subtarea>,
      required: true,
    },
  },
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const trabajoAsignadoStore = useTrabajoAsignadoStore()
    const authenticationStore = useAuthenticationStore()

    /********
    * Mixin
    *********/
    /* const mixin = new ContenedorSimpleMixin(Emergencia, new EmergenciaController())
    const { entidad: emergencia, accion, listadosAuxiliares } = mixin.useReferencias()
    const { guardar, editar, reestablecer, setValidador, cargarVista } = mixin.useComportamiento()
    const { onBeforeGuardar, onBeforeModificar, onGuardado, onModificado } = mixin.useHooks() */

    const mixinArchivoSeguimiento = new ContenedorSimpleMixin(Archivo, new ArchivoSeguimientoController())
    const { listar: listarSubtareas } = props.mixinModal.useComportamiento()

    const mixinActividad = new ContenedorSimpleMixin(ActividadRealizadaSeguimientoSubtarea, new ActividadRealizadaSeguimientoSubtareaController())
    const { entidad: actividad, listado: actividadesRealizadas } = mixinActividad.useReferencias()
    const { guardar: guardarActividad, listar: listarActividadesRealizadas, cargarVista } = mixinActividad.useComportamiento()

    /************
     * Variables
     ************/
    const refTrabajos = ref()
    const refVisorImagen = ref()
    const refObservaciones = ref()
    const utilizarMateriales = ref(false)
    const existeMaterialesDevolucion = ref(false)
    const existeObservaciones = ref(false)
    const usarMaterialTarea = ref(false)
    const usarMaterialStock = ref(false)
    const permitirSubir = ![estadosTrabajos.FINALIZADO, estadosTrabajos.PAUSADO].includes(trabajoAsignadoStore.subtarea.estado)
    const columnasMaterial = permitirSubir ? [...configuracionColumnasMaterialOcupadoFormulario, accionesTabla] : configuracionColumnasMaterialOcupadoFormulario
    const { prompt, notificarAdvertencia } = useNotificaciones()
    const codigoSubtarea = trabajoAsignadoStore.codigoSubtarea
    const rangoFechasHistorial = computed(() => {
      return 'Rango disponible desde ' + trabajoAsignadoStore.subtarea.fecha_hora_ejecucion.substring(0, 10) + ' hasta ' + (trabajoAsignadoStore.subtarea.fecha_hora_finalizacion ?? obtenerFechaActual())
    })

    const mostrarMaterialConStock = ref(false)
    const materialesTareaTodos: Ref<MaterialOcupadoFormulario[]> = ref([])
    const materialesTarea = computed(() => {
      if (mostrarMaterialConStock.value) {
        return materialesTareaTodos.value.filter((material: MaterialOcupadoFormulario) => material.stock_actual)
      } else {
        return materialesTareaTodos.value
      }
    })

    const mostrarMaterialStockConStock = ref(false)
    const materialesStockTodos: Ref<MaterialOcupadoFormulario[]> = ref([])
    const materialesStock = computed(() => {
      if (mostrarMaterialStockConStock.value) {
        return materialesStockTodos.value.filter((material: MaterialOcupadoFormulario) => material.stock_actual)
      } else {
        return materialesStockTodos.value
      }
    })

    const sumaMaterialesTareaUsado: Ref<MaterialOcupadoFormulario[]> = ref([])
    const historialMaterialTareaUsadoPorFecha: Ref<MaterialOcupadoFormulario[]> = ref([])
    const historialMaterialStockUsadoPorFecha: Ref<MaterialOcupadoFormulario[]> = ref([])

    const esLider = authenticationStore.esTecnicoLider
    const esCoordinador = authenticationStore.esCoordinador || authenticationStore.esJefeTecnico || authenticationStore.esCoordinadorBackup
    const refArchivoSeguimiento = ref()
    const subtarea = trabajoAsignadoStore.subtarea
    const fecha_historial = ref()
    const fecha_historial_stock = ref()
    const clienteMaterialStock = ref()
    const clienteMaterialTarea = ref()
    const fechasHistorialMaterialesUsados = ref([])
    const fechasHistorialMaterialesStockUsados = ref([])
    const clientes = ref([])
    const clientesMaterialesTarea = ref([])

    const axios = AxiosHttpRepository.getInstance()

    // Tickets
    const modales = new ComportamientoModalesTicketAsignado()
    const mixin = new ContenedorSimpleMixin(Ticket, new TicketController())
    const { obtenerListados } = mixin.useComportamiento()
    obtenerListados({
      motivosCancelados: {
        controller: new MotivoCanceladoTicketController(),
        params: { activo: 1 },
      }
    })

    const { consultarTicketsATS, ticketsAts, guardarFilaSolicitudAts } = useGestionAtsApplication(cargarVista)
    const { btnSeguimiento, btnCancelar } = useBotonesTablaTicket(mixin, modales)

    const listados = {
      ticketsAts: [],
    }

    /************
     * Init
     ************/
    listarActividadesRealizadas({ subtarea_id: trabajoAsignadoStore.subtarea.id })
    obtenerFechasHistorialMaterialesUsados()
    obtenerFechasHistorialMaterialesStockUsados()
    obtenerClientesMaterialesTarea()
    obtenerClientesMaterialesEmpleado()
    // listados.ticketsAts.push(gestionAtsApplication.obtenerTicketsATS())
    consultarTicketsATS(subtarea.id)
    seleccionarClienteMaterialTarea()
    seleccionarClienteMaterialStock()

    onMounted(() => refArchivoSeguimiento.value.listarArchivos({ subtarea_id: trabajoAsignadoStore.subtarea.id }))

    /****************
     * Botones tabla
     ****************/
    const botonEditarCantidadTarea: CustomActionTable = {
      titulo: 'Cantidad utilizada',
      icono: 'bi-pencil-square',
      color: 'primary',
      visible: () => permitirSubir,
      accion: ({ entidad, posicion }) => {
        //
        const config: CustomActionPrompt = {
          titulo: 'Confirmación',
          mensaje: 'Ingresa la cantidad',
          defecto: materialesTarea.value[posicion].cantidad_utilizada,
          tipo: 'number',
          validacion: (val) => !!val && val >= 0 && val <= entidad.stock_actual + (entidad.cantidad_utilizada ?? 0),
          accion: async (valor) => {
            entidad.cantidad_anterior = entidad.cantidad_utilizada ?? 0
            entidad.cantidad_utilizada = valor
            const modelo = await actualizarCantidadUtilizadaTarea(entidad)
            materialesTarea.value[posicion] = modelo
          }
        }
        prompt(config)
      },
    }

    const botonEditarCantidadStock: CustomActionTable = {
      titulo: 'Cantidad utilizada',
      icono: 'bi-pencil-square',
      color: 'primary',
      visible: () => permitirSubir,
      accion: ({ entidad, posicion }) => {
        const config: CustomActionPrompt = {
          titulo: 'Confirmación',
          mensaje: 'Ingresa la cantidad',
          defecto: materialesStock.value[posicion].cantidad_utilizada,
          tipo: 'number',
          validacion: (val) => !!val && val >= 0 && val <= entidad.stock_actual + (entidad.cantidad_utilizada ?? 0),
          accion: async (valor) => {
            entidad.cantidad_anterior = entidad.cantidad_utilizada ?? 0
            entidad.cantidad_utilizada = valor
            const modelo = await actualizarCantidadUtilizadaStock(entidad)
            materialesStock.value[posicion] = modelo
          }
        }
        prompt(config)
      },
    }

    const verFotografia: CustomActionTable = {
      titulo: 'Ver fotografía',
      icono: 'bi-image-fill',
      color: 'secondary',
      visible: ({ entidad }) => entidad.fotografia,
      accion: async ({ entidad }) => {
        refVisorImagen.value.abrir(entidad.fotografia)
      }
    }

    const botonEditarCantidadTareaHistorial: CustomActionTable = {
      titulo: 'Cantidad utilizada',
      icono: 'bi-pencil-square',
      color: 'primary',
      visible: () => permitirSubir,
      accion: ({ entidad, posicion }) => {
        const config: CustomActionPrompt = {
          titulo: 'Confirmación',
          mensaje: 'Ingresa la cantidad',
          defecto: historialMaterialTareaUsadoPorFecha.value[posicion].cantidad_utilizada,
          tipo: 'number',
          validacion: (val) => !!val && val >= 0 && val <= entidad.stock_actual + entidad.cantidad_utilizada, //(accion.value === acciones.nuevo ? val <= entidad.stock_actual : true),
          accion: async (valor) => {
            entidad.cantidad_anterior = entidad.cantidad_utilizada
            entidad.cantidad_utilizada = valor
            const modelo = await actualizarCantidadUtilizadaHistorial(entidad)
            historialMaterialTareaUsadoPorFecha.value[posicion] = modelo
          }
        }
        prompt(config)
      },
    }

    const botonEditarCantidadStockHistorial: CustomActionTable = {
      titulo: 'Cantidad utilizada',
      icono: 'bi-pencil-square',
      color: 'primary',
      visible: () => permitirSubir,
      accion: ({ entidad, posicion }) => {
        const config: CustomActionPrompt = {
          titulo: 'Confirmación',
          mensaje: 'Ingresa la cantidad',
          defecto: historialMaterialStockUsadoPorFecha.value[posicion].cantidad_utilizada,
          tipo: 'number',
          validacion: (val) => !!val && val >= 0 && val <= entidad.stock_actual + entidad.cantidad_utilizada, //(accion.value === acciones.nuevo ? val <= entidad.stock_actual : true),
          accion: async (valor) => {
            entidad.cantidad_anterior = entidad.cantidad_utilizada
            entidad.cantidad_utilizada = valor
            const modelo = await actualizarCantidadUtilizadaHistorialStock(entidad)
            historialMaterialStockUsadoPorFecha.value[posicion] = modelo
          }
        }
        prompt(config)
      },
    }

    /*************
    * Validaciones
    **************/
    /* const reglas = {
      // regional: { required },
    }

    const v$ = useVuelidate(reglas, emergencia)
    setValidador(v$.value) */

    /************
    * Funciones
    *************/
    async function actualizarCantidadUtilizadaHistorial(material) {
      const params = {
        tarea_id: trabajoAsignadoStore.idTareaSeleccionada,
        subtarea_id: trabajoAsignadoStore.subtarea.id,
        empleado_id: obtenerIdEmpleadoResponsable(),
        detalle_producto_id: material.detalle_producto_id,
        cantidad_utilizada: material.cantidad_utilizada,
        cantidad_anterior: material.cantidad_anterior,
        fecha: fecha_historial.value,
      }
      const ruta = axios.getEndpoint(endpoints.actualizar_cantidad_utilizada_historial, params)
      const response: AxiosResponse = await axios.post(ruta)
      return response.data.modelo
    }

    async function actualizarCantidadUtilizadaHistorialStock(material) {
      const params = {
        tarea_id: trabajoAsignadoStore.idTareaSeleccionada,
        subtarea_id: trabajoAsignadoStore.subtarea.id,
        empleado_id: obtenerIdEmpleadoResponsable(),
        detalle_producto_id: material.detalle_producto_id,
        cantidad_utilizada: material.cantidad_utilizada,
        cantidad_anterior: material.cantidad_anterior,
        fecha: fecha_historial_stock.value,
      }
      const ruta = axios.getEndpoint(endpoints.actualizar_cantidad_utilizada_historial_stock, params)
      const response: AxiosResponse = await axios.post(ruta)
      return response.data.modelo
    }

    async function actualizarCantidadUtilizadaTarea(material) {
      const params = {
        tarea_id: trabajoAsignadoStore.idTareaSeleccionada,
        subtarea_id: trabajoAsignadoStore.subtarea.id,
        empleado_id: obtenerIdEmpleadoResponsable(),
        detalle_producto_id: material.detalle_producto_id,
        cantidad_utilizada: material.cantidad_utilizada,
        cantidad_anterior: material.cantidad_anterior,
        fecha: fecha_historial.value,
      }
      const ruta = axios.getEndpoint(endpoints.actualizar_cantidad_utilizada_tarea, params)
      const response: AxiosResponse = await axios.post(ruta)
      return response.data.modelo
    }

    async function actualizarCantidadUtilizadaStock(material) {
      const params = {
        subtarea_id: trabajoAsignadoStore.subtarea.id,
        empleado_id: obtenerIdEmpleadoResponsable(),
        detalle_producto_id: material.detalle_producto_id,
        cantidad_utilizada: material.cantidad_utilizada,
        cantidad_anterior: material.cantidad_anterior,
        fecha: fecha_historial.value,
      }
      const ruta = axios.getEndpoint(endpoints.actualizar_cantidad_utilizada_stock, params)
      const response: AxiosResponse = await axios.post(ruta)
      return response.data.modelo
    }

    function obtenerIdEmpleadoResponsable() {
      if (esLider) return authenticationStore.user.id
      else return trabajoAsignadoStore.subtarea.empleado_responsable_id // idEmpleadoResponsable
    }

    async function obtenerMaterialesTarea(cliente: number) {
      cargarVista(async () => {
        const ruta = axios.getEndpoint(endpoints.materiales_empleado_tarea, { tarea_id: trabajoAsignadoStore.subtarea.tarea_id, subtarea_id: trabajoAsignadoStore.subtarea.id, empleado_id: obtenerIdEmpleadoResponsable(), cliente_id: cliente, seguimiento: 1 })
        const response: AxiosResponse = await axios.get(ruta)
        // materialesTarea.value = response.data.results
        materialesTareaTodos.value = response.data.results
      })
    }

    function obtenerMaterialesStock(cliente: number) {
      cargarVista(async () => {
        const ruta = axios.getEndpoint(endpoints.materiales_empleado, { empleado_id: obtenerIdEmpleadoResponsable(), subtarea_id: trabajoAsignadoStore.subtarea.id, cliente_id: cliente })
        const response: AxiosResponse = await axios.get(ruta)
        // materialesStock.value = response.data.results
        materialesStockTodos.value = response.data.results
      })
    }

    function obtenerHistorialMaterialTareaUsadoPorFecha(fecha: string) {
      cargarVista(async () => {
        const ruta = axios.getEndpoint(endpoints.obtener_historial_material_tarea_usado_por_fecha, { fecha, subtarea_id: trabajoAsignadoStore.subtarea.id, empleado_id: obtenerIdEmpleadoResponsable() })
        const response: AxiosResponse = await axios.get(ruta)
        historialMaterialTareaUsadoPorFecha.value = response.data.results
      })
    }

    function obtenerHistorialMaterialStockUsadoPorFecha(fecha: string) {
      cargarVista(async () => {
        const ruta = axios.getEndpoint(endpoints.obtener_historial_material_stock_usado_por_fecha, { fecha, subtarea_id: trabajoAsignadoStore.subtarea.id, empleado_id: obtenerIdEmpleadoResponsable() })
        const response: AxiosResponse = await axios.get(ruta)
        historialMaterialStockUsadoPorFecha.value = response.data.results
      })
    }

    function obtenerFechasHistorialMaterialesUsados() {
      cargarVista(async () => {
        const ruta = axios.getEndpoint(endpoints.fechas_historial_materiales_usados) + '/' + trabajoAsignadoStore.subtarea.id
        const response: AxiosResponse = await axios.get(ruta)
        fechasHistorialMaterialesUsados.value = response.data.results
      })
    }

    function obtenerFechasHistorialMaterialesStockUsados() {
      cargarVista(async () => {
        const ruta = axios.getEndpoint(endpoints.fechas_historial_materiales_stock_usados) + '/' + trabajoAsignadoStore.subtarea.id
        const response: AxiosResponse = await axios.get(ruta)
        fechasHistorialMaterialesStockUsados.value = response.data.results
      })
    }

    function obtenerClientesMaterialesEmpleado() {
      cargarVista(async () => {
        const ruta = axios.getEndpoint(endpoints.obtener_clientes_materiales_empleado) + '/' + obtenerIdEmpleadoResponsable()
        const response: AxiosResponse = await axios.get(ruta)
        clientes.value = response.data.results
      })
    }

    function obtenerClientesMaterialesTarea() {
      cargarVista(async () => {
        const ruta = axios.getEndpoint(endpoints.obtener_clientes_materiales_tarea) + '/' + obtenerIdEmpleadoResponsable()
        const response: AxiosResponse = await axios.get(ruta)
        clientesMaterialesTarea.value = response.data.results
      })
    }

    // Antes de guardar y editar seguimiento
    function filtrarMaterialesTareaOcupados() {
      return materialesTarea.value.filter((material: any) => material.hasOwnProperty('cantidad_utilizada')) // && material.cantidad_utilizada > 0)
    }

    function filtrarMaterialesStockOcupados() {
      return materialesStock.value.filter((material: any) => material.hasOwnProperty('cantidad_utilizada')) // && material.cantidad_utilizada > 0)
    }

    async function descargarExcel() {
      console.log(subtarea)
      const ruta = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.exportExcelSeguimiento) + '/' + subtarea.id
      imprimirArchivo(ruta, 'GET', 'blob', 'xlsx', 'reporte_hoy_')
    }

    /* async function guardarSeguimiento() {
      guardar(emergencia, true, { empleado_id: obtenerIdEmpleadoResponsable(), tarea_id: trabajoAsignadoStore.idTareaSeleccionada, grupo: trabajoAsignadoStore.subtarea.grupo }).catch((e) => {
        notificarAdvertencia('Ingrese al menos una actividad para guardar.')
      })
    } */

    function subirArchivos() {
      refArchivoSeguimiento.value.subir({ subtarea_id: trabajoAsignadoStore.subtarea.id })
    }

    let cerrarModal = true
    function resetearFiltroHistorialTarea() {
      fecha_historial.value = null
      historialMaterialTareaUsadoPorFecha.value = []
    }

    function resetearFiltroHistorialStock() {
      fecha_historial_stock.value = null
      historialMaterialStockUsadoPorFecha.value = []
    }

    /* function editarSeguimiento(cerrarVentanaModal = true) {
      if (permitirSubir) {
        cerrarModal = cerrarVentanaModal
        fecha_historial.value = null
        historialMaterialTareaUsadoPorFecha.value = []
        editar(emergencia, cerrarModal, { empleado_id: obtenerIdEmpleadoResponsable(), tarea_id: trabajoAsignadoStore.idTareaSeleccionada, grupo: trabajoAsignadoStore.subtarea.grupo })
      }
    } */

    function guardarFilaActividad(data) {
      actividad.hydrate(data)
      actividad.subtarea = trabajoAsignadoStore.subtarea.id
      guardarActividad(actividad)
    }

    function seleccionarClienteMaterialTarea() {
      clienteMaterialTarea.value = subtarea.cliente_id

      obtenerMaterialesTarea(clienteMaterialTarea.value)
    }

    function seleccionarClienteMaterialStock() {
      clienteMaterialStock.value = subtarea.cliente_id

      obtenerMaterialesStock(clienteMaterialStock.value)
    }

    /**********
     * Filtros
     **********/
    // const { filtrarClientes } = useFiltrosListadosSelects(listadosAuxiliares)

    /*************
     * Observers
     *************/
    watch(fecha_historial, () => {
      if (fecha_historial.value) {
        obtenerHistorialMaterialTareaUsadoPorFecha(
          fecha_historial.value
        )
      }
    })

    watch(fecha_historial_stock, () => {
      if (fecha_historial_stock.value) {
        obtenerHistorialMaterialStockUsadoPorFecha(
          fecha_historial_stock.value
        )
      }
    })

    /********
    * Hooks
    *********/
    /* onBeforeGuardar(() => {
      emergencia.materiales_tarea_ocupados = filtrarMaterialesTareaOcupados()
      emergencia.materiales_stock_ocupados = filtrarMaterialesStockOcupados()
      emergencia.subtarea = trabajoAsignadoStore.idSubtareaSeleccionada
    })

    onBeforeModificar(() => {
      emergencia.materiales_tarea_ocupados = filtrarMaterialesTareaOcupados()
      emergencia.materiales_stock_ocupados = filtrarMaterialesStockOcupados()
      emergencia.subtarea = trabajoAsignadoStore.idSubtareaSeleccionada
    })

    onGuardado((id: number) => {
      listarSubtareas({ estado: estadosTrabajos.EJECUTANDO })
      emit('cerrar-modal', false)
    })

    onModificado((id: number) => {
      if (cerrarModal) emit('cerrar-modal', false)
    }) */

    return {
      // v$,
      refVisorImagen,
      refTrabajos,
      refObservaciones,
      refArchivoSeguimiento,
      mixinArchivoSeguimiento,
      /* emergencia,
      accion,
      guardarSeguimiento,
      editarSeguimiento, */
      utilizarMateriales,
      existeMaterialesDevolucion,
      existeObservaciones,
      usarMaterialStock,
      usarMaterialTarea,
      columnasMaterial,
      configuracionColumnasMaterialOcupadoFormulario,
      configuracionColumnasSumaMaterial,
      materialesTarea,
      materialesStock,
      sumaMaterialesTareaUsado,
      historialMaterialTareaUsadoPorFecha,
      historialMaterialStockUsadoPorFecha,
      obtenerHistorialMaterialTareaUsadoPorFecha,
      botonEditarCantidadTarea,
      botonEditarCantidadStock,
      botonEditarCantidadTareaHistorial,
      botonEditarCantidadStockHistorial,
      regiones,
      atenciones,
      /* guardar,
      editar,
      reestablecer,
      listadosAuxiliares,*/
      emit,
      codigoSubtarea,
      esLider,
      esCoordinador,
      descargarExcel,
      endpoint: endpoints.archivos_seguimientos,
      ActividadRealizadaSeguimientoSubtarea,
      configuracionColumnasTrabajoRealizado,
      verFotografia,
      clientes,
      subtarea,
      permitirSubir,
      tab: ref('usar_material_tarea'),
      tabMaterialStock: ref('usar_material_stock'),
      tabsMateriales: ref('historial'),
      fecha_historial,
      fecha_historial_stock,
      rangoFechasHistorial,
      actividadesRealizadas,
      guardarFilaActividad,
      mostrarBotonSubir: computed(() => refArchivoSeguimiento.value?.quiero_subir_archivos),
      subirArchivos,
      fechasHistorialMaterialesUsados,
      fechasHistorialMaterialesStockUsados,
      resetearFiltroHistorialTarea,
      resetearFiltroHistorialStock,
      // filtrarClientes,
      clienteMaterialStock,
      clienteMaterialTarea,
      obtenerMaterialesStock,
      obtenerMaterialesTarea,
      clientesMaterialesTarea,
      // tickets ATS
      ticketsAts,
      configuracionColumnasSolicitudAts,
      Ticket,
      guardarFilaSolicitudAts,
      btnSeguimiento,
      btnCancelar,
      modales,
      mostrarMaterialConStock,
      mostrarMaterialStockConStock,
    }
  }
})
