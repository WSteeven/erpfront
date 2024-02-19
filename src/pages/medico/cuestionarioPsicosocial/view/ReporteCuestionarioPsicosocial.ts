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

    cargarVista(async () => {
      await reporte()
    })

    /************
     * Variables
     ************/
    const listado = ref([])

    /****************
     * Botones tabla
     ****************/
    const btnImprimirReporte: CustomActionTable = {
      titulo: 'Imprimir',
      icono: 'bi-printer',
      color: 'primary',
      visible: () =>
        authenticationStore.can('puede.ver.reporte_cuestionarios_pisicosocial'),
      accion: () => {
        imprimir_reporte()
      },
    }

    const btnImprimirRespuestas: CustomActionTable = {
      titulo: 'Imprimir Respuestas',
      icono: 'bi-printer',
      color: 'primary',
      visible: () =>
        authenticationStore.can('puede.ver.reporte_cuestionarios_pisicosocial'),
      accion: () => {
        imprimir_respuesta()
      },
    }

    /************
     * Funciones
     ************/
    async function reporte() {
      const axiosHttpRepository = AxiosHttpRepository.getInstance()
      const url_acreditacion = apiConfig.URL_BASE + '/api/medico/reporte-cuestionario'
      await axios({
        url: url_acreditacion,
        method: 'GET',
        responseType: 'json',
        headers: {
          Authorization: axiosHttpRepository.getOptions().headers.Authorization,
        },
      }).then((response: HttpResponseGet) => {
        const { data } = response
        if (data) {
          listado.value = data.results
        }
      })
    }

    async function imprimir_reporte(): Promise<void> {
      const fecha_actual = new Date()
      const filename =
        'reporte_cuestionarios_pisicosocial_' + fecha_actual.toLocaleString()
      const url_pdf =
        apiConfig.URL_BASE + '/api/medico/reporte-cuestionario?imprimir=true'
      imprimirArchivo(url_pdf, 'GET', 'blob', 'xlsx', filename, null)
    }

    async function imprimir_respuesta(): Promise<void> {
      const fecha_actual = new Date()
      const filename =
        'respuesta_cuestionarios_pisicosocial_' + fecha_actual.toLocaleString()
      const url_pdf = apiConfig.URL_BASE + '/api/medico/imprimir-cuestionario'
      imprimirArchivo(url_pdf, 'GET', 'blob', 'txt', filename, null)
    }

    return {
      listado,
      ConfiguracionColumnasReporteCuestionarioEmpleado,
      btnImprimirReporte,
      btnImprimirRespuestas
    }
  },
})
