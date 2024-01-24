import { FiltroMiBodegaEmpleado } from 'pages/gestionTrabajos/miBodega/domain/FiltroMiBodegaEmpleado'
import { FiltroMiBodegaProyecto } from 'pages/gestionTrabajos/miBodega/domain/FiltroMiBodegaProyecto'
import { useMaterialesProyecto } from 'pages/gestionTrabajos/miBodega/application/UseMaterialesProyecto'
import { useMaterialesEmpleado } from 'pages/gestionTrabajos/miBodega/application/UseMaterialesEmpleado'
import { useMaterialesTarea } from 'pages/gestionTrabajos/miBodega/application/UseMaterialesTarea'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { FiltroMiBodega } from 'pages/gestionTrabajos/miBodega/domain/FiltroMiBodega'
import { defineComponent, ref, reactive, computed } from 'vue'
import { destinosTareas } from 'config/tareas.utils'
import { Tarea } from 'pages/gestionTrabajos/tareas/domain/Tarea'

export default defineComponent({
  props: {
    idEmpleado: {
      type: Number,
      required: true,
    }
  },
  setup(props) {
    /************
     * Variables
     ***********/
    const idEmpleado = computed(() => props.idEmpleado)
    const tab = ref()

    // Filtros
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

    function seleccionarTarea() {
      listadosAuxiliares.productos = []
      filtro.cliente_id = undefined
      const tarea = (listadosAuxiliares.tareas as any).find((tarea: Tarea) => tarea.id === filtro.tarea_id)

      consultarClientesMaterialesTarea({ tarea_id: filtro.tarea_id, filtrar_por_tarea: 1 })
    }

    // Refrescar listados
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
          consultarTareasClienteFinalMantenimiento(idEmpleado.value)
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

    /*******
    * Init
    *******/
    consultarTareasClienteFinalMantenimiento(idEmpleado.value)
    tab.value = destinosTareas.paraClienteFinal

    /**********
     * Filtros
     **********/
    const { tareas, filtrarTareas, proyectos, filtrarProyectos, etapas, filtrarEtapas } = useFiltrosListadosSelects(listadosAuxiliares)

    return {
      tab,
      filtro,
      listadosAuxiliares,
      tareas, filtrarTareas, proyectos, filtrarProyectos, etapas, filtrarEtapas,
      // funciones
      seleccionarTarea,
      refrescarListadosProyectos,
      refrescarListadosTareas,
      refrescarListadosEmpleado,
      consultarProductosTarea,
      // datos predefinidos
      destinosTareas,
    }
  }
})
