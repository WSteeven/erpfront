// Dependencias
// import { configuracionColumnasMaterialEmpleadoTarea } from '../domain/configuracionColumnasMaterialEmpleadoTarea'
import { useTransferenciaProductoEmpleadoStore } from 'stores/transferenciaProductoEmpleado'
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { destinosTareas } from 'config/tareas.utils'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
// import { useMaterialesEmpleado } from '../application/UseMaterialesEmpleado'
// import { useMaterialesProyecto } from '../application/UseMaterialesProyecto'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { Proyecto } from 'pages/gestionTrabajos/proyectos/domain/Proyecto'
// import { FiltroMiBodegaProyecto } from '../domain/FiltroMiBodegaProyecto'
// import { FiltroMiBodegaEmpleado } from '../domain/FiltroMiBodegaEmpleado'
// import { useMaterialesTarea } from '../application/UseMaterialesTarea'
import { Tarea } from 'pages/gestionTrabajos/tareas/domain/Tarea'
import { useNotificacionStore } from 'stores/notificacion'
// import { FiltroMiBodega } from '../domain/FiltroMiBodega'
import { useNotificaciones } from 'shared/notificaciones'
import { useCargandoStore } from 'stores/cargando'
import { useQuasar } from 'quasar'
import { useAuthenticationStore } from 'stores/authentication'
import { FiltroMiBodega } from 'pages/gestionTrabajos/miBodega/domain/FiltroMiBodega'
import { FiltroMiBodegaProyecto } from 'pages/gestionTrabajos/miBodega/domain/FiltroMiBodegaProyecto'
import { FiltroMiBodegaEmpleado } from 'pages/gestionTrabajos/miBodega/domain/FiltroMiBodegaEmpleado'
import { useMaterialesTarea } from 'pages/gestionTrabajos/miBodega/application/UseMaterialesTarea'
import { useMaterialesEmpleado } from 'pages/gestionTrabajos/miBodega/application/UseMaterialesEmpleado'
import { useMaterialesProyecto } from 'pages/gestionTrabajos/miBodega/application/UseMaterialesProyecto'
import { configuracionColumnasMaterialEmpleadoTarea } from 'pages/gestionTrabajos/miBodega/domain/configuracionColumnasMaterialEmpleadoTarea'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { ordernarListaString } from 'shared/utils'
import { accionesTabla } from 'config/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'
import { ComportamientoModalesMaterialEmpleado } from '../application/ComportamientoModalesMaterialEmpleado'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

