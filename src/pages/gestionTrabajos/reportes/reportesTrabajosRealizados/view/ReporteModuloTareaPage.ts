// Dependencias
import { configuracionColumnasSubtareasRealizadas } from '../domain/configuracionColumnasSubtareasRealizadas'
import { configuracionColumnasSubtareasRealizadasPorRegion } from '../domain/configuracionColumnasSubtareasRealizadasPorRegion'
import { configuracionColumnasSubtareasRealizadasPorGrupo } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupo'
import { configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia } from '../domain/configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia'
import { required } from '@vuelidate/validators'
import { defineComponent, reactive, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { tiposJornadas } from 'config/utils'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import TableView from 'components/tables/view/TableView.vue'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ReporteModuloTareaController } from '../infraestructure/ReporteModuloTareaController'
import { GrupoController } from 'pages/recursosHumanos/grupos/infraestructure/GrupoController'
import { ReporteSubtareasRealizadas } from '../domain/ReporteSubtareasRealizadas'
import { FiltroReporteMaterial } from '../domain/FiltroReporteMaterial'
import { ClienteController } from 'sistema/clientes/infraestructure/ClienteController'
import { useFiltrosListadosTarea } from 'pages/gestionTrabajos/tareas/application/FiltrosListadosTarea'
import { tiposReportes } from 'config/tareas.utils'
import { TipoTrabajoController } from 'pages/gestionTrabajos/tiposTareas/infraestructure/TipoTrabajoController'

