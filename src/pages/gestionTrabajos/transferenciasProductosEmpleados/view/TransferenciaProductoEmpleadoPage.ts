// Dependencias
import { acciones, estadosTransacciones, rolesSistema, tabOptionsTransferenciaProductoEmpleado } from 'config/utils'
import { configuracionColumnasDevoluciones } from '../domain/configuracionColumnasDevoluciones'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { computed, defineComponent, onMounted, reactive, ref, watch, watchEffect } from 'vue'
import { useOrquestadorSelectorDetalles } from '../application/OrquestadorSelectorDetalles'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { useAuthenticationStore } from 'stores/authentication'
import { required, requiredIf } from 'shared/i18n-validators'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { useCargandoStore } from 'stores/cargando'
import { ordernarListaString } from 'shared/utils'
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
import { FiltroMiBodegaProyecto } from 'pages/gestionTrabajos/miBodega/domain/FiltroMiBodegaProyecto'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { configuracionColumnasDetallesModal } from '../domain/configuracionColumnasDetallesModal'
import { useTransferenciaProductoEmpleadoStore } from 'stores/transferenciaProductoEmpleado'
import { TransferenciaProductoEmpleado } from '../domain/TransferenciaProductoEmpleado'
import { useBotonesListadoProductos } from '../application/UseBotonesListadoProductos'
import { useMaterialesProyecto } from 'pages/gestionTrabajos/miBodega/application/UseMaterialesProyecto'
import { ValidarListadoProductos } from '../application/ValidarListadoProductos'
import { MaterialEmpleadoTarea } from 'miBodega/domain/MaterialEmpleadoTarea'
import { TareaController } from 'tareas/infraestructure/TareaController'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { destinosTareas, tiposTareas } from 'config/tareas.utils'
import { Proyecto } from 'pages/gestionTrabajos/proyectos/domain/Proyecto'
import { Etapa } from 'pages/gestionTrabajos/proyectos/modules/etapas/domain/Etapa'
import { Tarea } from 'tareas/domain/Tarea'
import { useMaterialesTarea } from 'pages/gestionTrabajos/miBodega/application/UseMaterialesTarea'
import { FiltroMiBodega } from 'pages/gestionTrabajos/miBodega/domain/FiltroMiBodega'
import { EmpleadoRoleController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoRolesController'

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
    const { onModificado, onConsultado, onReestablecer } = mixin.useHooks()
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
    const opciones_autorizaciones = ref([])

    /************************
     * Variables computadas
     ************************/
    const esEntreProyectos = (): boolean => listadosAuxiliares.proyectos.find((proyecto: Proyecto) => proyecto.id === transferencia.proyecto_origen)?.etapas.length === 0

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
        autorizadores: {
          controller: new EmpleadoRoleController(),
          params: {
            // estado: 1,
            // campos: 'id,nombres,apellidos,roles',
            roles: [rolesSistema.jefe_tecnico, rolesSistema.coordinador, rolesSistema.coordinadorBackup],
          }
        },
        tareasDestino: [],
        etapas: [],
        etapasDestino: [],
        tareas: [],
        productos: [],
        proyectos: [],
      })
    })

    /********
     * Init
     ********/
    // console.log(transferenciaProductoEmpleadoStore.idProyecto)
    onMounted(() => {
      transferencia.tarea_origen = transferenciaProductoEmpleadoStore.tareaId ?? null
      console.log('Montando...')
      console.log(transferencia.tarea_origen)
      // transferencia.proyecto_origen = transferenciaProductoEmpleadoStore.idProyecto
      // transferencia.etapa_origen = transferenciaProductoEmpleadoStore.idEtapa
      console.log(accion.value)
      // if (accion.value === acciones.nuevo) transferencia.empleado_origen = useAuthenticationStore().user.id
      transferencia.empleado_origen = transferenciaProductoEmpleadoStore.idEmpleado ?? useAuthenticationStore().user.id
      transferencia.cliente = transferenciaProductoEmpleadoStore.cliente_id
      // console.log(transferenciaProductoEmpleadoStore.idProyecto)

      if (transferenciaProductoEmpleadoStore.listadoMateriales.length) {
        transferencia.listado_productos = mapearProductos(transferenciaProductoEmpleadoStore.listadoMateriales)
        // console.log(transferencia.listado_productos)
      }

      // ajustarFormulariosPorOrigenProductos()
      // transferencia.empleado_origen = authenticationStore.user.id
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
    watch(computed(() => transferencia.empleado_origen), async (id) => {
      if (id) {
        await consultarTareasEmpleadoOrigen()
        await consultarProyectosEmpleadoOrigen()
        const tarea = listadosAuxiliares.tareas.find((t: Tarea) => t.id === transferencia.tarea_origen)
        console.log(listadosAuxiliares.tareas)
        console.log(tarea)
        transferencia.proyecto_origen = tarea?.proyecto_id
        transferencia.etapa_origen = tarea?.etapa_id
        console.log(transferencia.proyecto_origen)
        console.log('tarea - proyecto')
      }
    })

    watchEffect(() => {
      if (transferencia.empleado_destino) {
        if (transferencia.proyecto_origen) consultarProyectosEmpleadoDestino()
        else consultarTareasEmpleadoDestino()
      }
    })

    watch(computed(() => transferencia.proyecto_destino), async (id) => {
      if (id) {
        await consultarEtapasEmpleadoDestino(id)
        consultarTareasEmpleadoDestino({ proyecto_id: id })
      } else {
        consultarTareasEmpleadoDestino()
      }
    })

    watch(computed(() => transferencia.etapa_destino), (id) => {
      if (id) consultarTareasEmpleadoDestino({ etapa_id: id })
    })

    // Origen
    watch(computed(() => transferencia.proyecto_origen), async (id) => {
      if (id) {
        await consultarEtapasEmpleadoOrigen(id)
        consultarTareasEmpleadoOrigen({ proyecto_id: id })
      } else {
        consultarTareasEmpleadoOrigen()
      }
    })

    watch(computed(() => transferencia.etapa_origen), (id) => {
      if (id) consultarTareasEmpleadoOrigen({ etapa_id: id })
    })

    watch(computed(() => transferencia.tarea_origen), async (id) => {
      if (id) {
        const tarea = listadosAuxiliares.tareas.find((t: Tarea) => t.id === id)
        // console.log(listadosAuxiliares.tareas)
        transferencia.proyecto_origen = tarea?.proyecto_id
        transferencia.etapa_origen = tarea?.etapa_id
        transferencia.cliente = tarea?.cliente_id
        // console.log(transferencia.proyecto_origen)
        // console.log('tarea - proyecto')

        if (transferencia.proyecto_origen) {
          filtroProyecto.empleado_id = transferencia.empleado_origen
          filtroProyecto.etapa_id = transferencia.etapa_origen
          filtroProyecto.proyecto_id = transferencia.proyecto_origen
          filtroProyecto.cliente_id = transferencia.cliente
          // await consultarProductosProyecto()
        } else {
          filtroMiBodega.empleado_id = transferencia.empleado_origen
          filtroMiBodega.tarea_id = transferencia.tarea_origen
          filtroMiBodega.cliente_id = transferencia.cliente_id
          // await consultarProductosTarea()
        }
        // transferencia.listado_productos = mapearProductos(listadosAuxiliares.productos)
      } /*else {
        listadosAuxiliares.productos = []
      }*/
    })

    // Destino
    watch(computed(() => transferencia.proyecto_destino), (id) => {
      if (id) consultarEtapasEmpleadoDestino(id)
    })

    watchEffect(() => {
      if (transferencia.tarea_origen && !!listadosAuxiliares.tareas.length) establecerAutorizador()
    })

    /*******************************************************************************************
     * Funciones
     ******************************************************************************************/
    const { proyectos, filtrarProyectos, proyectosDestino, filtrarProyectosDestino, etapas, filtrarEtapas, etapasDestino, filtrarEtapasDestino } = useFiltrosListadosSelects(listadosAuxiliares)

    const filtroProyecto = reactive(new FiltroMiBodegaProyecto())
    const filtroMiBodega = reactive(new FiltroMiBodega())
    const { consultarProyectos, consultarProyectosDestino, consultarEtapas, consultarEtapasDestino, consultarProductosProyecto } = useMaterialesProyecto(filtroProyecto, listadosAuxiliares)
    const { consultarProductosTarea } = useMaterialesTarea(filtroMiBodega, listadosAuxiliares)

    function establecerAutorizador() {
      if (esEntreProyectos()) {
        transferencia.autorizador = listadosAuxiliares.autorizadores.find((emp: Empleado) => emp.roles.includes(rolesSistema.jefe_tecnico)).id
      } else {
        // Aqui ingresa si es transferencia entre etapas y entre tareas
        const tarea = listadosAuxiliares.tareas.find((tarea: Tarea) => tarea.id === transferencia.tarea_origen)
        transferencia.autorizador = tarea?.coordinador_id
      }
    }

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
      filtroProyecto.empleado_id = transferencia.empleado_destino
      await consultarEtapasDestino(idProyecto)
      etapasDestino.value = listadosAuxiliares.etapasDestino

      if (esTransferenciaEntreEtapas()) transferencia.autorizador = buscarEtapa().supervisor_id
    }

    async function consultarProyectosEmpleadoDestino() {
      filtroProyecto.empleado_id = transferencia.empleado_destino
      await consultarProyectosDestino()
      const esEntreEtapas = esTransferenciaEntreEtapas()

      listadosAuxiliares.proyectosDestino = esEntreEtapas ? listadosAuxiliares.proyectosDestino.filter((proyecto: Proyecto) => proyecto.etapas.length > 0) : listadosAuxiliares.proyectosDestino.filter((proyecto: Proyecto) => proyecto.etapas.length === 0)
      proyectosDestino.value = listadosAuxiliares.proyectosDestino

      if (!esEntreEtapas) transferencia.autorizador = buscarProyecto().coordinador_id
    }

    function esTransferenciaEntreEtapas() {
      return !!listadosAuxiliares.proyectos.find((proyecto: Proyecto) => proyecto.id === transferencia.proyecto_origen)?.etapas.length
    }

    function buscarProyecto(): Proyecto {
      return listadosAuxiliares.proyectos.find((proyecto: Proyecto) => proyecto.id === transferencia.proyecto_origen)
    }

    function buscarEtapa(): Etapa {
      return listadosAuxiliares.etapas.find((etapa: Etapa) => etapa.id === transferencia.etapa_origen)
    }

    const puedeEditar = ref()
    function filtrarTransferenciasProductoEmpleado(tab: string) {
      tabSeleccionado.value = tab
      puedeEditar.value = authenticationStore.can('puede.autorizar.devoluciones') && tabSeleccionado.value === estadosTransacciones.pendiente ? true : false
      puedeEditar.value = tab == 'PENDIENTE'
      listar({ estado: tab })
    }

    async function consultarTareasEmpleadoOrigen(params?: any) {
      console.log('Consultando tareas origen')
      // await cargarVista(async () => {
      if (transferencia.empleado_origen) {

        const tareaController = new TareaController()
        const { result } = await tareaController.listar({ activas_empleado: 1, empleado_id: transferencia.empleado_origen, campos: 'id,codigo_tarea', ...params })
        listadosAuxiliares.tareas = result
        tareas.value = result
      }
      // console.log(listadosAuxiliares.tareas)
      // })
    }

    async function consultarTareasEmpleadoDestino(params?: any) {
      console.log('Consultando tareas destino')
      await cargarVista(async () => {
        if (transferencia.empleado_destino) {
          const tareaController = new TareaController()
          const { result } = await tareaController.listar({ activas_empleado: 1, empleado_id: transferencia.empleado_destino, campos: 'id,codigo_tarea', ...params })//, para_cliente_proyecto: destinosTareas.paraClienteFinal })
          listadosAuxiliares.tareasDestino = result
          tareasDestino.value = result
        }
      })
    }

    /* async function obtenerMaterialesTarea(cliente: number) {
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
    } */

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

    /********
     * Hooks
     ********/
    onModificado(() => filtrarTransferenciasProductoEmpleado(tabSeleccionado.value))

    onConsultado(() => transferenciaProductoEmpleadoStore.origenProductos = (transferencia.tarea_origen ? destinosTareas.paraClienteFinal : destinosTareas.paraProyecto))

    onReestablecer(() => transferencia.empleado_origen = authenticationStore.user.id)
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
      // consultarTareasClienteFinalMantenimiento,
      listadosAuxiliares,
      transferenciaProductoEmpleadoStore,
      ordenarOpcionesEmpleados: () => opciones_empleados.value.sort((a: Empleado, b: Empleado) => ordernarListaString(a.apellidos!, b.apellidos!)),
      // Computeds
      mostrarOrigenTarea: computed(() => transferenciaProductoEmpleadoStore.origenProductos === destinosTareas.paraClienteFinal),
      mostrarOrigenProyecto: computed(() => transferenciaProductoEmpleadoStore.origenProductos === destinosTareas.paraProyecto),
      mostrarOrigenPersonal: computed(() => transferenciaProductoEmpleadoStore.origenProductos === 'personal'),
      tipoTarea: computed(() => transferenciaProductoEmpleadoStore.origenProductos === destinosTareas.paraClienteFinal ? tiposTareas.find((tipo) => tipo.value === transferenciaProductoEmpleadoStore.origenProductos)?.label : null),
      proyectoOrigenTieneEtapas: computed(() => !!listadosAuxiliares.proyectos.find((proyecto: Proyecto) => proyecto.id === transferencia.proyecto_origen)?.etapas.length ? ' Transferencia entre etapas' : ' Transferencia entre proyectos sin etapas'),
      paraTarea: computed(() => transferenciaProductoEmpleadoStore.origenProductos === destinosTareas.paraClienteFinal),
      paraProyecto: computed(() => transferenciaProductoEmpleadoStore.origenProductos === destinosTareas.paraProyecto),
    }
  }
})
