// Dependencias
import { configuracionColumnasMaterialEmpleadoTarea } from '../domain/configuracionColumnasMaterialEmpleadoTarea'
import { useTransferenciaProductoEmpleadoStore } from 'stores/transferenciaProductoEmpleado'
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { destinosTareas } from 'config/tareas.utils'
import { useQuasar } from 'quasar'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { useMaterialesEmpleado } from '../application/UseMaterialesEmpleado'
import { useMaterialesProyecto } from '../application/UseMaterialesProyecto'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { Proyecto } from 'pages/gestionTrabajos/proyectos/domain/Proyecto'
import { FiltroMiBodegaProyecto } from '../domain/FiltroMiBodegaProyecto'
import { FiltroMiBodegaEmpleado } from '../domain/FiltroMiBodegaEmpleado'
import { useMaterialesTarea } from '../application/UseMaterialesTarea'
import { Tarea } from 'pages/gestionTrabajos/tareas/domain/Tarea'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificacionStore } from 'stores/notificacion'
import { FiltroMiBodega } from '../domain/FiltroMiBodega'
import { useNotificaciones } from 'shared/notificaciones'
import { useCargandoStore } from 'stores/cargando'

export default defineComponent({
  components: { EssentialTable },
  setup() {
    /*********
     * Stores
     *********/
    const transferenciaProductoEmpleadoStore = useTransferenciaProductoEmpleadoStore()
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const authenticationStore = useAuthenticationStore()

    /************
     * Variables
     ************/
    const { notificarAdvertencia } = useNotificaciones()
    const tab = ref()

    onMounted(() => {
      tab.value = destinosTareas.personal
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
    })

    /************
     * Funciones
     ************/
    const { consultarProductosTarea, consultarClientesMaterialesTarea, consultarTareasClienteFinalMantenimiento } = useMaterialesTarea(filtro, listadosAuxiliares)
    const { consultarProductosEmpleado, consultarClientesMaterialesEmpleado } = useMaterialesEmpleado(filtroEmpleado, listadosAuxiliares)
    const { consultarProyectos, consultarEtapas, consultarProductosProyecto } = useMaterialesProyecto(filtroProyecto, listadosAuxiliares)

    function refrescarListadosProyectos(nombreListado: string) {
      switch (nombreListado) {
        case 'proyectos':
          consultarProyectos().then(() => proyectos.value = listadosAuxiliares.proyectos)
          break
        case 'clientes':
          if (filtroProyecto.etapa_id) consultarClientesMaterialesTarea({ proyecto_id: filtroProyecto.proyecto_id, etapa_id: filtroProyecto.etapa_id, filtrar_por_etapa: true })
          else consultarClientesMaterialesTarea({ proyecto_id: filtroProyecto.proyecto_id, etapa_id: filtroProyecto.etapa_id, filtrar_por_proyecto: true })
          break
      }
    }

    function refrescarListadosTareas(nombreListado: string) {
      switch (nombreListado) {
        case 'tareas':
          consultarTareasClienteFinalMantenimiento(authenticationStore.user.id)
          break
        case 'clientes':
          consultarClientesMaterialesTarea({ tarea_id: filtro.tarea_id, filtrar_por_tarea: 1 })
          break
      }
    }

    function refrescarListadosEmpleado(nombreListado: string) {
      switch (nombreListado) {
        case 'clientes':
          consultarClientesMaterialesEmpleado()
          break
      }
    }

    function seleccionarTarea() {
      listadosAuxiliares.productos = []
      filtro.cliente_id = undefined
      const tarea = (listadosAuxiliares.tareas as any).find((tarea: Tarea) => tarea.id === filtro.tarea_id)
      // filtro.cliente_id = tarea.cliente_id

      consultarClientesMaterialesTarea({ tarea_id: filtro.tarea_id, filtrar_por_tarea: 1 })
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

      if (!!!listadosAuxiliares.etapas.length) consultarClientesMaterialesTarea({ proyecto_id: filtroProyecto.proyecto_id, filtrar_por_proyecto: 1 })
    }

    function seleccionarEtapa() {
      consultarClientesMaterialesTarea({ proyecto_id: filtroProyecto.proyecto_id, etapa_id: filtroProyecto.etapa_id, filtrar_por_etapa: 1 })
    }

    function consultarProductosProyectoEtapa() {
      if (listadosAuxiliares.etapas.length && !filtroProyecto.etapa_id) return notificarAdvertencia('Debe seleccionar una etapa')
      consultarProductosProyecto()
    }

    /*******
     * Init
     *******/
    consultarClientesMaterialesTarea({ filtrar_por_tarea: true })
    consultarClientesMaterialesEmpleado()
    consultarTareasClienteFinalMantenimiento(authenticationStore.user.id)
    consultarProyectos().then(() => proyectos.value = listadosAuxiliares.proyectos)

    /************
     * Observers
     ************/
    watch((tab), () => {
      switch (tab.value) {
        case destinosTareas.paraClienteFinal:
          listadosAuxiliares.productos = listadosAuxiliares.productosTarea
          transferenciaProductoEmpleadoStore.listadoMateriales = listadosAuxiliares.productosTarea
          // consultarClientesMaterialesTarea({ filtrar_por_tarea: true })
          break
        case destinosTareas.paraProyecto:
          listadosAuxiliares.productos = listadosAuxiliares.productosProyectosEtapas
          transferenciaProductoEmpleadoStore.listadoMateriales = listadosAuxiliares.productosProyectosEtapas
          // consultarClientesMaterialesTarea({ filtrar_por_proyecto: true })
          break
        case 'personal':
          listadosAuxiliares.productos = listadosAuxiliares.productosStock
          transferenciaProductoEmpleadoStore.listadoMateriales = listadosAuxiliares.productosStock
          break
      }
    })

    /**********
     * Filtros
     **********/
    const { tareas, filtrarTareas, proyectos, filtrarProyectos, etapas, filtrarEtapas } = useFiltrosListadosSelects(listadosAuxiliares)

    return {
      tab,
      configuracionColumnasMaterialEmpleadoTarea,
      listadosAuxiliares,
      filtro,
      filtroProyecto,
      filtroEmpleado,
      destinosTareas,
      transferenciaProductoEmpleadoStore,
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
    }
  },
})