export default defineComponent({
  components: { TabLayout, EssentialTable, SelectorImagen, TableView, Bar },
  setup() {
    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

    const mixin = new ContenedorSimpleMixin(
      ReporteSubtareasRealizadas,
      new ReporteModuloTareaController()
    )

    const { listadosAuxiliares, listado } = mixin.useReferencias()
    const { cargarVista, obtenerListados, listar } = mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        clientes: new ClienteController(),
        tiposTrabajos: new TipoTrabajoController(),
        grupos: {
          controller: new GrupoController(),
          params: { campos: 'id,nombre' }
        }
      })

      clientes.value = listadosAuxiliares.clientes
      tiposTrabajos.value = listadosAuxiliares.tiposTrabajos
    })

    const filtro = reactive(new FiltroReporteMaterial())
    const is_month = ref(false)
    const reporteModuloTareaController = new ReporteModuloTareaController()
    const trabajosRealizados = ref([])
    const trabajoRealizadoPorRegion = ref([])
    const trabajoRealizadoPorRegionTipoTrabajo = ref([])
    const trabajoRealizadoPorGrupoTipoTrabajo = ref([])
    const trabajoRealizadoPorGrupoTiposTrabajosEmergencia = ref([])

    const trabajosRealizadosBar = ref()
    const trabajoRealizadoPorRegionBar = ref()
    const trabajoRealizadoPorRegionTipoTrabajoBar = ref()
    const trabajoRealizadoPorGrupoTipoTrabajoBar = ref()
    const trabajoRealizadoPorGrupoTiposTrabajosEmergenciaBar = ref()

    const options = {
      responsive: true,
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true
        }
      }
    }

    const optionsVertical = {
      responsive: true,
    }

    // Reglas de validacion
    const reglas = {
      mes_anio: { required },
      grupo: { required },
      cliente: { required },
    }

    const v$ = useVuelidate(reglas, filtro)

    /*********
   * Filtros
   **********/
    const {
      clientes,
      filtrarClientes,
      tiposTrabajos,
      filtrarTiposTrabajos,
    } = useFiltrosListadosTarea(listadosAuxiliares, filtro)

    async function consultarReporte() {
      if (await v$.value.$validate())
        listar(filtro)
    }

    function checkValue(val, reason, details) {
      is_month.value = reason === 'month' ? false : true
      consultarTodo()
    }

    async function consultar() {
      const { result } = await reporteModuloTareaController.listar({ mes_anio: filtro.mes_anio, cliente_id: filtro.cliente, tipo_reporte: tiposReportes.TRABAJOS_REALIZADOS })
      trabajosRealizados.value = result
      const labels = result.map((item) => item.tipo_trabajo)
      const valores = result.map((item) => item.suma_trabajo)
      trabajosRealizadosBar.value = mapearDatos(labels, valores)
    }

    async function consultarTrabajoRealizadoPorRegion() {
      const { result } = await reporteModuloTareaController.listar({ mes_anio: filtro.mes_anio, tipo_reporte: tiposReportes.TRABAJO_REALIZADO_POR_REGION })
      trabajoRealizadoPorRegion.value = result
      const labels = result.map((item) => item.region)
      const valores = result.map((item) => item.suma_trabajo)
      trabajoRealizadoPorRegionBar.value = mapearDatos(labels, valores)
    }

    async function consultarTrabajoRealizadoPorRegionTipoTrabajo() {
      const { result } = await reporteModuloTareaController.listar({ mes_anio: filtro.mes_anio, tipo_trabajo_id: filtro.tipo_trabajo, tipo_reporte: tiposReportes.TRABAJO_REALIZADO_POR_REGION_TIPO_TRABAJO })
      trabajoRealizadoPorRegionTipoTrabajo.value = result
      const labels = result.map((item) => item.region)
      const valores = result.map((item) => item.suma_trabajo)
      trabajoRealizadoPorRegionTipoTrabajoBar.value = mapearDatos(labels, valores)
    }

    async function consultarTrabajoRealizadoPorGrupoTipoTrabajo() {
      const { result } = await reporteModuloTareaController.listar({ mes_anio: filtro.mes_anio, tipo_trabajo_id: filtro.tipo_trabajo, tipo_reporte: tiposReportes.TRABAJO_REALIZADO_POR_GRUPO_TIPO_TRABAJO })
      trabajoRealizadoPorGrupoTipoTrabajo.value = result
      const labels = result.map((item) => item.grupo)
      const valores = result.map((item) => item.suma_trabajo)
      trabajoRealizadoPorGrupoTipoTrabajoBar.value = mapearDatos(labels, valores)
    }

    async function consultarTrabajoRealizadoPorGrupoTiposTrabajosEmergencia() {
      const { result } = await reporteModuloTareaController.listar({ mes_anio: filtro.mes_anio, tipo_reporte: tiposReportes.TRABAJO_REALIZADO_POR_GRUPO_TIPOS_TRABAJOS_EMERGENCIA })
      trabajoRealizadoPorGrupoTiposTrabajosEmergencia.value = result
      const labels = result.map((item) => item.corte_fibra)
      const valores = result.map((item) => item.suma_trabajo)
      trabajoRealizadoPorGrupoTiposTrabajosEmergenciaBar.value = mapearDatos(labels, valores)
    }

    function mapearDatos(labels: [], valores: []) {
      return {
        labels: labels,
        datasets: [
          {
            backgroundColor: '#0879dc',
            label: 'Tipos de trabajos realizados',
            data: valores,
          }
        ]
      }
    }

    function consultarTodo() {
      consultar()
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
      options,
      optionsVertical,
      // Configuracion columnas
      configuracionColumnasSubtareasRealizadas,
      configuracionColumnasSubtareasRealizadasPorRegion,
      configuracionColumnasSubtareasRealizadasPorGrupo,
      configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia,
      // Consultar
      consultarTodo,
      consultar,
      consultarTrabajoRealizadoPorRegion,
      consultarTrabajoRealizadoPorRegionTipoTrabajo,
      consultarTrabajoRealizadoPorGrupoTipoTrabajo,
      consultarTrabajoRealizadoPorGrupoTiposTrabajosEmergencia,
      // Listados
      trabajosRealizados,
      trabajoRealizadoPorRegion,
      trabajoRealizadoPorRegionTipoTrabajo,
      trabajoRealizadoPorGrupoTipoTrabajo,
      trabajoRealizadoPorGrupoTiposTrabajosEmergencia,
      // Bar
      trabajosRealizadosBar,
      trabajoRealizadoPorRegionBar,
      trabajoRealizadoPorRegionTipoTrabajoBar,
      trabajoRealizadoPorGrupoTipoTrabajoBar,
      trabajoRealizadoPorGrupoTiposTrabajosEmergenciaBar,
    }
  },
})
