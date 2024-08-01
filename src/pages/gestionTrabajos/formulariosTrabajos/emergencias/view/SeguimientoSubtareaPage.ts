// Dependencias
import { configuracionColumnasMaterialOcupadoFormulario } from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/configuracionColumnasMaterialOcupadoFormulario'
import { configuracionColumnasTrabajoRealizado } from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/configuracionColumnasTrabajoRealizado'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { computed, defineComponent, onMounted, reactive, Ref, ref, watch } from 'vue'
import { regiones, atenciones, accionesTabla, estadosTrabajos } from 'config/utils'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { imprimirArchivo, obtenerFechaActual } from 'shared/utils'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { apiConfig, endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

// Componentes
import ArchivoSeguimiento from 'gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/view/ArchivoSeguimiento.vue'
import TablaObservaciones from 'gestionTrabajos/formulariosTrabajos/tablaObservaciones/view/TablaObservacion.vue'
import TablaFilasDinamicas from 'components/tables/view/TablaFilasDinamicas.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import VisorImagen from 'components/VisorImagen.vue'

// Logica y controladores
import { MotivoCanceladoTicketController } from 'pages/gestionTickets/motivosCanceladosTickets/infraestructure/MotivoCanceladoTicketController'
import { ActividadRealizadaSeguimientoSubtareaController } from '../infraestructure/ActividadRealizadaSeguimientoSubtareaController'
import { TicketController } from 'pages/gestionTickets/tickets/infraestructure/TicketController'
import { ArchivoSeguimientoController } from '../infraestructure/ArchivoSeguimientoController'
import { ComportamientoModalesTicketAsignado } from 'pages/gestionTickets/ticketsAsignados/application/ComportamientoModalesTicketAsignado'
import { MaterialOcupadoFormulario } from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/MaterialOcupadoFormulario'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useMaterialesEmpleado } from 'pages/gestionTrabajos/miBodega/application/UseMaterialesEmpleado'
import { useMaterialesProyecto } from 'pages/gestionTrabajos/miBodega/application/UseMaterialesProyecto'
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import { FiltroMiBodegaProyecto } from 'pages/gestionTrabajos/miBodega/domain/FiltroMiBodegaProyecto'
import { FiltroMiBodegaEmpleado } from 'pages/gestionTrabajos/miBodega/domain/FiltroMiBodegaEmpleado'
import ActividadRealizadaSeguimientoSubtarea from '../domain/ActividadRealizadaSeguimientoSubtarea'
import { useBotonesTablaTicket } from 'pages/gestionTickets/tickets/application/BotonesTablaTicket'
import { configuracionColumnasSumaMaterial } from '../domain/configuracionColumnasSumaMaterial'
import { configuracionColumnasSolicitudAts } from '../domain/configuracionColumnasSolicitudAts'
import { useGestionAtsApplication } from '../application/GestionAtsApplication'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { Ticket } from 'pages/gestionTickets/tickets/domain/Ticket'
import { configuracionColumnasResumenMaterialOcupado } from '../domain/configuracionColumnasResumenMaterialOcupado'

export default defineComponent({
  components: {
    EssentialTable,
    SelectorImagen,
    ButtonSubmits,
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
    const mixinArchivoSeguimiento = new ContenedorSimpleMixin(Archivo, new ArchivoSeguimientoController())

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
    const permitirSubir = ![estadosTrabajos.FINALIZADO, estadosTrabajos.PAUSADO, estadosTrabajos.CANCELADO, estadosTrabajos.SUSPENDIDO].includes(trabajoAsignadoStore.subtarea.estado)
    const columnasMaterial = permitirSubir ? [...configuracionColumnasMaterialOcupadoFormulario, accionesTabla] : configuracionColumnasMaterialOcupadoFormulario
    const { prompt } = useNotificaciones()
    const codigoSubtarea = trabajoAsignadoStore.codigoSubtarea
    const rangoFechasHistorial = computed(() => {
      return 'Rango disponible desde ' + trabajoAsignadoStore.subtarea.fecha_hora_ejecucion.substring(0, 10) + ' hasta ' + (trabajoAsignadoStore.subtarea.fecha_hora_finalizacion ?? obtenerFechaActual())
    })

    const mostrarMaterialConStock = ref(true)
    const materialesTareaTodos: Ref<MaterialOcupadoFormulario[]> = ref([])
    const materialesTarea = computed(() => {
      if (mostrarMaterialConStock.value) {
        return materialesTareaTodos.value.filter((material: MaterialOcupadoFormulario) => material.stock_actual)
      } else {
        return materialesTareaTodos.value
      }
    })

    const mostrarMaterialStockConStock = ref(true)
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
    const resumenMaterialSubtareaUsado: Ref<MaterialOcupadoFormulario[]> = ref([])
    const resumenMaterialStockUsado: Ref<MaterialOcupadoFormulario[]> = ref([])

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

    const parametrosGenerales = {
      tarea_id: trabajoAsignadoStore.idTareaSeleccionada,
      subtarea_id: trabajoAsignadoStore.subtarea.id,
      proyecto_id: trabajoAsignadoStore.proyecto_id,
      etapa_id: trabajoAsignadoStore.etapa_id,
      empleado_id: obtenerIdEmpleadoResponsable(),
    }

    // Tickets
    const modales = new ComportamientoModalesTicketAsignado()
    const mixin = new ContenedorSimpleMixin(Ticket, new TicketController())
    const { obtenerListados } = mixin.useComportamiento()
    const { listadosAuxiliares } = mixin.useReferencias()
    obtenerListados({
      motivosCancelados: {
        controller: new MotivoCanceladoTicketController(),
        params: { activo: 1 },
      },
      clientesMaterialesTarea: [],
      clientesMaterialesEmpleado: [],
    })

    const { mostrarSolicitudesAts, consultarTicketsATS, ticketsAts, guardarFilaSolicitudAts } = useGestionAtsApplication(cargarVista)
    const { btnSeguimiento, btnCancelar } = useBotonesTablaTicket(mixin, modales)

    const filtroMiBodegaProyecto = reactive(new FiltroMiBodegaProyecto())
    filtroMiBodegaProyecto.empleado_id = parametrosGenerales.empleado_id
    filtroMiBodegaProyecto.proyecto_id = parametrosGenerales.proyecto_id
    filtroMiBodegaProyecto.etapa_id = parametrosGenerales.etapa_id

    const filtroEmpleado = new FiltroMiBodegaEmpleado()
    filtroEmpleado.empleado_id = parametrosGenerales.empleado_id

    const { consultarClientesMaterialesTarea } = useMaterialesProyecto(filtroMiBodegaProyecto, listadosAuxiliares)
    const { consultarClientesMaterialesEmpleado } = useMaterialesEmpleado(filtroEmpleado, listadosAuxiliares)

    /************
     * Init
     ************/
    listarActividadesRealizadas({ subtarea_id: trabajoAsignadoStore.subtarea.id })
    obtenerFechasHistorialMaterialesUsados()
    obtenerFechasHistorialMaterialesStockUsados()
    obtenerClientesMaterialesTarea()
    obtenerClientesMaterialesEmpleado()
    consultarTicketsATS(subtarea.id)

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
            modelo.id = entidad.id
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
            modelo.id = entidad.id
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
          validacion: (val) => !!val && val >= 0 && val <= entidad.stock_actual + entidad.cantidad_utilizada,
          accion: async (valor) => {
            entidad.cantidad_anterior = entidad.cantidad_utilizada
            entidad.cantidad_utilizada = valor
            const modelo = await actualizarCantidadUtilizadaHistorial(entidad)
            modelo.id = entidad.id
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
          validacion: (val) => !!val && val >= 0 && val <= entidad.stock_actual + entidad.cantidad_utilizada,
          accion: async (valor) => {
            entidad.cantidad_anterior = entidad.cantidad_utilizada
            entidad.cantidad_utilizada = valor
            const modelo = await actualizarCantidadUtilizadaHistorialStock(entidad)
            modelo.id = entidad.id
            historialMaterialStockUsadoPorFecha.value[posicion] = modelo
          }
        }
        prompt(config)
      },
    }

    /************
    * Funciones
    *************/
    async function actualizarCantidadUtilizadaHistorial(material) {
      const params = {
        ...parametrosGenerales,
        detalle_producto_id: material.detalle_producto_id,
        cantidad_utilizada: material.cantidad_utilizada,
        cantidad_anterior: material.cantidad_anterior,
        fecha: fecha_historial.value,
        cliente_id: material.cliente_id,
      }
      const ruta = axios.getEndpoint(endpoints.actualizar_cantidad_utilizada_historial, params)
      const response: AxiosResponse = await axios.post(ruta)
      return response.data.modelo
    }

    async function actualizarCantidadUtilizadaHistorialStock(material) {
      const params = {
        ...parametrosGenerales,
        detalle_producto_id: material.detalle_producto_id,
        cantidad_utilizada: material.cantidad_utilizada,
        cantidad_anterior: material.cantidad_anterior,
        fecha: fecha_historial_stock.value,
        cliente_id: material.cliente_id,
      }

      const ruta = axios.getEndpoint(endpoints.actualizar_cantidad_utilizada_historial_stock, params)
      const response: AxiosResponse = await axios.post(ruta)
      return response.data.modelo
    }

    async function actualizarCantidadUtilizadaTarea(material) {
      const params = {
        ...parametrosGenerales,
        detalle_producto_id: material.detalle_producto_id,
        cantidad_utilizada: material.cantidad_utilizada,
        cantidad_anterior: material.cantidad_anterior,
        fecha: fecha_historial.value,
        cliente_id: material.cliente_id,
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
        cliente_id: material.cliente_id,
      }
      const ruta = axios.getEndpoint(endpoints.actualizar_cantidad_utilizada_stock, params)
      const response: AxiosResponse = await axios.post(ruta)
      return response.data.modelo
    }

    function obtenerIdEmpleadoResponsable() {
      if (esLider) return authenticationStore.user.id
      else return trabajoAsignadoStore.subtarea.empleado_responsable_id
    }

    async function obtenerMaterialesTarea(cliente: number) {
      cargarVista(async () => {
        const filtro = {
          tarea_id: trabajoAsignadoStore.subtarea.tarea_id,
          subtarea_id: trabajoAsignadoStore.subtarea.id,
          empleado_id: obtenerIdEmpleadoResponsable(),
          cliente_id: cliente,
          proyecto_id: subtarea.proyecto_id,
          etapa_id: subtarea.etapa_id,
        }

        if (!subtarea.proyecto_id) delete filtro.proyecto_id
        if (!subtarea.etapa_id) delete filtro.etapa_id
        if (subtarea.etapa_id) delete filtro.tarea_id

        const ruta = axios.getEndpoint(endpoints.materiales_empleado_tarea, filtro)
        const response: AxiosResponse = await axios.get(ruta)
        materialesTareaTodos.value = response.data.results
      })
    }

    function obtenerMaterialesStock(cliente: number) {
      cargarVista(async () => {
        const ruta = axios.getEndpoint(endpoints.materiales_empleado, { empleado_id: obtenerIdEmpleadoResponsable(), subtarea_id: trabajoAsignadoStore.subtarea.id, cliente_id: cliente })
        const response: AxiosResponse = await axios.get(ruta)
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
      consultarClientesMaterialesEmpleado({ empleado_id: obtenerIdEmpleadoResponsable() })
    }

    async function obtenerClientesMaterialesTarea() {
      if (parametrosGenerales.proyecto_id && parametrosGenerales.etapa_id) consultarClientesMaterialesTarea({ proyecto_id: parametrosGenerales.proyecto_id, etapa_id: parametrosGenerales.etapa_id, filtrar_por_etapa: true })
      else if (parametrosGenerales.proyecto_id) consultarClientesMaterialesTarea({ proyecto_id: parametrosGenerales.proyecto_id, etapa_id: parametrosGenerales.etapa_id, filtrar_por_proyecto: true })
      else consultarClientesMaterialesTarea({ tarea_id: subtarea.tarea_id, filtrar_por_tarea: true })
    }

    async function descargarExcel() {
      const ruta = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.exportExcelSeguimiento) + '/' + subtarea.id
      imprimirArchivo(ruta, 'GET', 'blob', 'xlsx', 'reporte_hoy_')
    }

    function subirArchivos() {
      refArchivoSeguimiento.value.subir({ subtarea_id: trabajoAsignadoStore.subtarea.id })
    }

    function resetearFiltroHistorialTarea() {
      fecha_historial.value = null
      historialMaterialTareaUsadoPorFecha.value = []
    }

    function resetearFiltroHistorialStock() {
      fecha_historial_stock.value = null
      historialMaterialStockUsadoPorFecha.value = []
    }

    function guardarFilaActividad(data) {
      actividad.hydrate(data)
      actividad.subtarea = trabajoAsignadoStore.subtarea.id
      guardarActividad(actividad)
    }

    function actualizarTablaMaterialesTarea() {
      clienteMaterialTarea.value = undefined
      materialesTareaTodos.value = []
    }

    const actualizarTablaResumenMaterialesTarea = () => {
      cargarVista(async () => {
        const ruta = axios.getEndpoint(endpoints.obtener_resumen_material_subtarea_usado, { subtarea_id: trabajoAsignadoStore.subtarea.id, empleado_id: obtenerIdEmpleadoResponsable() })
        const response: AxiosResponse = await axios.get(ruta)
        resumenMaterialSubtareaUsado.value = response.data.results.filter((material: MaterialOcupadoFormulario) => material.total_cantidad_utilizada > 0)
      })
    }

    const actualizarTablaResumenMaterialesStock = () => {
      cargarVista(async () => {
        const ruta = axios.getEndpoint(endpoints.obtener_resumen_material_stock_usado, { subtarea_id: trabajoAsignadoStore.subtarea.id, empleado_id: obtenerIdEmpleadoResponsable() })
        const response: AxiosResponse = await axios.get(ruta)
        resumenMaterialStockUsado.value = response.data.results.filter((material: MaterialOcupadoFormulario) => material.total_cantidad_utilizada > 0)
      })
    }

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

    return {
      refVisorImagen,
      refTrabajos,
      refObservaciones,
      refArchivoSeguimiento,
      mixinArchivoSeguimiento,
      utilizarMateriales,
      existeMaterialesDevolucion,
      existeObservaciones,
      usarMaterialStock,
      usarMaterialTarea,
      columnasMaterial,
      configuracionColumnasResumenMaterialOcupado,
      configuracionColumnasMaterialOcupadoFormulario,
      configuracionColumnasSumaMaterial,
      materialesTarea,
      materialesStock,
      sumaMaterialesTareaUsado,
      historialMaterialTareaUsadoPorFecha,
      historialMaterialStockUsadoPorFecha,
      resumenMaterialSubtareaUsado,
      resumenMaterialStockUsado,
      obtenerHistorialMaterialTareaUsadoPorFecha,
      botonEditarCantidadTarea,
      botonEditarCantidadStock,
      botonEditarCantidadTareaHistorial,
      botonEditarCantidadStockHistorial,
      regiones,
      atenciones,
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
      mostrarMaterialStock: subtarea.proyecto_id === null,
      mostrarBotonSubir: computed(() => refArchivoSeguimiento.value?.quiero_subir_archivos),
      subirArchivos,
      fechasHistorialMaterialesUsados,
      fechasHistorialMaterialesStockUsados,
      resetearFiltroHistorialTarea,
      resetearFiltroHistorialStock,
      clienteMaterialStock,
      clienteMaterialTarea,
      obtenerMaterialesStock,
      obtenerMaterialesTarea,
      clientesMaterialesTarea,
      listadosAuxiliares,
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
      mostrarSolicitudesAts,
      actualizarTablaMaterialesTarea,
      actualizarTablaResumenMaterialesTarea,
      actualizarTablaResumenMaterialesStock,
    }
  }
})
