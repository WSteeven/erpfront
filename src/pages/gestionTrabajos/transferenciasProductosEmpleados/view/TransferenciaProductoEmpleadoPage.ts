// Dependencias
import {
  acciones,
  estadosTransacciones,
  rolesSistema,
  tabOptionsTransferenciaProductoEmpleado
} from 'config/utils'
import { configuracionColumnasDevoluciones } from '../domain/configuracionColumnasDevoluciones'
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { useOrquestadorSelectorDetalles } from '../application/OrquestadorSelectorDetalles'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { useAuthenticationStore } from 'stores/authentication'
import { required, requiredIf } from 'shared/i18n-validators'
import { useNotificacionStore } from 'stores/notificacion'
import { destinosTareas } from 'config/tareas.utils'
import { useCargandoStore } from 'stores/cargando'
import { ordernarListaString } from 'shared/utils'
import { LocalStorage, useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ArchivoController } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'
import { configuracionColumnasProductosSeleccionadosAccion } from '../domain/configuracionColumnasProductosSeleccionadosAccion'
import { TransferenciaProductoEmpleadoController } from '../infraestructure/TransferenciaProductoEmpleadoController'
import { configuracionColumnasProductosSeleccionados } from '../domain/configuracionColumnasProductosSeleccionados'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useMaterialesProyecto } from 'pages/gestionTrabajos/miBodega/application/UseMaterialesProyecto'
import { useMaterialesEmpleado } from 'pages/gestionTrabajos/miBodega/application/UseMaterialesEmpleado'
import { FiltroMiBodegaProyecto } from 'pages/gestionTrabajos/miBodega/domain/FiltroMiBodegaProyecto'
import { FiltroMiBodegaEmpleado } from 'pages/gestionTrabajos/miBodega/domain/FiltroMiBodegaEmpleado'
import { useMaterialesTarea } from 'pages/gestionTrabajos/miBodega/application/UseMaterialesTarea'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { configuracionColumnasDetallesModal } from '../domain/configuracionColumnasDetallesModal'
import { useTransferenciaProductoEmpleadoStore } from 'stores/transferenciaProductoEmpleado'
import { TransferenciaProductoEmpleado } from '../domain/TransferenciaProductoEmpleado'
import { useBotonesListadoProductos } from '../application/UseBotonesListadoProductos'
import { FiltroMiBodega } from 'pages/gestionTrabajos/miBodega/domain/FiltroMiBodega'
import { Etapa } from 'pages/gestionTrabajos/proyectos/modules/etapas/domain/Etapa'
import { ValidarExisteArchivo } from '../application/ValidarListadoProductos'
import { MaterialEmpleadoTarea } from 'miBodega/domain/MaterialEmpleadoTarea'
import { Proyecto } from 'pages/gestionTrabajos/proyectos/domain/Proyecto'
import { TareaController } from 'tareas/infraestructure/TareaController'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { Tarea } from 'tareas/domain/Tarea'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
  name: 'TransferenciaProductoEmpleado',
  components: { TabLayoutFilterTabs2, EssentialTable, EssentialSelectableTable, GestorArchivos, },

  setup() {
    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(TransferenciaProductoEmpleado, new TransferenciaProductoEmpleadoController(), new ArchivoController())
    const { entidad: transferencia, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
    const { onModificado, onConsultado, onReestablecer, onGuardado } = mixin.useHooks()

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
      seleccionar: seleccionarProducto,
    } = useOrquestadorSelectorDetalles(transferencia, 'materiales_empleado_consolidado')

    const consultarProductos = async () => {
      if (!transferencia.cliente) return notificarAdvertencia('Debe seleccionar un cliente para filtrar los productos de origen')
      if (!transferencia.tarea_origen) { // Stock
        return await listarProductos({
          empleado_id: transferencia.empleado_origen,
          cliente_id: transferencia.cliente,
          stock_personal: 1,
        })
      } else {
        if (!transferencia.proyecto_origen && !transferencia.etapa_origen) {
          /* filtroTarea.cliente_id = transferencia.cliente
          filtroTarea.empleado_id = transferencia.empleado_origen
          filtroTarea.tarea_id = transferencia.tarea_origen */

          return listarProductos({
            empleado_id: transferencia.empleado_origen,
            cliente_id: transferencia.cliente,
            tarea_id: transferencia.tarea_origen,
          })
          // await consultarProductosTarea()
          // transferencia.listado_productos = mapearProductos(listadosAuxiliares.productos)
        } else {
          /* filtroProyecto.empleado_id = transferencia.empleado_origen
          filtroProyecto.proyecto_id = transferencia.proyecto_origen
          filtroProyecto.etapa_id = transferencia.etapa_origen */

          return listarProductos({
            empleado_id: transferencia.empleado_origen,
            cliente_id: transferencia.cliente,
            proyecto_id: transferencia.proyecto_origen,
            etapa_id: transferencia.etapa_origen,
          })

          // await consultarProductosProyecto()
          // transferencia.listado_productos = mapearProductos(listadosAuxiliares.productos)
        }
      }
    }

    /************
     * Variables
     ************/
    const tabSeleccionado = ref()
    const esCoordinador = authenticationStore.esCoordinador
    const refArchivo = ref()
    const idTransferencia = ref()
    const esParaStock = ref(false)
    const esDestinoStock = ref(false)
    const { notificarAdvertencia } = useNotificaciones()

    const { empleados, filtrarEmpleados, ordenarEmpleados, empleadosOrigen, filtrarEmpleadosOrigen, ordenarEmpleadosOrigen, tareas, filtrarTareas, tareasDestino, filtrarTareasDestino } = useFiltrosListadosSelects(listadosAuxiliares)

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
          }
        },
        autorizadores: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            estado: 1,
          }
        },
        /* autorizadores: {
          controller: new EmpleadoRoleController(),
          params: {
            roles: [rolesSistema.jefe_tecnico, rolesSistema.coordinador, rolesSistema.coordinadorBackup, rolesSistema.gerente],
          }
        }, */
        empleadosOrigen: [],
        productos: [],
        etapas: [],
        etapasDestino: [],
        tareas: [],
        tareasDestino: [],
        proyectos: [],
        proyectosDestino: [],
        // Clientes
        clientesMaterialesEmpleado: [],
        clientesMaterialesTarea: [],
      })
    })

    /********
     * Init
     ********/
    onMounted(async () => {
      transferencia.tarea_origen = transferenciaProductoEmpleadoStore.tareaId ?? null
      transferencia.proyecto_origen = transferenciaProductoEmpleadoStore.idProyecto
      transferencia.etapa_origen = transferenciaProductoEmpleadoStore.idEtapa
      transferencia.empleado_origen = transferenciaProductoEmpleadoStore.idEmpleado ?? useAuthenticationStore().user.id
      transferencia.cliente = transferenciaProductoEmpleadoStore.cliente_id
      esParaStock.value = !transferenciaProductoEmpleadoStore.idProyecto && !transferenciaProductoEmpleadoStore.idEtapa && !transferenciaProductoEmpleadoStore.tareaId

      console.log('Montado')
      console.log(esParaStock.value)
      await seleccionarEmpleadoOrigen(false)
      await seleccionarProyectoOrigen(false)

      if (transferenciaProductoEmpleadoStore.listadoMateriales.length) {
        transferencia.listado_productos = mapearProductos(transferenciaProductoEmpleadoStore.listadoMateriales)
      } else {
      }

      if (accion.value === acciones.nuevo) esDestinoStock.value = true
      establecerAutorizador()
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
      tarea_origen: { requiredIf: requiredIf(() => !esParaStock.value) }, //transferenciaProductoEmpleadoStore.origenProductos === destinosTareas.paraClienteFinal) },
      // tarea_destino: { requiredIf: requiredIf(() => !esParaStock.value) }, //transferenciaProductoEmpleadoStore.origenProductos === destinosTareas.paraClienteFinal) },
      solicitante: { required },
      cliente: { required },
    }

    const v$ = useVuelidate(reglas, transferencia)
    setValidador(v$.value)

    const validarExisteArchivo = new ValidarExisteArchivo(transferencia, refArchivo)
    mixin.agregarValidaciones(validarExisteArchivo)

    /************
     * Funciones
     ************/
    const resetearFormulario = () => {
      transferencia.proyecto_origen = null
      transferencia.proyecto_destino = null
      transferencia.etapa_origen = null
      transferencia.etapa_destino = null
      transferencia.tarea_origen = null
      transferencia.tarea_destino = null
      transferencia.empleado_destino = null

      listadosAuxiliares.productos = []
      listadosAuxiliares.etapas = []
      listadosAuxiliares.etapasDestino = []
      listadosAuxiliares.tareas = []
      listadosAuxiliares.tareasDestino = []
      listadosAuxiliares.proyectos = []
      listadosAuxiliares.proyectosDestino = []
    }

    const resetearFormularioExceptoProyectoOrigen = () => {
      transferencia.proyecto_destino = null
      transferencia.etapa_origen = null
      transferencia.etapa_destino = null
      transferencia.tarea_origen = null
      transferencia.tarea_destino = null
      transferencia.empleado_destino = null

      listadosAuxiliares.productos = []
      listadosAuxiliares.etapas = []
      listadosAuxiliares.etapasDestino = []
      listadosAuxiliares.tareas = []
      listadosAuxiliares.tareasDestino = []
      listadosAuxiliares.proyectosDestino = []
    }

    /* async function seleccionarClienteStock(idCliente: number) {
      console.log(idCliente)
      filtroEmpleado.empleado_id = transferencia.empleado_origen
      filtroEmpleado.cliente_id = transferencia.cliente
      await consultarProductosEmpleado()
      transferencia.listado_productos = mapearProductos(listadosAuxiliares.productos)
      establecerAutorizador()
    } */

    /**Mejora de observers */
    // ######################
    async function seleccionarEmpleadoOrigen(limpiarCampos = true) {
      if (accion.value === acciones.nuevo && limpiarCampos) {
        transferencia.proyecto_origen = null
        transferencia.etapa_origen = null
        transferencia.tarea_origen = null
        transferencia.cliente = undefined
        transferencia.listado_productos = []
      }

      if (transferencia.empleado_origen) {
        if (accion.value === acciones.nuevo) {
          await consultarTareasEmpleadoOrigen()
          await consultarProyectosEmpleadoOrigen()

          if (esParaStock.value) consultarClientesMaterialesEmpleado({ empleado_id: transferencia.empleado_origen })
          else consultarClientesProyectoEtapa()
        }
      }

      establecerAutorizador()
    }

    async function seleccionarProyectoOrigen(limpiarCampos = true) {
      if (limpiarCampos) {
        transferencia.tarea_origen = null
        transferencia.etapa_origen = null
        transferencia.cliente = null
        transferencia.listado_productos = []
      }

      const id = transferencia.proyecto_origen
      if (accion.value === acciones.nuevo) {
        if (id) {
          await consultarEtapasEmpleadoOrigen(id)
          await consultarTareasEmpleadoOrigen({ proyecto_id: id })
        } else {
          await consultarTareasEmpleadoOrigen()
        }
      }
    }

    async function seleccionarEtapaOrigen() {
      transferencia.tarea_origen = null
      transferencia.cliente = null
      if (transferencia.etapa_origen) consultarTareasEmpleadoOrigen({ etapa_id: transferencia.etapa_origen })
    }

    async function seleccionarTareaOrigen() {
      transferencia.cliente = undefined

      const id = transferencia.tarea_origen
      if (id) {
        // Buscar la tarea origen y extraer proyecto, etapa y cliente y colocarlo en transferencia
        const tarea = listadosAuxiliares.tareas.find((t: Tarea) => t.id === id)

        transferencia.proyecto_origen = tarea?.proyecto_id
        transferencia.etapa_origen = tarea?.etapa_id
        // transferencia.cliente = tarea?.cliente_id

        // si es de proyecto establecemos valores para filtro de proyecto
        if (transferencia.proyecto_origen) {
          filtroProyecto.empleado_id = transferencia.empleado_origen
          filtroProyecto.etapa_id = transferencia.etapa_origen
          filtroProyecto.proyecto_id = transferencia.proyecto_origen
          filtroProyecto.cliente_id = transferencia.cliente
        } else {
          // caso contrario establecemos valores para filtro de tarea
          filtroTarea.empleado_id = transferencia.empleado_origen
          filtroTarea.tarea_id = transferencia.tarea_origen
          filtroTarea.cliente_id = transferencia.cliente
        }

        if (transferencia.proyecto_origen) await consultarEtapasEmpleadoOrigen(transferencia.proyecto_origen)
        await consultarClientesProyectoEtapa()

        establecerAutorizador()
      }
      transferenciaProductoEmpleadoStore.listadoMateriales = []
    }

    async function seleccionarEmpleadoDestino() {
      if (accion.value === acciones.nuevo) {
        transferencia.proyecto_destino = null
        transferencia.etapa_destino = null
        transferencia.tarea_destino = null
      }

      if (transferencia.empleado_destino && accion.value === acciones.nuevo) {
        if (transferencia.proyecto_origen) { // Origen material de proyecto con etapas o sin etapas
          await consultarProyectosEmpleadoDestino()
          await consultarTareasEmpleadoDestino({ para_cliente_proyecto: destinosTareas.paraProyecto })
        } if (esParaStock.value) { // Origen material de stock
          await consultarProyectosEmpleadoDestino()
          await consultarTareasEmpleadoDestino()
        } else consultarTareasEmpleadoDestino({ para_cliente_proyecto: destinosTareas.paraClienteFinal }) // Tareas para cliente final
      }

      establecerAutorizador()
    }

    async function seleccionarProyectoDestino(limpiarCampos = true) {
      if (limpiarCampos) {
        transferencia.etapa_destino = null
        transferencia.tarea_destino = null
      }
      const id = transferencia.proyecto_destino

      if (accion.value === acciones.nuevo) {
        if (id) {
          await consultarEtapasEmpleadoDestino(id)
          await consultarTareasEmpleadoDestino({ proyecto_id: id }) // revisar q no se consulte si ya se consultaron las tareas por etapa
        } else {
          consultarTareasEmpleadoDestino({})//, !!transferencia.etapa_origen)
        }
      }

      establecerAutorizador()
    }

    async function seleccionarEtapaDestino() {
      if (transferencia.etapa_destino) await consultarTareasEmpleadoDestino({ etapa_id: transferencia.etapa_destino }) //, true)
    }

    async function seleccionarTareaDestino() {

      const id = transferencia.tarea_destino
      if (id) {
        // Buscar la tarea origen y extraer proyecto, etapa y cliente y colocarlo en transferencia
        // if (listadosAuxiliares.tareas.length) {
        const tarea = listadosAuxiliares.tareasDestino.find((t: Tarea) => t.id === id)
        console.log(listadosAuxiliares.tareasDestino)
        console.log(tarea)

        transferencia.proyecto_destino = tarea?.proyecto_id
        transferencia.etapa_destino = tarea?.etapa_id

        console.log('tarea ha cambiado !!!!')

        // if (accion.value === acciones.nuevo)
        if (transferencia.proyecto_destino) await consultarEtapasEmpleadoDestino(transferencia.proyecto_destino)
      }
      establecerAutorizador()
    }

    // Destino
    watch(computed(() => transferencia.proyecto_destino), (id) => {
      if (id) consultarEtapasEmpleadoDestino(id)
    })

    /*watchEffect(() => {
      if (transferencia.tarea_origen && !!listadosAuxiliares.tareas.length) establecerAutorizador()
    })*/

    /*******************************************************************************************
     * Funciones
     ******************************************************************************************/
    const { proyectos, filtrarProyectos, proyectosDestino, filtrarProyectosDestino, etapas, filtrarEtapas, etapasDestino, filtrarEtapasDestino } = useFiltrosListadosSelects(listadosAuxiliares)

    const filtroProyecto = reactive(new FiltroMiBodegaProyecto())
    const filtroEmpleado = reactive(new FiltroMiBodegaEmpleado())
    const filtroTarea = reactive(new FiltroMiBodega())

    const { consultarProductosTarea } = useMaterialesTarea(filtroTarea, listadosAuxiliares)
    const { consultarProductosEmpleado, consultarClientesMaterialesEmpleado } = useMaterialesEmpleado(filtroEmpleado, listadosAuxiliares)
    const { consultarProyectos, consultarProyectosDestino, consultarEtapas, consultarEtapasDestino, consultarProductosProyecto, consultarClientesMaterialesTarea } = useMaterialesProyecto(filtroProyecto, listadosAuxiliares)

    async function establecerAutorizador() {
      console.log('establecerAutorizador')
      console.log(accion.value)
      if (accion.value === acciones.nuevo) {
        console.log('establecerAutorizador nuevo...')

        if (transferencia.proyecto_origen) {
          // si es entre proyectos autoriza el jefe tecnico
          if (transferencia.proyecto_origen === transferencia.proyecto_destino) transferencia.autorizador = buscarProyecto().coordinador_id
          else transferencia.autorizador = listadosAuxiliares.autorizadores.filter((emp: Empleado) => emp.roles.includes(rolesSistema.jefe_tecnico))[0].id
        } else if (!transferencia.proyecto_origen && !transferencia.etapa_origen && !transferencia.tarea_origen) {
          // si es de stock personal autoriza el jefe inmediato
          if (transferencia.empleado_origen) {
            const { result } = await new EmpleadoController().consultar(transferencia.empleado_origen)
            // transferencia.autorizador = result.jefe ? parseInt(result.jefe) : null
            transferencia.autorizador = autorizadorJefeTecnico(result)
          }
        } else {
          // si es entre etapas y entre tareas autoriza el coordinador de la tarea
          const tarea = listadosAuxiliares.tareas.find((tarea: Tarea) => tarea.id === transferencia.tarea_origen)
          transferencia.autorizador = tarea?.coordinador_id
        }
      }
    }

    const autorizadorJefeTecnico = (empleado: Empleado) => {
      if (empleado.roles.includes(rolesSistema.jefe_tecnico))
        return typeof empleado.id === 'string' ? parseInt(empleado.id) : empleado.id
      else return typeof empleado.jefe === 'string' ? parseInt(empleado.jefe) : empleado.jefe
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

      if (esTransferenciaEntreEtapas() && accion.value === acciones.nuevo) transferencia.autorizador = buscarEtapa().supervisor_id
    }

    async function consultarProyectosEmpleadoDestino() {
      filtroProyecto.empleado_id = transferencia.empleado_destino
      await consultarProyectosDestino()
      const esEntreEtapas = esTransferenciaEntreEtapas()

      proyectosDestino.value = listadosAuxiliares.proyectosDestino

      if (!esEntreEtapas && accion.value === acciones.nuevo) transferencia.autorizador = buscarProyecto()?.coordinador_id
    }

    function esTransferenciaEntreEtapas() {
      return !!listadosAuxiliares.proyectos.find((proyecto: Proyecto) => proyecto.id === transferencia.proyecto_origen)?.etapas.length
    }

    // origen
    function buscarProyecto(): Proyecto {
      return listadosAuxiliares.proyectos.find((proyecto: Proyecto) => proyecto.id === transferencia.proyecto_origen)
    }

    function buscarEtapa(): Etapa {
      return listadosAuxiliares.etapas.find((etapa: Etapa) => etapa.id === transferencia.etapa_origen)
    }

    const puedeEditar = ref()
    function filtrarTransferenciasProductoEmpleado(tab: string) {
      tabSeleccionado.value = tab
      puedeEditar.value = tabSeleccionado.value === estadosTransacciones.pendiente ? true : false // authenticationStore.can('puede.autorizar.devoluciones')
      puedeEditar.value = tab == 'PENDIENTE'
      listar({ estado: tab })
    }

    async function consultarTareasEmpleadoOrigen(params?: any) {
      if (transferencia.empleado_origen) {
        const tareaController = new TareaController()
        const { result } = await tareaController.listar({ activas_empleado: 1, empleado_id: transferencia.empleado_origen, campos: 'id,codigo_tarea', ...params })
        listadosAuxiliares.tareas = result
        tareas.value = result
      }
    }

    async function consultarTareasEmpleadoDestino(params?: any) {//}, conEtapas?: boolean) {
      console.log('Consultando tareas destino')
      await cargarVista(async () => {
        if (transferencia.empleado_destino) {
          const tareaController = new TareaController()
          const { result } = await tareaController.listar({ activas_empleado: 1, empleado_id: transferencia.empleado_destino, campos: 'id,codigo_tarea', ...params })//, para_cliente_proyecto: destinosTareas.paraClienteFinal })
          listadosAuxiliares.tareasDestino = result //conEtapas ? result.filter((tarea: Tarea) => !!tarea.etapa) : result.filter((tarea: Tarea) => !tarea.etapa)
          tareasDestino.value = listadosAuxiliares.tareasDestino
        }
      })
    }

    async function subirArchivos() {
      await refArchivo.value.subir()
    }

    function mapearProductos(listado: any[]) {
      return listado.map((material: MaterialEmpleadoTarea) => {
        return {
          producto: material.producto,
          categoria: material.categoria,
          descripcion: material.detalle_producto,
          cantidad: material.stock_actual,
          medida: material.medida,
          id: material.detalle_producto_id,
          serial: material.serial,
        }
      })
    }

    /********
     * Hooks
     ********/
    onGuardado((id: number) => {
      idTransferencia.value = id
      setTimeout(() => {
        subirArchivos()
      }, 1)
    })

    onModificado((id: number) => {
      filtrarTransferenciasProductoEmpleado(tabSeleccionado.value)
      idTransferencia.value = id
      setTimeout(() => {
        subirArchivos()
      }, 1)
    })

    onConsultado(async () => {
      setTimeout(() => {
        refArchivo.value.listarArchivosAlmacenados(transferencia.id)
      }, 1);

      empleadosOrigen.value = listadosAuxiliares.empleados
      empleados.value = listadosAuxiliares.empleados

      transferenciaProductoEmpleadoStore.origenProductos = (transferencia.tarea_origen ? destinosTareas.paraClienteFinal : destinosTareas.paraProyecto)
      // esParaStock.value = !transferencia.tarea_origen // !transferencia.proyecto_origen && !transferencia.etapa_origen && !transferencia.tarea_origen
      esParaStock.value = !transferencia.proyecto_origen //|| !transferencia.tarea_origen
      esDestinoStock.value = !transferencia.proyecto_destino && !transferencia.etapa_destino && !transferencia.tarea_destino
      console.log('ON CONSULTADO...')

      await seleccionarEmpleadoOrigen()
      await seleccionarProyectoOrigen(false)
      await seleccionarEmpleadoDestino()
      await seleccionarProyectoDestino(false)
    })

    onReestablecer(() => {
      transferencia.empleado_origen = authenticationStore.user.id
      esDestinoStock.value = true
      refArchivo.value.limpiarListado()
      seleccionarEmpleadoOrigen()
    })

    /*******************************************************************************************
     * Botones de tabla
     ******************************************************************************************/
    const { botonEditarCantidad, botonEliminar } = useBotonesListadoProductos(transferencia, accion)

    //Configurar los listados
    // opciones_empleados.value = listadosAuxiliares.empleados
    empleadosOrigen.value = listadosAuxiliares.empleados
    listadosAuxiliares.empleadosOrigen = listadosAuxiliares.empleados
    empleados.value = listadosAuxiliares.empleados

    const tipoTransferencia = computed(() => {
      if (transferencia.proyecto_origen) return 'Transferencia entre proyectos'
      else if (!transferencia.proyecto_origen && transferencia.tarea_origen) return 'Transferencia entre tareas'
      else return 'Transferencia de stock'
    })

    async function refrescarListadosEmpleado(nombreListado: string) {
      switch (nombreListado) {
        case 'clientes':
          await consultarClientesMaterialesEmpleado({ empleado_id: transferencia.empleado_origen, cliente_id: transferencia.cliente })
          break
      }
    }

    async function refrescarListadosProyectos(nombreListado: string) {
      switch (nombreListado) {
        case 'clientes':
          /* const param: any = { proyecto_id: transferencia.proyecto_origen, etapa_id: transferencia.etapa_origen, filtrar_por_proyecto: true }
          if (filtroProyecto.etapa_id) delete param.etapa_id
          consultarClientesMaterialesTarea(param) */
          await consultarClientesProyectoEtapa()
          break
      }
    }

    async function consultarClientesProyectoEtapa() {
      // if (filtroProyecto.etapa_id) consultarClientesMaterialesTarea({ proyecto_id: transferencia.proyecto_origen, etapa_id: transferencia.etapa_origen, filtrar_por_etapa: true })
      // if (accion.value !== acciones.nuevo) return
      console.log(transferencia)
      if (transferencia.etapa_origen) {
        console.log('####### CON Etapa origen...')
        await consultarClientesMaterialesTarea({ proyecto_id: transferencia.proyecto_origen, etapa_id: transferencia.etapa_origen, filtrar_por_etapa: true })
      } else {
        console.log('####### SIN Etapa origen...')
        await consultarClientesMaterialesTarea({ proyecto_id: transferencia.proyecto_origen, etapa_id: transferencia.etapa_origen, filtrar_por_proyecto: true })
      }

      console.log('consultadndo clientes...')
    }

    const seleccionarEsStock = () => {
      if (esParaStock.value) consultarClientesMaterialesEmpleado({ empleado_id: transferencia.empleado_origen, cliente_id: transferencia.cliente })
      else transferencia.cliente = undefined
      transferencia.listado_productos = []
    }

    const seleccionarEsDestinoStock = () => {
      transferencia.proyecto_destino = null
      transferencia.tarea_destino = null
    }

    return {
      mixin, transferencia, disabled, accion, v$, acciones,
      configuracionColumnas: configuracionColumnasDevoluciones,
      authenticationStore,
      refArchivo,
      idTransferencia,
      // listados
      // opciones_empleados,
      empleadosOrigen,
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
      filtrarEmpleadosOrigen, ordenarEmpleadosOrigen,
      // consultarTareasClienteFinalMantenimiento,
      listadosAuxiliares,
      transferenciaProductoEmpleadoStore,
      // ordenarOpcionesEmpleados: () => opciones_empleados.value.sort((a: Empleado, b: Empleado) => ordernarListaString(a.apellidos!, b.apellidos!)),
      ordenarOpcionesEmpleados: () => empleadosOrigen.value.sort((a: Empleado, b: Empleado) => ordernarListaString(a.apellidos!, b.apellidos!)),
      // Computeds
      mostrarOrigenTarea: computed(() => transferenciaProductoEmpleadoStore.origenProductos === destinosTareas.paraClienteFinal),
      mostrarOrigenProyecto: computed(() => transferenciaProductoEmpleadoStore.origenProductos === destinosTareas.paraProyecto),
      mostrarOrigenPersonal: computed(() => transferenciaProductoEmpleadoStore.origenProductos === 'personal'),
      paraTarea: computed(() => transferenciaProductoEmpleadoStore.origenProductos === destinosTareas.paraClienteFinal),
      paraProyecto: computed(() => transferenciaProductoEmpleadoStore.origenProductos === destinosTareas.paraProyecto),
      tipoTransferencia,
      refrescarListadosEmpleado,
      refrescarListadosProyectos,
      esParaStock,
      esDestinoStock,
      seleccionarEsDestinoStock,
      // seleccionarClienteStock,
      seleccionarEsStock,
      existenProductos: computed(() => transferencia.listado_productos.length),
      filtroTarea,
      // mejora observers
      seleccionarEmpleadoOrigen,
      seleccionarProyectoOrigen,
      seleccionarEtapaOrigen,
      seleccionarTareaOrigen,
      seleccionarProyectoDestino,
      seleccionarEmpleadoDestino,
      seleccionarEtapaDestino,
      seleccionarTareaDestino,
      consultarProductos,
      consultado: computed(() => accion.value === acciones.editar || accion.value === acciones.consultar),
      botonDevolverASinCliente,
    }
  }
})
