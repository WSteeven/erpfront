// Dependencias
import { acciones, estadosTransacciones, tabOptionsTransferenciaProductoEmpleado } from 'config/utils'
import { configuracionColumnasDevoluciones } from '../domain/configuracionColumnasDevoluciones'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useOrquestadorSelectorDetalles } from '../application/OrquestadorSelectorDetalles'
import { useListadoMaterialesDevolucionStore } from 'stores/listadoMaterialesDevolucion'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { computed, defineComponent, onMounted, ref, watch, watchEffect } from 'vue'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { useDevolucionStore } from 'stores/devolucion'
import { useCargandoStore } from 'stores/cargando'
import { ordernarListaString } from 'shared/utils'
import { required } from 'shared/i18n-validators'
import { LocalStorage, useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { endpoints } from 'config/api'
import { useRouter } from 'vue-router'
import { AxiosResponse } from 'axios'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { configuracionColumnasProductosSeleccionadosAccion } from '../domain/configuracionColumnasProductosSeleccionadosAccion'
import { TransferenciaProductoEmpleadoController } from '../infraestructure/TransferenciaProductoEmpleadoController'
import { configuracionColumnasProductosSeleccionados } from '../domain/configuracionColumnasProductosSeleccionados'
import { useBotonesTransferenciaProductoEmpleado } from '../application/UseBotonesTransferenciaProductoEmpleado'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { configuracionColumnasDetallesModal } from '../domain/configuracionColumnasDetallesModal'
import { TransferenciaProductoEmpleado } from '../domain/TransferenciaProductoEmpleado'
import { useBotonesListadoProductos } from '../application/UseBotonesListadoProductos'
import { ValidarListadoProductos } from '../application/ValidarListadoProductos'
import { MaterialEmpleadoTarea } from 'miBodega/domain/MaterialEmpleadoTarea'
import { TareaController } from 'tareas/infraestructure/TareaController'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { Tarea } from 'tareas/domain/Tarea'

export default defineComponent({
  name: 'TransferirMaterial',
  components: { TabLayoutFilterTabs2, EssentialTable, EssentialSelectableTable, GestorArchivos, },

  setup() {
    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(TransferenciaProductoEmpleado, new TransferenciaProductoEmpleadoController())
    const { entidad: transferencia, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
    const { notificarAdvertencia } = useNotificaciones()

    /**********
     * Stores
     * ********/
    const listadoMaterialesDevolucionStore = useListadoMaterialesDevolucionStore()
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const authenticationStore = useAuthenticationStore()

    /***************
     * Orquestador
     ***************/
    const {
      refListadoSeleccionable: refListado,
      criterioBusqueda: criterioBusquedaProducto,
      listado: listadoProductos,
      listar: listarProductos,
      limpiar: limpiarProducto,
      seleccionar: seleccionarProducto
    } = useOrquestadorSelectorDetalles(transferencia, 'materiales_empleado_consolidado')

    /************
     * Variables
     ************/
    const tabSeleccionado = ref()
    const esCoordinador = authenticationStore.esCoordinador
    const router = useRouter()
    const cargando = new StatusEssentialLoading()
    const axios = AxiosHttpRepository.getInstance()

    const { empleados, filtrarEmpleados, ordenarEmpleados, tareas, filtrarTareas, tareasDestino, filtrarTareasDestino } = useFiltrosListadosSelects(listadosAuxiliares)

    const opciones_empleados = ref([])
    const opciones_tareas = ref([])
    const opciones_autorizaciones = ref([])

    //Obtener los listados
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            estado: 1
          }
        },
        tareasDestino: [],
        etapas: [],
        tareas: [],
      })
    })

    /********
     * Init
     ********/
    onMounted(() => {

      transferencia.tarea_origen = listadoMaterialesDevolucionStore.tareaId ? listadoMaterialesDevolucionStore.tareaId : null
    })
    transferencia.solicitante = authenticationStore.user.id
    transferencia.empleado_origen = authenticationStore.esTecnico ? authenticationStore.user.id : null
    if (listadoMaterialesDevolucionStore.listadoMateriales.length) {
      transferencia.listado_productos = mapearProductos(listadoMaterialesDevolucionStore.listadoMateriales)
    }
    consultarTareasEmpleadoOrigen()

    /*********
     * Reglas
     *********/
    const reglas = {
      justificacion: { required },
      empleado_origen: { required },
      empleado_destino: { required },
      tarea_origen: { required },
      tarea_destino: { required },
      solicitante: { required },
    }

    const v$ = useVuelidate(reglas, transferencia)
    setValidador(v$.value)

    const validarListadoProductos = new ValidarListadoProductos(transferencia)
    mixin.agregarValidaciones(validarListadoProductos)

    /************
     * Observers
     ************/
    watchEffect(() => {
      const tarea = listadosAuxiliares.tareas.find((tarea: Tarea) => tarea.id === transferencia.tarea_origen)
      if (transferencia.tarea_origen && tarea) {
        transferencia.etapa_origen = tarea?.etapa
        transferencia.proyecto_origen = tarea?.proyecto
        if (tarea) obtenerMaterialesTarea(tarea.cliente_id)
      }
    })

    watch(computed(() => transferencia.tarea_destino), () => {
      const tarea = listadosAuxiliares.tareasDestino.find((tarea: Tarea) => tarea.id === transferencia.tarea_destino)
      transferencia.autorizador = tarea.etapa_id ? tarea.coordinador_id : authenticationStore.user.jefe_id
      transferencia.proyecto_destino = tarea.proyecto
      transferencia.etapa_destino = tarea.etapa
    })

    /*******************************************************************************************
     * Funciones
     ******************************************************************************************/
    const puedeEditar = ref()
    function filtrarTransferenciasProductoEmpleado(tab: string) {
      tabSeleccionado.value = tab
      puedeEditar.value = authenticationStore.can('puede.autorizar.devoluciones') && tabSeleccionado.value === estadosTransacciones.pendiente ? true : false
      puedeEditar.value = tab == 'PENDIENTE'
      listar({ estado: tab })
    }

    function consultarTareasEmpleadoOrigen() {
      cargarVista(async () => {
        const tareaController = new TareaController()
        const { result } = await tareaController.listar({ activas_empleado: 1, empleado_id: transferencia.empleado_origen, campos: 'id,codigo_tarea' })
        listadosAuxiliares.tareas = result
      })
    }

    function consultarTareasEmpleado() {
      cargarVista(async () => {
        const tareaController = new TareaController()
        const { result } = await tareaController.listar({ activas_empleado: 1, empleado_id: transferencia.empleado_destino, campos: 'id,codigo_tarea' })
        listadosAuxiliares.tareasDestino = result
      })
    }

    async function obtenerMaterialesTarea(cliente: number) {
      try {
        cargando.activar()
        const ruta = axios.getEndpoint(endpoints.materiales_empleado_tarea, { tarea_id: transferencia.tarea_origen, empleado_id: transferencia.empleado_origen, cliente_id: cliente })
        const response: AxiosResponse = await axios.get(ruta)
        transferencia.listado_productos = mapearProductos(response.data.results)

        if (!transferencia.listado_productos.length) {
          notificarAdvertencia('No tienes material asignado.')
        }
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    function mapearProductos(listado: any[]) {
      return listado.map((material: MaterialEmpleadoTarea) => {
        return {
          producto: material.producto,
          categoria: material.categoria,
          descripcion: material.detalle_producto,
          cantidad: material.stock_actual,
          medida: material.medida,
          id: material.detalle_producto_id
        }
      })
    }

    /*******************************************************************************************
     * Botones de tabla
     ******************************************************************************************/
    const { botonAnular, botonDespachar, botonImprimir } = useBotonesTransferenciaProductoEmpleado()
    const { botonEditarCantidad, botonEliminar } = useBotonesListadoProductos(transferencia, accion)

    //Configurar los listados
    opciones_empleados.value = listadosAuxiliares.empleados

    return {
      mixin, transferencia, disabled, accion, v$, acciones,
      configuracionColumnas: configuracionColumnasDevoluciones,
      //listados
      opciones_empleados,
      opciones_tareas,
      opciones_autorizaciones,
      authenticationStore,
      //selector
      refListado,
      criterioBusquedaProducto,
      listadoProductos,
      listarProductos,
      limpiarProducto,
      seleccionarProducto,
      configuracionColumnasDetallesModal,

      //tabla
      configuracionColumnasProductosSeleccionadosAccion,
      configuracionColumnasProductosSeleccionados,
      botonEditarCantidad,
      botonEliminar,
      botonAnular,
      botonImprimir,
      botonDespachar,

      //flags
      esCoordinador,
      puedeSeleccionarPropietarioMaterial: computed(() => !(esCoordinador || authenticationStore.esJefeTecnico || authenticationStore.esAdministrador)),

      //Tabs
      tabOptionsTransferenciaProductoEmpleado,
      tabSeleccionado,
      puedeEditar,

      //funciones
      filtrarTransferenciasProductoEmpleado,
      empleados,
      filtrarEmpleados,
      ordenarEmpleados,
      tareas, filtrarTareas,
      consultarTareasEmpleado,
      listadosAuxiliares,
      tareasDestino, filtrarTareasDestino,
      ordenarOpcionesEmpleados: () => opciones_empleados.value.sort((a: Empleado, b: Empleado) => ordernarListaString(a.apellidos!, b.apellidos!)),
    }
  }
})