export default defineComponent({
  components: { EssentialTable, ModalEntidad },
  setup() {
    /*********
     * Stores
     *********/
    const transferenciaProductoEmpleadoStore = useTransferenciaProductoEmpleadoStore()
    const store = useAuthenticationStore()
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())

    // modales
    const modales = new ComportamientoModalesMaterialEmpleado()

    /************
     * Variables
     ************/
    const { notificarCorrecto, notificarAdvertencia, notificarError, prompt } = useNotificaciones()
    const cargando = new StatusEssentialLoading()
    const tab = ref()
    const empleadoSeleccionado = ref()

    onMounted(() => {
      tab.value = destinosTareas.paraClienteFinal
      proyectos.value = listadosAuxiliares.proyectos
    })

    const filtro = reactive(new FiltroMiBodega())
    const filtroProyecto = reactive(new FiltroMiBodegaProyecto())
    const filtroEmpleado = reactive(new FiltroMiBodegaEmpleado())

    const listadosAuxiliares = reactive({
      productos: [],
      productosTarea: [],
      productosProyectosEtapas: [],
      productosStock: [],
      //
      clientesMaterialesTarea: [],
      clientesMaterialesEmpleado: [],
      //
      tareas: [],
      proyectos: [],
      etapas: [],
      //
      empleados: [],
    })

    /************
     * Funciones
     ************/
    const { consultarProductosTarea, consultarClientesMaterialesTarea, consultarTareasClienteFinalMantenimiento } = useMaterialesTarea(filtro, listadosAuxiliares)
    const { consultarProductosEmpleado, consultarClientesMaterialesEmpleado } = useMaterialesEmpleado(filtroEmpleado, listadosAuxiliares)
    const { consultarProyectos, consultarEtapas, consultarProductosProyecto } = useMaterialesProyecto(filtroProyecto, listadosAuxiliares)

    function consultarProductosStock() {
      filtroEmpleado.empleado_id = empleadoSeleccionado.value
      consultarProductosEmpleado()
    }

    function refrescarListadosProyectos(nombreListado: string) {
      switch (nombreListado) {
        case 'proyectos':
          filtroProyecto.empleado_id = empleadoSeleccionado.value
          consultarProyectos().then(() => proyectos.value = listadosAuxiliares.proyectos)
          break
        case 'clientes':
          if (filtroProyecto.etapa_id) consultarClientesMaterialesTarea({ empleado_id: empleadoSeleccionado.value, proyecto_id: filtroProyecto.proyecto_id, etapa_id: filtroProyecto.etapa_id, filtrar_por_etapa: true })
          else consultarClientesMaterialesTarea({ empleado_id: empleadoSeleccionado.value, proyecto_id: filtroProyecto.proyecto_id, etapa_id: filtroProyecto.etapa_id, filtrar_por_proyecto: true })
          break
      }
    }

    function refrescarListadosTareas(nombreListado: string) {
      switch (nombreListado) {
        case 'tareas':
          consultarTareasClienteFinalMantenimiento(empleadoSeleccionado.value)
          break
        case 'clientes':
          consultarClientesMaterialesTarea({ empleado_id: empleadoSeleccionado.value, tarea_id: filtro.tarea_id, filtrar_por_tarea: 1 })
          break
      }
    }

    function refrescarListadosEmpleado(nombreListado: string) {
      switch (nombreListado) {
        case 'clientes':
          consultarClientesMaterialesEmpleado({ empleado_id: empleadoSeleccionado.value })
          break
      }
    }

    function resetearFiltros() {
      filtro.hydrate(new FiltroMiBodega())
      filtroProyecto.hydrate(new FiltroMiBodegaProyecto())
      filtroEmpleado.hydrate(new FiltroMiBodegaEmpleado())
      listadosAuxiliares.productos = []
      listadosAuxiliares.productosTarea = []
      listadosAuxiliares.productosProyectosEtapas = []
      listadosAuxiliares.productosStock = []

      cargarListado()
    }

    function cargarListado() {
      if (empleadoSeleccionado.value) {
        consultarTareasClienteFinalMantenimiento(empleadoSeleccionado.value)
        filtroProyecto.empleado_id = empleadoSeleccionado.value
        consultarProyectos().then(() => proyectos.value = listadosAuxiliares.proyectos)
        consultarClientesMaterialesEmpleado({ empleado_id: empleadoSeleccionado.value })
        consultarClientesMaterialesTarea({ empleado_id: empleadoSeleccionado.value, filtrar_por_tarea: true })
      }
    }

    function seleccionarTarea() {
      listadosAuxiliares.productos = []
      filtro.cliente_id = undefined
      const tarea = (listadosAuxiliares.tareas as any).find((tarea: Tarea) => tarea.id === filtro.tarea_id)
      // filtro.cliente_id = tarea.cliente_id

      consultarClientesMaterialesTarea({ empleado_id: empleadoSeleccionado.value, tarea_id: filtro.tarea_id, filtrar_por_tarea: 1 })
    }

    async function seleccionarProyecto() {
      if (filtroProyecto.proyecto_id) {
        await consultarEtapas(filtroProyecto.proyecto_id)
        etapas.value = listadosAuxiliares.etapas

        const proyecto: Proyecto | undefined = listadosAuxiliares.proyectos.find((proyecto: Proyecto) => proyecto.id === filtroProyecto.proyecto_id)
        filtroProyecto.cliente_id = undefined
        transferenciaProductoEmpleadoStore.codigoTarea = null
        // filtroProyecto.cliente_id = proyecto!!.cliente_id
      } else {
        listadosAuxiliares.etapas = []
      }

      listadosAuxiliares.productosProyectosEtapas = []
      listadosAuxiliares.productos = []
      filtroProyecto.etapa_id = null
      filtro.cliente_id = null

      if (!!!listadosAuxiliares.etapas.length) consultarClientesMaterialesTarea({ empleado_id: empleadoSeleccionado.value, proyecto_id: filtroProyecto.proyecto_id, filtrar_por_proyecto: 1 })
    }

    function seleccionarEtapa() {
      consultarClientesMaterialesTarea({ empleado_id: empleadoSeleccionado.value, proyecto_id: filtroProyecto.proyecto_id, etapa_id: filtroProyecto.etapa_id, filtrar_por_etapa: 1 })
    }

    function consultarProductosProyectoEtapa() {
      if (listadosAuxiliares.etapas.length && !filtroProyecto.etapa_id) return notificarAdvertencia('Debe seleccionar una etapa')
      consultarProductosProyecto()
    }

    async function consultarTodosEmpleados() {
      try {
        cargando.activar()
        const empleadosResponse = await new EmpleadoController().listar({
          campos: 'id,nombres,apellidos',
          estado: 1
        })
        listadosAuxiliares.empleados = empleadosResponse.result
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    function ordenarEmpleados() {
      empleados.value.sort((a: Empleado, b: Empleado) => ordernarListaString(a.apellidos!, b.apellidos!))
    }

    async function guardado(data) {
      console.log(data)
      refrescarListadosEmpleado('clientes')
      switch (data.tipo) {
        case destinosTareas.personal:
          consultarProductosStock()
          break
        case destinosTareas.paraClienteFinal:
          consultarProductosTarea({ empleado_id: empleadoSeleccionado.value })
          break
        default: //para proyecto
          consultarProductosProyectoEtapa()
          break
      }
    }

    async function actualizarCantidadItem(cantidad: number, detalle: number, cliente: number) {
      try {
        const axios = AxiosHttpRepository.getInstance()
        const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.actualizar_cantidad_material_empleado)
        const response: AxiosResponse = await axios.post(url, { tipo: tab.value, cantidad: cantidad, empleado: empleadoSeleccionado.value, detalle_producto_id: detalle, cliente_id: cliente })
        console.log(response)
        if (response.status = 200) {
          notificarCorrecto(response.data.mensaje)
          return true
        } else notificarAdvertencia(response.data.mensaje)
      } catch (error) {
        notificarError('Error al marcar como pagada la matrícula. ' + error)
      }
    }

    /*******
     * Init
    *******/
    // consultarClientesMaterialesTarea({ empleado_id: empleadoSeleccionado.value, filtrar_por_tarea: true })
    // consultarClientesMaterialesEmpleado()
    // consultarTareasClienteFinalMantenimiento(empleadoSeleccionado.value)
    // consultarProyectos().then(() => proyectos.value = listadosAuxiliares.proyectos)
    consultarTodosEmpleados()

    /************
     * Observers
     ************/
    watch((tab), () => {
      switch (tab.value) {
        case destinosTareas.paraClienteFinal:
          listadosAuxiliares.productos = listadosAuxiliares.productosTarea
          transferenciaProductoEmpleadoStore.listadoMateriales = listadosAuxiliares.productosTarea
          // consultarClientesMaterialesTarea({ empleado_id: empleadoSeleccionado.value, filtrar_por_tarea: true })
          break
        case destinosTareas.paraProyecto:
          listadosAuxiliares.productos = listadosAuxiliares.productosProyectosEtapas
          transferenciaProductoEmpleadoStore.listadoMateriales = listadosAuxiliares.productosProyectosEtapas
          // consultarClientesMaterialesTarea({ empleado_id: empleadoSeleccionado.value, filtrar_por_proyecto: true })
          break
        case destinosTareas.personal:
          listadosAuxiliares.productos = listadosAuxiliares.productosStock
          transferenciaProductoEmpleadoStore.listadoMateriales = listadosAuxiliares.productosStock
          break
      }
    })

    /**********
     * Filtros
     **********/
    const { tareas, filtrarTareas, proyectos, filtrarProyectos, etapas, filtrarEtapas, empleados, filtrarEmpleados } = useFiltrosListadosSelects(listadosAuxiliares)

    /**********
     * BOTONES DE TABLA
     **********/
    const btnCambiarClientePropietario: CustomActionTable = {
      titulo: 'Propietario',
      tooltip: 'Cambiar Cliente Propietario',
      icono: 'bi-arrow-left-right',
      color: 'positive',
      accion: ({ entidad, posicion }) => {
        console.log('btnCambiarClientePropietario', tab.value, entidad, posicion)
        const fila = entidad
        fila['tipo'] = tab.value
        fila['empleado'] = empleadoSeleccionado.value
        transferenciaProductoEmpleadoStore.filaAModificar = fila
        modales.abrirModalEntidad('CambiarClientePropietarioMaterialPage')
      },
      visible: () => store.esAdministrador
    }
    const btnModificarStock: CustomActionTable = {
      titulo: 'Stock',
      tooltip: 'Modificar Stock',
      icono: 'bi-pencil-square',
      color: 'primary',
      accion: ({ entidad, posicion }) => {
        console.log('btnModificarStock', tab.value, entidad, posicion)
        const data: CustomActionPrompt = {
          titulo: 'Modifica',
          mensaje: 'Ingresa la nueva cantidad',
          tipo: 'number',
          defecto: entidad.stock_actual,
          accion: (data) => {
            cargando.cargarConsulta(() => actualizarCantidadItem(data, entidad.detalle_producto_id, entidad.cliente_id))
            entidad.stock_actual = data
          }
        }
        prompt(data)
      },
      visible: () => store.esAdministrador
    }

    return {
      tab,
      configuracionColumnasMaterialEmpleadoTarea,
      listadosAuxiliares,
      filtro,
      filtroProyecto,
      filtroEmpleado,
      destinosTareas,
      transferenciaProductoEmpleadoStore,
      store, accionesTabla,
      modales,
      consultarEtapas,
      tareas,
      proyectos,
      etapas,
      filtrarTareas,
      filtrarProyectos,
      filtrarEtapas,
      seleccionarTarea,
      seleccionarProyecto,
      seleccionarEtapa,
      consultarProductosTarea,
      consultarProductosProyectoEtapa,
      consultarProductosEmpleado,
      refrescarListadosProyectos,
      refrescarListadosTareas,
      refrescarListadosEmpleado,
      mostrarBtnTransferirStockPersonal: computed(() => tab.value === destinosTareas.paraClienteFinal),
      ordenarEmpleados,
      empleados,
      filtrarEmpleados,
      empleadoSeleccionado,
      resetearFiltros,
      consultarProductosStock,
      guardado,
      //botones de tabla
      btnCambiarClientePropietario,
      btnModificarStock
    }
  },
})
