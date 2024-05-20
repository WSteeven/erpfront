// Dependencias
import { ConfiguracionColumnasReporteCuestionarioEmpleado } from '../domain/configuracionColumnasReporteCuestionarioPisicosocial'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { HttpResponseGet } from 'shared/http/domain/HttpResponse'
import { useAuthenticationStore } from 'stores/authentication'
import { useCargandoStore } from 'stores/cargando'
import { imprimirArchivo } from 'shared/utils'
import { defineComponent, ref } from 'vue'
import { apiConfig } from 'config/api'
import { useQuasar } from 'quasar'
import axios from 'axios'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { RespuestaCuestionarioEmpleadoController } from '../infrestructure/RespuestaCuestionarioEmpleadoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { RespuestaCuestionarioEmpleado } from '../domain/RespuestaCuestionarioEmpleado'
import { ReporteCuestionarioController } from '../infrestructure/ReporteCuestionarioController'
import { medico } from 'config/endpoints/medico'

export default defineComponent({
  components: { EssentialTable, ModalEntidad },
  setup() {
    /********
    * Store
    ********/
    const authenticationStore = useAuthenticationStore()
    useCargandoStore().setQuasar(useQuasar())

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(RespuestaCuestionarioEmpleado, new RespuestaCuestionarioEmpleadoController())
    const { cargarVista } = mixin.useComportamiento()

    /************
     * Variables
     ************/
    const listado = ref([])
    const reporteCuestionarioController = new ReporteCuestionarioController()

    /****************
     * Botones tabla
     ****************/
    const btnImprimirReporte: CustomActionTable = {
      titulo: 'Exportar .xlsx con respuestas',
      icono: 'bi-table',
      color: 'positive',
      visible: () => authenticationStore.can('puede.ver.reporte_cuestionarios_psicosocial'),
      accion: () => imprimirReporte()
    }

    const btnImprimirRespuestas: CustomActionTable = {
      titulo: 'Exportar txt (FPSICO 4.1)',
      icono: 'bi-printer',
      color: 'primary',
      visible: () => authenticationStore.can('puede.ver.reporte_cuestionarios_psicosocial'),
      accion: () => imprimir_respuesta()
    }

    /************
     * Funciones
     ************/
    async function reporte() {
      const { result } = await reporteCuestionarioController.listar()
      listado.value = result
    }

    async function imprimirReporte(): Promise<void> {
      const fechaActual = new Date()
      const filename = 'reporte_cuestionarios_pisicosocial_' + fechaActual.toLocaleString()
      const urlPdf = apiConfig.URL_BASE + '/' + AxiosHttpRepository.getInstance().getEndpoint(medico.reporte_cuestionario) + '?imprimir=true'
      imprimirArchivo(urlPdf, 'GET', 'blob', 'xlsx', filename, null)
      // const url_pdf = apiConfig.URL_BASE + '/api/medico/reporte-cuestionario?imprimir=true'
    }

    async function imprimir_respuesta(): Promise<void> {
      const fecha_actual = new Date()
      const filename =
        'respuesta_cuestionarios_pisicosocial_' + fecha_actual.toLocaleString()
      const url_pdf = apiConfig.URL_BASE + '/api/medico/imprimir-cuestionario'
      imprimirArchivo(url_pdf, 'GET', 'blob', 'text', filename, null,'plain')
    }

    /*******
     * Init
     *******/
    cargarVista(async () => {
      await reporte()
    })

    return {
      listado,
      ConfiguracionColumnasReporteCuestionarioEmpleado,
      btnImprimirReporte,
      btnImprimirRespuestas
    }
  },
})
