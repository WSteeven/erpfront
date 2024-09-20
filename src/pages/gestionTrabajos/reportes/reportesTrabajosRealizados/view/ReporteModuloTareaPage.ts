// Dependencias
import { configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia'
import { configuracionColumnasSubtareasRealizadasPorRegion } from '../domain/configuracionColumnasSubtareasRealizadasPorRegion'
import { configuracionColumnasSubtareasRealizadasPorGrupo } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupo'
import { configuracionColumnasSubtarea } from 'pages/gestionTrabajos/subtareas/domain/configuracionColumnasSubtarea'
import { optionsBarHorizontal as options, optionsBarVertical as optionsVertical } from 'config/graficoGenerico'
import { configuracionColumnasSubtareasRealizadas } from '../domain/configuracionColumnasSubtareasRealizadas'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { defineComponent, reactive, ref } from 'vue'
import { obtenerFechaActual } from 'shared/utils'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { acciones, accionesTabla, tiposJornadas } from 'config/utils'

import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import GraficoGenerico from 'components/chartJS/GraficoGenerico.vue'
import TableView from 'components/tables/view/TableView.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

// Logica y controladores
import { CausaIntervencionController } from 'pages/gestionTrabajos/causasIntervenciones/infraestructure/CausaIntervencionController'
import { TipoTrabajoController } from 'pages/gestionTrabajos/tiposTareas/infraestructure/TipoTrabajoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useFiltrosListadosTarea } from 'pages/gestionTrabajos/tareas/application/FiltrosListadosTarea'
import { ReporteModuloTareaController } from '../infraestructure/ReporteModuloTareaController'
import { GrupoController } from 'pages/recursosHumanos/grupos/infraestructure/GrupoController'
import { ClienteController } from 'sistema/clientes/infraestructure/ClienteController'
import { ReporteSubtareasRealizadas } from '../domain/ReporteSubtareasRealizadas'
import { FiltroReporteMaterial } from '../domain/FiltroReporteMaterial'
import { tiposReportes } from 'config/tareas.utils'
import { useBotonesTablaSubtarea } from 'pages/gestionTrabajos/subtareas/application/BotonesTablaSubtarea'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { SubtareaController } from 'pages/gestionTrabajos/subtareas/infraestructure/SubtareaController'
import { ComportamientoModalesSubtarea } from 'pages/gestionTrabajos/subtareas/application/ComportamientoModalesSubtarea'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useSubtareaStore } from 'stores/subtarea'

