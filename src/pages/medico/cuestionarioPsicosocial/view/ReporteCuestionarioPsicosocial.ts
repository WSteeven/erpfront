// Dependencias
import { ConfiguracionColumnasReporteCuestionarioEmpleado } from '../domain/configuracionColumnasReporteCuestionarioPisicosocial'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { HttpResponseGet } from 'shared/http/domain/HttpResponse'
import { useAuthenticationStore } from 'stores/authentication'
import { useCargandoStore } from 'stores/cargando'
import { imprimirArchivo } from 'shared/utils'
import { Ref, defineComponent, reactive, ref, watch } from 'vue'
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
import { TipoCuestionarioController } from '../infrestructure/TipoCuestionarioController'
import { TipoCuestionario } from '../domain/TipoCuestionario'
import { useNotificaciones } from 'shared/notificaciones'
import { opcionesTiposCuestionarios } from 'config/utils/medico'

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
    const {notificarAdvertencia} = useNotificaciones()
    // const anio = ref()
    const filtro = reactive({
      anio: null,
      tipo_cuestionario: null,
    })

    const isYear = ref(false)
    const tipoCuestionarioController = new TipoCuestionarioController()
    const tiposCuestionarios: Ref<TipoCuestionario[]> = ref([])

    /****************
     * Botones tabla
     ****************/
    const btnImprimirReporte: CustomActionTable = {
      titulo: 'Exportar reporte excel',
      icono: 'bi-table',
      color: 'positive',
      visible: () => authenticationStore.can('puede.ver.reporte_cuestionarios_psicosocial'),
      accion: () => imprimirReporte()
    }

    /* const btnImprimirReporteAlcoholDrogas: CustomActionTable = {
      titulo: 'Exportar .xlsx con respuestas',
      icono: 'bi-table',
      color: 'positive',
      visible: () => filtro.tipo_cuestionario === opcionesTiposCuestionarios.CUESTIONARIO_DIAGNOSTICO_CONSUMO_DE_DROGAS,// authenticationStore.can('puede.ver.reporte_cuestionarios_psicosocial'),
      accion: () => imprimirReporteAlcoholDrogas()
    } */

    const btnImprimirRespuestas: CustomActionTable = {
      titulo: 'Exportar txt (FPSICO 4.0)',
      icono: 'bi-printer',
      color: 'primary',
      visible: () => filtro.tipo_cuestionario === opcionesTiposCuestionarios.CUESTIONARIO_PSICOSOCIAL && authenticationStore.can('puede.ver.reporte_cuestionarios_psicosocial'),
      accion: () => imprimir_respuesta()
    }

    /************
     * Funciones
     ************/
    async function reporte() {
      if(!filtro.anio && !filtro.tipo_cuestionario) return notificarAdvertencia('Debe seleccionar un año y el tipo de cuestionario.')

      cargarVista(async () => {
        const { result } = await reporteCuestionarioController.listar({ anio: filtro.anio, tipo_cuestionario_id: filtro.tipo_cuestionario })
        listado.value = result
      })
    }

    async function imprimirReporte(): Promise<void> {
      const fechaActual = new Date()
      const filename = 'reporte_cuestionarios_pisicosocial_' + fechaActual.toLocaleString()
      const urlPdf = apiConfig.URL_BASE + '/' + AxiosHttpRepository.getInstance().getEndpoint(medico.reporte_cuestionario) + '?imprimir=true&anio=' + filtro.anio + '&tipo_cuestionario_id=' + filtro.tipo_cuestionario
      imprimirArchivo(urlPdf, 'GET', 'blob', 'xlsx', filename)
      // const url_pdf = apiConfig.URL_BASE + '/api/medico/reporte-cuestionario?imprimir=true'
    }

    /*async function imprimirReporteAlcoholDrogas(): Promise<void> {
      const fechaActual = new Date()
      const filename = 'reporte_cuestionario_alcohol_drogas_' + fechaActual.toLocaleString()
      const urlPdf = apiConfig.URL_BASE + '/' + AxiosHttpRepository.getInstance().getEndpoint(medico.reporte_cuestionario_alcohol_drogas) + '?imprimir=true&anio=' + filtro.anio + '&tipo_cuestionario_id=' + filtro.tipo_cuestionario
      imprimirArchivo(urlPdf, 'GET', 'blob', 'xlsx', filename)
      // const url_pdf = apiConfig.URL_BASE + '/api/medico/reporte-cuestionario?imprimir=true'
    }*/

    async function imprimir_respuesta(): Promise<void> {
      const fecha_actual = new Date()
      const filename =
        'respuesta_cuestionarios_pisicosocial_' + fecha_actual.toLocaleString()
      const url_pdf = apiConfig.URL_BASE + '/api/medico/imprimir-cuestionario?anio=' + filtro.anio + '&tipo_cuestionario_id=' + filtro.tipo_cuestionario
      imprimirArchivo(url_pdf, 'GET', 'blob', 'txt', filename) //, null,'plain')
    }

    function checkValue(val, reason, details) {
      isYear.value = reason === 'year' ? false : true
    }

    /**
     * Observer
     */
    watch(filtro, () => listado.value = [])

    /*******
     * Init
     *******/
    tipoCuestionarioController.listar().then((data) => {
      const { result } = data
      tiposCuestionarios.value = result
    })
    /* cargarVista(async () => {
      await reporte()
    }) */

    return {
      listado,
      ConfiguracionColumnasReporteCuestionarioEmpleado,
      btnImprimirReporte,
      btnImprimirRespuestas,
      // btnImprimirReporteAlcoholDrogas,
      filtro,
      reporte,
      isYear,
      checkValue,
      tiposCuestionarios,
    }
  },
})
