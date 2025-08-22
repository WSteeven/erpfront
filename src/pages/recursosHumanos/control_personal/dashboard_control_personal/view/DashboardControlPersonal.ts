import { defineComponent, reactive, ref } from 'vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import GraficoGenerico from 'components/chartJS/GraficoGenerico.vue'
import { useNotificaciones } from 'shared/notificaciones'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import EChartComponente from 'components/ECHARTS/EChartComponente.vue'
import { maskFecha } from 'config/utils'
import ErrorComponent from 'components/ErrorComponent.vue'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { notificarErrores } from 'shared/utils'

export default defineComponent({
  name: 'DashboardControlPersonal',
  components: {
    ErrorComponent,
    EChartComponente,
    GraficoGenerico,
    EssentialTable
  },
  setup() {
    const dashboard = reactive({ tipo: '', fecha_inicio: '', fecha_fin: '' })
    const { notificarError } = useNotificaciones()
    const cargando = new StatusEssentialLoading()
    const opcionesTipos = ref([
      { label: 'Asistencias', value: 'ASISTENCIAS' },
      { label: 'Atrasos', value: 'ATRASOS' }
    ])
    const option = ref()
    const chartRef = ref()
    const totalAsistencias = ref(0)
    const totalAtrasos = ref(0)
    const registros = ref([])
    const graficos = ref([])
    const tabs = ref('graficos')
    const modoUnaColumna = ref(true)

    const reglas = {
      fecha_inicio: { required },
      fecha_fin: { required },
      tipo: { required }
    }
    const v$ = useVuelidate(reglas, dashboard)

    async function consultar() {
      if (await v$.value.$validate()) {
        try {
          cargando.activar()
          console.log('Consultando datos', dashboard)
          // Simulación de consulta a API
          totalAsistencias.value = Math.floor(Math.random() * 100)
          totalAtrasos.value = Math.floor(Math.random() * 50)
          const resultados = await consultarDashboard()
          console.log('resultados', resultados)
          cargando.desactivar()
        } catch (error) {
          console.error(error)
          notificarError(error)
          cargando.desactivar()
        }
      }
    }

    async function consultarDashboard() {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const url =
          apiConfig.URL_BASE +
          '/' +
          axios.getEndpoint(endpoints.dashboard_control_personal)
        const response: AxiosResponse = await axios.post(url, dashboard)
        console.log(response)
        option.value = response.data.graficos
        return response.data.results
      } catch (error) {
        notificarError('Error al consultar el dashboard ' + error)
        await notificarErrores(error)
      } finally {
        cargando.desactivar()
      }
    }

    async function graficoClickeado(e: any) {
      console.log('Click en el evento graficoClickeado', e)
    }

    async function graficoDataZoom(e: any) {
      console.log('Click en el evento graficoDataZoom', e)
    }

    async function graficoTerminado() {
      console.log('Click en el evento graficoTerminado')
    }

    async function graficoCambioLeyenda(e: any) {
      console.log('Click en el evento graficoCambioLeyenda', e)
    }

    return {
      chartRef,
      dashboard,
      option,
      opcionesTipos,
      totalAsistencias,
      totalAtrasos,
      registros,
      graficos,
      tabs,
      modoUnaColumna,
      v$,
      maskFecha,
      consultar,
      tiposFiltros: ['ASISTENCIAS', 'ATRASOS'],
      graficoClickeado,
      graficoDataZoom,
      graficoTerminado,
      graficoCambioLeyenda
    }
  }
})