export default defineComponent({
  components: { TabLayout, EssentialTable, SelectorImagen, TableView, GraficoGenerico, Bar },
  setup() {
    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

    /*********
     * Stores
     *********/
    const subtareaStore = useSubtareaStore()

    /*********
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(
      ReporteSubtareasRealizadas,
      new ReporteModuloTareaController()
    )

    const { listadosAuxiliares, listado } = mixin.useReferencias()
    const { cargarVista, obtenerListados, listar } = mixin.useComportamiento()

    const mixinSubtarea = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
    const { listado: subtareas } = mixinSubtarea.useReferencias()
    const { listar: listarSubtareas } = mixinSubtarea.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        clientes: new ClienteController(),
        tiposTrabajos: {
          controller: new TipoTrabajoController(),
          params: { activo: 1, campos: 'id,descripcion,cliente_id' },
        },
        grupos: {
          controller: new GrupoController(),
          params: { campos: 'id,nombre' }
        },
        causasIntervenciones: new CausaIntervencionController(),
      })

      clientes.value = listadosAuxiliares.clientes
      tiposTrabajos.value = listadosAuxiliares.tiposTrabajos
      causasIntervenciones.value = listadosAuxiliares.causasIntervenciones
    })

    /*************
     * Variables
     *************/
    const filtro = reactive(new FiltroReporteMaterial())
    const is_month = ref(false)
    const reporteModuloTareaController = new ReporteModuloTareaController()
    const cargando = new StatusEssentialLoading()

    const trabajosRealizados = ref([])
    const trabajoRealizadoPorRegion = ref([])
    const trabajoRealizadoPorRegionTipoTrabajo = ref([])
    const trabajoRealizadoPorGrupoTipoTrabajo = ref([])
    const trabajoRealizadoPorGrupoTiposTrabajosEmergencia = ref([])
    const trabajoRealizadoPorGrupoCausaIntervencion = ref([])

    const trabajosRealizadosBar = ref()
    const trabajoRealizadoPorRegionBar = ref()
    const trabajoRealizadoPorRegionTipoTrabajoBar = ref()
    const trabajoRealizadoPorGrupoTipoTrabajoBar = ref()
    const trabajoRealizadoPorGrupoTiposTrabajosEmergenciaBar = ref()
    const trabajoRealizadoPorGrupoCausaIntervencionBar = ref()
    const graficosCausaIntervencion = ref([])
    const modalAbierto = ref(false)

    /**********
     * Reglas
     **********/
    const reglas = {
      mes_anio: { required },
      grupo: { required },
      cliente: { required },
    }

    const v$ = useVuelidate(reglas, filtro)

    /**********
     * Filtros
     **********/
    const {
      clientes,
      filtrarClientes,
      tiposTrabajos,
      filtrarTiposTrabajos,
      causasIntervenciones,
      filtrarCausasIntervenciones,
    } = useFiltrosListadosTarea(listadosAuxiliares, filtro)

    filtro.mes_anio = obtenerFechaActual().substring(3)

    /**********
    * Modales
    **********/
    const modalesSubtarea = new ComportamientoModalesSubtarea()

    /*************
     * Funciones
     *************/
    const { btnSeguimiento } = useBotonesTablaSubtarea(subtareas, modalesSubtarea)
    const botonVer: CustomActionTable<Subtarea> = {
      titulo: 'Más detalles',
      icono: 'bi-eye',
      accion: async ({ entidad }) => {
        subtareaStore.idSubtareaSeleccionada = entidad.id
        subtareaStore.accion = acciones.consultar
        modalesSubtarea.abrirModalEntidad('SubtareaPage')
      },
    }

    async function consultarReporte() {
      if (await v$.value.$validate())
        listar(filtro)
    }

    function checkValue(val, reason, details) {
      is_month.value = reason === 'month' ? false : true
      resetearGraficosCliente()
    }

    async function consultarTiposTrabajosRealizados() {
      cargando.activar()
      const { result } = await reporteModuloTareaController.listar({ mes_anio: filtro.mes_anio, cliente_id: filtro.cliente, tipo_reporte: tiposReportes.TRABAJOS_REALIZADOS })
      trabajosRealizadosBar.value = result
      cargando.desactivar()
    }

    async function consultarTrabajoRealizadoPorRegion() {
      cargando.activar()
      const { result } = await reporteModuloTareaController.listar({ mes_anio: filtro.mes_anio, cliente_id: filtro.cliente, tipo_reporte: tiposReportes.TRABAJO_REALIZADO_POR_REGION })
      trabajoRealizadoPorRegionBar.value = result
      cargando.desactivar()
    }

    async function consultarTrabajoRealizadoPorRegionTipoTrabajo() {
      cargando.activar()
      const { result } = await reporteModuloTareaController.listar({ mes_anio: filtro.mes_anio, cliente_id: filtro.cliente, tipo_trabajo_id: filtro.tipo_trabajo, tipo_reporte: tiposReportes.TRABAJO_REALIZADO_POR_REGION_TIPO_TRABAJO })
      trabajoRealizadoPorRegionTipoTrabajoBar.value = result
      cargando.desactivar()
    }

    async function consultarTrabajoRealizadoPorGrupoTipoTrabajo() {
      cargando.activar()
      const { result } = await reporteModuloTareaController.listar({ mes_anio: filtro.mes_anio, tipo_trabajo_id: filtro.tipo_trabajo, tipo_reporte: tiposReportes.TRABAJO_REALIZADO_POR_GRUPO_TIPO_TRABAJO })
      trabajoRealizadoPorGrupoTipoTrabajoBar.value = result
      cargando.desactivar()
    }

    async function consultarTrabajoRealizadoPorGrupoTiposTrabajosEmergencia() {
      cargando.activar()
      const { result } = await reporteModuloTareaController.listar({ mes_anio: filtro.mes_anio, cliente_id: filtro.cliente, tipo_reporte: tiposReportes.TRABAJO_REALIZADO_POR_GRUPO_TIPOS_TRABAJOS_EMERGENCIA })
      trabajoRealizadoPorGrupoTiposTrabajosEmergencia.value = result

      const data = trabajoRealizadoPorGrupoTiposTrabajosEmergencia.value.map((fila: any) => {
        return [fila.corte_fibra, fila.mantenimiento, fila.soporte, fila.tarea_programada]
      })

      const labels = trabajoRealizadoPorGrupoTiposTrabajosEmergencia.value.map((fila: any) => {
        return fila.grupo
      })

      const labelsColumns = [{ label: 'CORTE FIBRA', color: '#999eb0' }, { label: 'MANTENIMIENTO', color: '#91bf67' }, { label: 'SOPORTE', color: '#94a5d9' }, { label: 'TAREA PROGRAMADA', color: '#818a5f' }]

      // Transponer la matriz
      trabajoRealizadoPorGrupoTiposTrabajosEmergenciaBar.value = null
      if (data.length) {
        const transposed = transposeMatrix(data)
        trabajoRealizadoPorGrupoTiposTrabajosEmergenciaBar.value = mapearDatosMultiple(labels, labelsColumns, transposed)
      }

      cargando.desactivar()
    }

    function transposeMatrix(matrix) {
      return matrix[0].map((_, index) => matrix.map(row => row[index]));
    }

    async function consultarTrabajoRealizadoPorGrupoCausaIntervencion() {
      cargarVista(async () => {

        const { result } = await reporteModuloTareaController.listar({ mes_anio: filtro.mes_anio, tipo_trabajo_id: filtro.tipo_trabajo, tipo_reporte: tiposReportes.TRABAJO_REALIZADO_POR_GRUPO_CAUSA_INTERVENCION })
        graficosCausaIntervencion.value = result
      })
    }

    function mapearDatosMultiple(labels: string[], labelsColumns: any, valores: any[][]) {
      return {
        labels: labels,
        datasets: valores.map((item, index) => mapearDatosMultiplesColumnas(labelsColumns[index], item))
      }
    }

    function mapearDatosMultiplesColumnas(labelsColumns: any, data: any[]) {
      return {
        label: labelsColumns.label,
        backgroundColor: labelsColumns.color,
        data,
      }
    }

    const consultarCliente = () => {
      consultarTiposTrabajosRealizados()
      consultarTrabajoRealizadoPorRegion()
      consultarTrabajoRealizadoPorGrupoTiposTrabajosEmergencia()

      resetearGraficosTipoTrabajo()
    }

    const consultarTipoTrabajo = () => {
      consultarTrabajoRealizadoPorGrupoCausaIntervencion()
      consultarTrabajoRealizadoPorRegionTipoTrabajo()
      consultarTrabajoRealizadoPorGrupoTipoTrabajo()
    }

    const resetearGraficosCliente = () => {
      filtro.cliente = null

      trabajosRealizadosBar.value = []
      trabajoRealizadoPorRegionBar.value = null
      trabajoRealizadoPorGrupoTiposTrabajosEmergenciaBar.value = null

      resetearGraficosTipoTrabajo()
    }

    const resetearGraficosTipoTrabajo = () => {
      filtro.tipo_trabajo = null

      graficosCausaIntervencion.value = []
      trabajoRealizadoPorRegionTipoTrabajoBar.value = null
      trabajoRealizadoPorGrupoTipoTrabajoBar.value = null
    }

    const mostrarTablaSubtareas = (data) => {
      console.log(data)
      // listarSubtareas({})
      modalAbierto.value = true
    }

    return {
      v$,
      mixin,
      listar,
      listado,
      filtro,
      listadosAuxiliares,
      tiposJornadas,
      consultarReporte,
      is_month,
      checkValue,
      clientes,
      filtrarClientes,
      tiposTrabajos,
      filtrarTiposTrabajos,
      causasIntervenciones,
      filtrarCausasIntervenciones,
      options,
      optionsVertical,
      // Configuracion columnas
      configuracionColumnasSubtareasRealizadas,
      configuracionColumnasSubtareasRealizadasPorRegion,
      configuracionColumnasSubtareasRealizadasPorGrupo,
      configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia,
      // Consultar
      consultarTiposTrabajosRealizados,
      consultarTrabajoRealizadoPorRegion,
      consultarTrabajoRealizadoPorRegionTipoTrabajo,
      consultarTrabajoRealizadoPorGrupoTipoTrabajo,
      consultarTrabajoRealizadoPorGrupoTiposTrabajosEmergencia,
      consultarTrabajoRealizadoPorGrupoCausaIntervencion,
      // Listados
      trabajosRealizados,
      trabajoRealizadoPorRegion,
      trabajoRealizadoPorRegionTipoTrabajo,
      trabajoRealizadoPorGrupoTipoTrabajo,
      trabajoRealizadoPorGrupoTiposTrabajosEmergencia,
      trabajoRealizadoPorGrupoCausaIntervencion,
      // Bar
      trabajosRealizadosBar,
      trabajoRealizadoPorRegionBar,
      trabajoRealizadoPorRegionTipoTrabajoBar,
      trabajoRealizadoPorGrupoTipoTrabajoBar,
      trabajoRealizadoPorGrupoTiposTrabajosEmergenciaBar,
      trabajoRealizadoPorGrupoCausaIntervencionBar,
      graficosCausaIntervencion,
      consultarCliente,
      consultarTipoTrabajo,
      modalAbierto,
      columnasSubtareas: [...configuracionColumnasSubtarea, accionesTabla],
      mostrarTablaSubtareas,
      subtareas,
      btnSeguimiento,
      botonVer,
    }
  },
})
