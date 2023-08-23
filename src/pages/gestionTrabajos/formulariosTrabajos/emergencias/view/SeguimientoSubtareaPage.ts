// Dependencias
import { configuracionColumnasMaterialOcupadoFormulario } from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/configuracionColumnasMaterialOcupadoFormulario'
import { regiones, atenciones, accionesTabla, acciones, estadosTrabajos } from 'config/utils'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { apiConfig, endpoints } from 'config/api'
import { computed, defineComponent, onMounted, Ref, ref, watch } from 'vue'
import useVuelidate from '@vuelidate/core'
import { AxiosResponse } from 'axios'
import { configuracionColumnasTrabajoRealizado } from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/configuracionColumnasTrabajoRealizado'

// Componentes
import ArchivoSeguimiento from 'gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/view/ArchivoSeguimiento.vue'
import TablaObservaciones from 'gestionTrabajos/formulariosTrabajos/tablaObservaciones/view/TablaObservacion.vue'
import TablaDevolucionProducto from 'components/tables/view/TablaDevolucionProducto.vue'
import TablaFilasDinamicas from 'components/tables/view/TablaFilasDinamicas.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import VisorImagen from 'components/VisorImagen.vue'

// Logica y controladores
import { MaterialOcupadoFormulario } from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/MaterialOcupadoFormulario'
import { MaterialEmpleadoController } from 'pages/gestionTrabajos/miBodega/infraestructure/MaterialEmpleadoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import { ProductoController } from 'pages/bodega/productos/infraestructure/ProductoController'
import { ArchivoSeguimientoController } from '../infraestructure/ArchivoSeguimientoController'
import { EmergenciaController } from '../infraestructure/EmergenciaController'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { useAuthenticationStore } from 'stores/authentication'
import { Emergencia } from '../domain/Emergencia'
import { imprimirArchivo, obtenerFechaActual } from 'shared/utils'
import { clientes } from 'config/clientes'
import { configuracionColumnasSumaMaterial } from '../domain/configuracionColumnasSumaMaterial'
import ActividadRealizadaSeguimientoSubtarea from '../domain/ActividadRealizadaSeguimientoSubtarea'
import { ActividadRealizadaSeguimientoSubtareaController } from '../infraestructure/ActividadRealizadaSeguimientoSubtareaController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

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
    const mixin = new ContenedorSimpleMixin(Emergencia, new EmergenciaController())
    const { entidad: emergencia, accion, listadosAuxiliares } = mixin.useReferencias()
    const { consultar, guardar, editar, reestablecer, setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
    const { onBeforeGuardar, onConsultado, onBeforeModificar, onGuardado, onModificado } = mixin.useHooks()

    const mixinArchivoSeguimiento = new ContenedorSimpleMixin(Archivo, new ArchivoSeguimientoController())
    const { listar: listarSubtareas } = props.mixinModal.useComportamiento()

    const mixinActividad = new ContenedorSimpleMixin(ActividadRealizadaSeguimientoSubtarea, new ActividadRealizadaSeguimientoSubtareaController())
    const { entidad: actividad, listado: actividadesRealizadas } = mixinActividad.useReferencias()
    const { guardar: guardarActividad, listar: listarActividadesRealizadas } = mixinActividad.useComportamiento()

    /* cargarVista(async () => {
      await obtenerListados({
        productos: new ProductoController(),
      })
    }) */

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
    const usarStock = ref(false)
    const permitirSubir = ![estadosTrabajos.REALIZADO, estadosTrabajos.FINALIZADO, estadosTrabajos.PAUSADO].includes(trabajoAsignadoStore.subtarea.estado)
    const columnasMaterial = permitirSubir ? [...configuracionColumnasMaterialOcupadoFormulario, accionesTabla] : configuracionColumnasMaterialOcupadoFormulario
    const { prompt, notificarAdvertencia } = useNotificaciones()
    const codigoSubtarea = trabajoAsignadoStore.codigoSubtarea
    const rangoFechasHistorial = computed(() => {
      return 'Rango disponible desde ' + trabajoAsignadoStore.subtarea.fecha_hora_ejecucion.substring(0, 10) + ' hasta ' + (trabajoAsignadoStore.subtarea.fecha_hora_finalizacion ?? obtenerFechaActual())
    })

    const materialesTarea: Ref<MaterialOcupadoFormulario[]> = ref([])
    const materialesStock: Ref<MaterialOcupadoFormulario[]> = ref([])
    const sumaMaterialesTareaUsado: Ref<MaterialOcupadoFormulario[]> = ref([])
    const historialMaterialTareaUsadoPorFecha: Ref<MaterialOcupadoFormulario[]> = ref([])

    const materialEmpleadoController = new MaterialEmpleadoController()
    const esLider = authenticationStore.esTecnicoLider
    const esCoordinador = authenticationStore.esCoordinador || authenticationStore.esJefeTecnico || authenticationStore.esCoordinadorBackup
    const refArchivoSeguimiento = ref()
    const subtarea = trabajoAsignadoStore.subtarea
    const fecha_historial = ref()
    const fechasHistorialMaterialesUsados = ref([])

    const cargando = new StatusEssentialLoading()

    const axios = AxiosHttpRepository.getInstance()

    /************
     * Init
     ************/
    /* if (trabajoAsignadoStore.idEmergencia) {
      consultar({ id: trabajoAsignadoStore.idEmergencia })
      accion.value = acciones.editar
    } */

    listarActividadesRealizadas({ subtarea_id: trabajoAsignadoStore.subtarea.id })
    actualizarTablaMateriales()
    obtenerFechasHistorialMaterialesUsados()
    usarMaterialTarea.value = !!materialesTarea.value
    // existeObservaciones.value = !!emergencia.observaciones.length
    // existeMaterialesDevolucion.value = !!emergencia.materiales_devolucion.length

    onMounted(() => refArchivoSeguimiento.value.listarArchivos({ subtarea_id: trabajoAsignadoStore.subtarea.id }))

    // obtenerMaterialesTarea()
    // obtenerMaterialesStock()

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
            // materialesTarea.value[posicion].cantidad_utilizada = data
            console.log('Enviando...')
            entidad.cantidad_anterior = entidad.cantidad_utilizada ?? 0
            entidad.cantidad_utilizada = valor
            console.log(entidad)
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
          validacion: (val) => val >= 0 && (accion.value === acciones.nuevo ? val <= entidad.stock_actual : true),
          accion: (data) => materialesStock.value[posicion].cantidad_utilizada = data
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
        //
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

    /*************
    * Validaciones
    **************/
    const reglas = {
      // regional: { required },
    }

    const v$ = useVuelidate(reglas, emergencia)
    setValidador(v$.value)

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

    function obtenerIdEmpleadoResponsable() {
      if (esLider) return authenticationStore.user.id
      else return trabajoAsignadoStore.idEmpleadoResponsable
    }

    async function obtenerMaterialesTarea() {
      const ruta = axios.getEndpoint(endpoints.materiales_empleado_tarea, { tarea_id: trabajoAsignadoStore.idTareaSeleccionada, subtarea_id: trabajoAsignadoStore.subtarea.id, empleado_id: obtenerIdEmpleadoResponsable() })
      const response: AxiosResponse = await axios.get(ruta)
      materialesTarea.value = response.data.results
    }

    async function obtenerMaterialesStock() {
      const { result } = await materialEmpleadoController.listar({ empleado_id: obtenerIdEmpleadoResponsable() })
      materialesStock.value = result
    }

    async function obtenerHistorialMaterialTareaUsadoPorFecha(fecha: string) {
      cargarVista(async () => {
        const ruta = axios.getEndpoint(endpoints.obtener_historial_material_tarea_usado_por_fecha, { fecha, subtarea_id: trabajoAsignadoStore.subtarea.id, empleado_id: obtenerIdEmpleadoResponsable() })
        const response: AxiosResponse = await axios.get(ruta)
        historialMaterialTareaUsadoPorFecha.value = response.data.results
      })
    }

    async function obtenerFechasHistorialMaterialesUsados() {
      const ruta = axios.getEndpoint(endpoints.fechas_historial_materiales_usados) + '/' + trabajoAsignadoStore.subtarea.id
      const response: AxiosResponse = await axios.get(ruta)
      fechasHistorialMaterialesUsados.value = response.data.results
    }

    // Antes de guardar y editar seguimiento
    function filtrarMaterialesTareaOcupados() {
      return materialesTarea.value.filter((material: any) => material.hasOwnProperty('cantidad_utilizada')) // && material.cantidad_utilizada > 0)
    }

    function filtrarMaterialesStockOcupados() {
      return materialesStock.value.filter((material: any) => material.hasOwnProperty('cantidad_utilizada')) // && material.cantidad_utilizada > 0)
    }

    /* function ajustarCantidadesMaterialTareaUtilizadas() {
      const materialesTareaOcupados = emergencia.materiales_tarea_ocupados

      for (let i = 0; i < materialesTarea.value.length; i++) {
        const indexOcupado = obtenerIndice(materialesTareaOcupados, materialesTarea.value[i].detalle_producto_id)
        if (indexOcupado >= 0) {
          if (accion.value === acciones.consultar) materialesTarea.value[i].stock_actual = materialesTareaOcupados[indexOcupado].stock_actual
          materialesTarea.value[i].cantidad_utilizada = materialesTareaOcupados[indexOcupado].cantidad_utilizada
          materialesTarea.value[i].cantidad_old = materialesTareaOcupados[indexOcupado].cantidad_utilizada
        }
      }
    } */

    function ajustarCantidadesMaterialStockUtilizadas() {
      const materialesStockOcupados = emergencia.materiales_stock_ocupados

      for (let i = 0; i < materialesStock.value.length; i++) {
        const indexOcupado = obtenerIndice(materialesStockOcupados, materialesStock.value[i].detalle_producto_id)
        if (indexOcupado >= 0) {
          if (accion.value === acciones.consultar) materialesStock.value[i].stock_actual = materialesStockOcupados[indexOcupado].stock_actual
          materialesStock.value[i].cantidad_utilizada = materialesStockOcupados[indexOcupado].cantidad_utilizada
          materialesStock.value[i].cantidad_old = materialesStockOcupados[indexOcupado].cantidad_utilizada
        }
      }
    }

    function obtenerIndice(listadoBuscar, id) {
      return listadoBuscar.findIndex((item) => item.detalle_producto_id === id)
    }

    async function descargarExcel() {
      const ruta = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.exportExcelSeguimiento) + '/' + emergencia.id
      imprimirArchivo(ruta, 'GET', 'blob', 'xlsx', 'reporte_hoy_')
    }

    async function guardarSeguimiento() {
      guardar(emergencia, true, { empleado_id: obtenerIdEmpleadoResponsable(), tarea_id: trabajoAsignadoStore.idTareaSeleccionada, grupo: trabajoAsignadoStore.subtarea.grupo }).catch((e) => {
        notificarAdvertencia('Ingrese al menos una actividad para guardar.')
      })
    }

    function subirArchivos() {
      refArchivoSeguimiento.value.subir({ subtarea_id: trabajoAsignadoStore.subtarea.id })
    }

    let cerrarModal = true
    function resetearFiltroHistorial() {
      fecha_historial.value = null
      historialMaterialTareaUsadoPorFecha.value = []
    }

    function editarSeguimiento(cerrarVentanaModal = true) {
      if (permitirSubir) {
        cerrarModal = cerrarVentanaModal
        fecha_historial.value = null
        historialMaterialTareaUsadoPorFecha.value = []
        editar(emergencia, cerrarModal, { empleado_id: obtenerIdEmpleadoResponsable(), tarea_id: trabajoAsignadoStore.idTareaSeleccionada, grupo: trabajoAsignadoStore.subtarea.grupo })
      }
    }

    async function actualizarTablaMateriales() {
      try {
        cargando.activar()
        materialesTarea.value = []
        materialesStock.value = []
        await obtenerMaterialesTarea() //.then(() => ajustarCantidadesMaterialTareaUtilizadas())
        await obtenerMaterialesStock() // .then(() => ajustarCantidadesMaterialStockUtilizadas())
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
      // usarMaterialTarea.value = materialesTarea.value.some((material: MaterialOcupadoFormulario) => material.cantidad_utilizada)
      // usarStock.value = materialesStock.value.some((material: MaterialOcupadoFormulario) => material.cantidad_utilizada)
    }

    function guardarFilaActividad(data) {
      actividad.hydrate(data)
      actividad.subtarea = trabajoAsignadoStore.subtarea.id
      guardarActividad(actividad)
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

    /********
    * Hooks
    *********/
    /* onConsultado(async () => {
      actualizarTablaMateriales()
      existeObservaciones.value = !!emergencia.observaciones.length
      existeMaterialesDevolucion.value = !!emergencia.materiales_devolucion.length
      refArchivoSeguimiento.value.listarArchivos({ seguimiento_id: emergencia.id })
    }) */

    onBeforeGuardar(() => {
      emergencia.materiales_tarea_ocupados = filtrarMaterialesTareaOcupados()
      emergencia.materiales_stock_ocupados = filtrarMaterialesStockOcupados()
      emergencia.subtarea = trabajoAsignadoStore.idSubtareaSeleccionada
    })

    onBeforeModificar(() => {
      emergencia.materiales_tarea_ocupados = filtrarMaterialesTareaOcupados()
      emergencia.materiales_stock_ocupados = filtrarMaterialesStockOcupados()
      emergencia.subtarea = trabajoAsignadoStore.idSubtareaSeleccionada
      // emergencia.trabajo_realizado = nuevasActividades.value
    })

    onGuardado((id: number) => {
      listarSubtareas({ estado: estadosTrabajos.EJECUTANDO })
      emit('cerrar-modal', false)
    })

    onModificado((id: number) => {
      if (cerrarModal) emit('cerrar-modal', false)
    })

    return {
      v$,
      refVisorImagen,
      refTrabajos,
      refObservaciones,
      refArchivoSeguimiento,
      mixinArchivoSeguimiento,
      emergencia,
      accion,
      guardarSeguimiento,
      editarSeguimiento,
      utilizarMateriales,
      existeMaterialesDevolucion,
      existeObservaciones,
      usarStock,
      usarMaterialTarea,
      columnasMaterial,
      configuracionColumnasMaterialOcupadoFormulario,
      configuracionColumnasSumaMaterial,
      materialesTarea,
      materialesStock,
      sumaMaterialesTareaUsado,
      historialMaterialTareaUsadoPorFecha,
      obtenerHistorialMaterialTareaUsadoPorFecha,
      botonEditarCantidadTarea,
      botonEditarCantidadStock,
      botonEditarCantidadTareaHistorial,
      regiones,
      atenciones,
      guardar,
      editar,
      reestablecer,
      emit,
      listadosAuxiliares,
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
      tabsMateriales: ref('historial'),
      fecha_historial,
      rangoFechasHistorial,
      actualizarTablaMateriales,
      actividadesRealizadas,
      guardarFilaActividad,
      mostrarBotonSubir: computed(() => refArchivoSeguimiento.value?.quiero_subir_archivos),
      subirArchivos,
      fechasHistorialMaterialesUsados,
      resetearFiltroHistorial,
    }
  }
})
