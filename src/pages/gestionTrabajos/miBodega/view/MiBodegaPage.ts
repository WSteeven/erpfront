// Dependencias
import { configuracionColumnasMaterialEmpleadoTarea } from '../domain/configuracionColumnasMaterialEmpleadoTarea'
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { destinosTareas } from 'config/tareas.utils'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { useListadoMaterialesDevolucionStore } from 'stores/listadoMaterialesDevolucion'
import { useMaterialesEmpleado } from '../application/UseMaterialesEmpleado'
import { useMaterialesProyecto } from '../application/UseMaterialesProyecto'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { Proyecto } from 'pages/gestionTrabajos/proyectos/domain/Proyecto'
import { FiltroMiBodegaProyecto } from '../domain/FiltroMiBodegaProyecto'
import { FiltroMiBodegaEmpleado } from '../domain/FiltroMiBodegaEmpleado'
import { useMaterialesTarea } from '../application/UseMaterialesTarea'
import { Tarea } from 'pages/gestionTrabajos/tareas/domain/Tarea'
import { useNotificacionStore } from 'stores/notificacion'
import { FiltroMiBodega } from '../domain/FiltroMiBodega'
import { useNotificaciones } from 'shared/notificaciones'
import { useCargandoStore } from 'stores/cargando'
import { useQuasar } from 'quasar'

export default defineComponent({
  components: { EssentialTable },
  setup() {
    /*********
     * Stores
     *********/
    const listadoMaterialesDevolucionStore = useListadoMaterialesDevolucionStore()
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())

    /************
     * Variables
     ************/
    const campoTareaProyecto = ref('Todas las tareas asignadas')
    const { notificarAdvertencia } = useNotificaciones()
    const tab = ref()

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
      clientesMaterialesTarea: [],
      clientesMaterialesEmpleado: [],
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
          consultarClientesMaterialesTarea()
          break
      }
    }

    function refrescarListadosTareas(nombreListado: string) {
      switch (nombreListado) {
        case 'tareas':
          consultarTareasClienteFinalMantenimiento()
          break
        case 'clientes':
          consultarClientesMaterialesTarea()
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
      const tarea = (listadosAuxiliares.tareas as any).find((tarea: Tarea) => tarea.id === filtro.tarea_id)
      filtro.cliente_id = tarea.cliente_id
    }

    async function seleccionarProyecto() {
      if (filtroProyecto.proyecto_id) {
        await consultarEtapas(filtroProyecto.proyecto_id)
        etapas.value = listadosAuxiliares.etapas

        const proyecto: Proyecto | undefined = listadosAuxiliares.proyectos.find((proyecto: Proyecto) => proyecto.id === filtroProyecto.proyecto_id)
        filtroProyecto.cliente_id = proyecto!!.cliente_id
      } else {
        listadosAuxiliares.etapas = []
      }

      listadosAuxiliares.productosProyectosEtapas = []
      listadosAuxiliares.productos = []
      filtroProyecto.etapa_id = null
      filtro.cliente_id = null
    }

    function consultarProductosProyectoEtapa() {
      if (listadosAuxiliares.etapas.length && !filtroProyecto.etapa_id) return notificarAdvertencia('Debe seleccionar una etapa')
      consultarProductosProyecto()
    }

    /*******
     * Init
     *******/
    consultarClientesMaterialesTarea()
    consultarClientesMaterialesEmpleado()
    consultarTareasClienteFinalMantenimiento()
    consultarProyectos().then(() => proyectos.value = listadosAuxiliares.proyectos)

    /************
     * Observers
     ************/
    watch((tab), () => {
      switch (tab.value) {
        case destinosTareas.paraClienteFinal:
          listadosAuxiliares.productos = listadosAuxiliares.productosTarea
          listadoMaterialesDevolucionStore.listadoMateriales = listadosAuxiliares.productosTarea
          break
        case destinosTareas.paraProyecto:
          listadosAuxiliares.productos = listadosAuxiliares.productosProyectosEtapas
          listadoMaterialesDevolucionStore.listadoMateriales = listadosAuxiliares.productosProyectosEtapas
          break
        case 'personal':
          listadosAuxiliares.productos = listadosAuxiliares.productosStock
          listadoMaterialesDevolucionStore.listadoMateriales = listadosAuxiliares.productosStock
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
      listadoMaterialesDevolucionStore,
      consultarEtapas,
      tareas,
      proyectos,
      etapas,
      filtrarTareas,
      filtrarProyectos,
      filtrarEtapas,
      seleccionarTarea,
      seleccionarProyecto,
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
