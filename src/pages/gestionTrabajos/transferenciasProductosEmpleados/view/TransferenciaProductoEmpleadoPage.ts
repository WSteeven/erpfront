// Dependencias
import { acciones, estadosTransacciones, rolesSistema, tabOptionsTransferenciaProductoEmpleado } from 'config/utils'
import { configuracionColumnasDevoluciones } from '../domain/configuracionColumnasDevoluciones'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useOrquestadorSelectorDetalles } from '../application/OrquestadorSelectorDetalles'
import { useListadoMaterialesDevolucionStore } from 'stores/listadoMaterialesDevolucion'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { useCargandoStore } from 'stores/cargando'
import { ordernarListaString } from 'shared/utils'
import { required, requiredIf } from 'shared/i18n-validators'
import { LocalStorage, useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { endpoints } from 'config/api'
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
import { destinosTareas, tiposTareas } from 'config/tareas.utils'
import { useTransferenciaProductoEmpleadoStore } from 'stores/transferenciaProductoEmpleado'
import { FiltroMiBodegaProyecto } from 'pages/gestionTrabajos/miBodega/domain/FiltroMiBodegaProyecto'
import { useMaterialesProyecto } from 'pages/gestionTrabajos/miBodega/application/UseMaterialesProyecto'
import { Proyecto } from 'pages/gestionTrabajos/proyectos/domain/Proyecto'

export default defineComponent({
  name: 'TransferenciaProductoEmpleado',
  components: { TabLayoutFilterTabs2, EssentialTable, EssentialSelectableTable, GestorArchivos, },

  setup() {
    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(TransferenciaProductoEmpleado, new TransferenciaProductoEmpleadoController())
    const { entidad: transferencia, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
    const { onModificado, onConsultado } = mixin.useHooks()
    const { notificarAdvertencia } = useNotificaciones()

    /**********
     * Stores
     * ********/
    const transferenciaProductoEmpleadoStore = useTransferenciaProductoEmpleadoStore()
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
            estado: 1,
            // rol: rolesSistema.tecnico,
          }
        },
        tareasDestino: [],
        etapas: [],
        etapasDestino: [],
        tareas: [],
        proyectos: [],
      })
    })

    /********
     * Init
     ********/
    // console.log(transferenciaProductoEmpleadoStore.idProyecto)
    onMounted(() => {
      transferencia.tarea_origen = transferenciaProductoEmpleadoStore.tareaId ? transferenciaProductoEmpleadoStore.tareaId : null
      transferencia.proyecto_origen = transferenciaProductoEmpleadoStore.idProyecto
      transferencia.etapa_origen = transferenciaProductoEmpleadoStore.idEtapa
      transferencia.empleado_origen = useAuthenticationStore().user.id
      // console.log(transferenciaProductoEmpleadoStore.idProyecto)

      if (transferenciaProductoEmpleadoStore.listadoMateriales.length) {
        transferencia.listado_productos = mapearProductos(transferenciaProductoEmpleadoStore.listadoMateriales)
        // console.log(transferencia.listado_productos)
      }

      // ajustarFormulariosPorOrigenProductos()
      transferencia.empleado_origen = authenticationStore.user.id
    })

    transferencia.solicitante = authenticationStore.user.id
    opciones_autorizaciones.value = JSON.parse(LocalStorage.getItem('autorizaciones')!.toString())

    /*********
     * Reglas
     *********/
    const reglas = {
      justificacion: { required },
      empleado_origen: { required },
      empleado_destino: { required },
      tarea_origen: { requiredIf: requiredIf(() => transferenciaProductoEmpleadoStore.origenProductos === destinosTareas.paraClienteFinal) },
      tarea_destino: { requiredIf: requiredIf(() => transferenciaProductoEmpleadoStore.origenProductos === destinosTareas.paraClienteFinal) },
      solicitante: { required },
    }

    const v$ = useVuelidate(reglas, transferencia)
    setValidador(v$.value)

    const validarListadoProductos = new ValidarListadoProductos(transferencia)
    mixin.agregarValidaciones(validarListadoProductos)

    /************
     * Observers
     ************/
    /*watchEffect(() => {
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
    })*/

    watch(computed(() => transferencia.empleado_origen), () => {
      if (transferencia.empleado_origen) {
        consultarTareasEmpleadoOrigen()
        consultarProyectosEmpleadoOrigen()
      }
    })

    watch(computed(() => transferencia.empleado_destino), () => {
      if (transferencia.empleado_destino) {
        consultarTareasClienteFinalMantenimiento()
        consultarProyectosEmpleadoDestino()
      }
      transferencia.empleado_destino = transferencia.empleado_destino
    })

    watch(computed(() => transferencia.proyecto_origen), (id) => {
      if (id) consultarEtapasEmpleadoOrigen(id)
    })

    watch(computed(() => transferencia.proyecto_destino), (id) => {
      if (id) consultarEtapasEmpleadoDestino(id)
    })

    /*******************************************************************************************
     * Funciones
     ******************************************************************************************/
    const { proyectos, filtrarProyectos, proyectosDestino, filtrarProyectosDestino, etapas, filtrarEtapas, etapasDestino, filtrarEtapasDestino } = useFiltrosListadosSelects(listadosAuxiliares)

    const filtroProyecto = reactive(new FiltroMiBodegaProyecto())
    const { consultarProyectos, consultarProyectosDestino, consultarEtapas, consultarEtapasDestino, consultarProductosProyecto } = useMaterialesProyecto(filtroProyecto, listadosAuxiliares)

    async function consultarProyectosEmpleadoOrigen() {
      filtroProyecto.empleado_id = transferencia.empleado_origen
      await consultarProyectos()
      proyectos.value = listadosAuxiliares.proyectos
    }

    async function consultarEtapasEmpleadoOrigen(idProyecto: number) {
      filtroProyecto.empleado_id = transferencia.empleado_origen
      await consultarEtapas(idProyecto)
      etapas.value = listadosAuxiliares.etapas
    }

    async function consultarEtapasEmpleadoDestino(idProyecto: number) {
      filtroProyecto.empleado_id = transferencia.empleado_origen
      await consultarEtapasDestino(idProyecto)
      etapasDestino.value = listadosAuxiliares.etapasDestino
    }

    async function consultarProyectosEmpleadoDestino() {
      filtroProyecto.empleado_id = transferencia.empleado_destino
      await consultarProyectosDestino()
      const esEntreEtapas = !!listadosAuxiliares.proyectos.find((proyecto: Proyecto) => proyecto.id === transferencia.proyecto_origen)?.etapas.length

      console.log(esEntreEtapas)

      listadosAuxiliares.proyectosDestino = esEntreEtapas ? listadosAuxiliares.proyectosDestino.filter((proyecto: Proyecto) => proyecto.etapas.length > 0) : listadosAuxiliares.proyectosDestino.filter((proyecto: Proyecto) => proyecto.etapas.length === 0)
      proyectosDestino.value = listadosAuxiliares.proyectosDestino
      // proyectosDestino.value = listadosAuxiliares.proyectosDestino
    }

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

    function consultarTareasClienteFinalMantenimiento() {
      cargarVista(async () => {
        const tareaController = new TareaController()
        const { result } = await tareaController.listar({ activas_empleado: 1, empleado_id: transferencia.empleado_destino, campos: 'id,codigo_tarea', para_cliente_proyecto: destinosTareas.paraClienteFinal })
        listadosAuxiliares.tareasDestino = result
        tareasDestino.value = result
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

    function ajustarFormulariosPorOrigenProductos() {
      switch (transferenciaProductoEmpleadoStore.origenProductos) {
        case destinosTareas.paraClienteFinal:
          break
        case destinosTareas.paraProyecto:
          transferencia.tarea_origen = null
          break
        case 'personal':
          break
      }
    }

    /********
     * Hooks
     ********/
    onModificado(() => filtrarTransferenciasProductoEmpleado(tabSeleccionado.value))

    onConsultado(() => transferenciaProductoEmpleadoStore.origenProductos = (transferencia.tarea_origen ? destinosTareas.paraClienteFinal : null))

    /*******************************************************************************************
     * Botones de tabla
     ******************************************************************************************/
    const { botonAnular, botonDespachar, botonImprimir } = useBotonesTransferenciaProductoEmpleado(listado, tabSeleccionado)
    const { botonEditarCantidad, botonEliminar } = useBotonesListadoProductos(transferencia, accion)

    //Configurar los listados
    opciones_empleados.value = listadosAuxiliares.empleados
    empleados.value = listadosAuxiliares.empleados

    return {
      mixin, transferencia, disabled, accion, v$, acciones,
      configuracionColumnas: configuracionColumnasDevoluciones,
      authenticationStore,
      // listados
      opciones_empleados,
      opciones_tareas,
      opciones_autorizaciones,
      tareas,
      tareasDestino,
      proyectos,
      proyectosDestino,
      etapas,
      etapasDestino,
      // filtros
      filtrarProyectos,
      filtrarProyectosDestino,
      filtrarTareas,
      filtrarEtapas,
      filtrarEtapasDestino,
      filtrarTareasDestino,
      // selector
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
      puedeAutorizar: computed(() => (esCoordinador || authenticationStore.esJefeTecnico || authenticationStore.esAdministrador) && accion.value === acciones.nuevo),

      //Tabs
      tabOptionsTransferenciaProductoEmpleado,
      tabSeleccionado,
      puedeEditar,

      //funciones
      filtrarTransferenciasProductoEmpleado,
      empleados,
      filtrarEmpleados,
      ordenarEmpleados,
      consultarTareasClienteFinalMantenimiento,
      listadosAuxiliares,
      transferenciaProductoEmpleadoStore,
      ordenarOpcionesEmpleados: () => opciones_empleados.value.sort((a: Empleado, b: Empleado) => ordernarListaString(a.apellidos!, b.apellidos!)),
      // Computeds
      mostrarOrigenTarea: computed(() => transferenciaProductoEmpleadoStore.origenProductos === destinosTareas.paraClienteFinal),
      mostrarOrigenProyecto: computed(() => transferenciaProductoEmpleadoStore.origenProductos === destinosTareas.paraProyecto),
      mostrarOrigenPersonal: computed(() => transferenciaProductoEmpleadoStore.origenProductos === 'personal'),
      tipoTarea: computed(() => transferenciaProductoEmpleadoStore.origenProductos === destinosTareas.paraClienteFinal ? tiposTareas.find((tipo) => tipo.value === transferenciaProductoEmpleadoStore.origenProductos)?.label : null),
      proyectoOrigenTieneEtapas: computed(() => !!listadosAuxiliares.proyectos.find((proyecto: Proyecto) => proyecto.id === transferencia.proyecto_origen)?.etapas.length ? ' Transferencia entre etapas' : ' Transferencia entre proyectos sin etapas'),
    }
  }
})
