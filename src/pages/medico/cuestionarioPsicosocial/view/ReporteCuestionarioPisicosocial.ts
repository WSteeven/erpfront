import { useQuasar } from 'quasar'

import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'
import { computed, defineComponent, ref } from 'vue'
import { ConfiguracionColumnasReporteCuestionarioEmpleado } from '../domain/configuracionColumnasReporteCuestionarioPisicosocial'
import { HttpResponseGet } from 'shared/http/domain/HttpResponse'
import axios from 'axios'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { RespuestaCuestionarioEmpleado } from '../domain/RespuestaCuestionarioEmpleado'
import { RespuestaCuestionarioEmpleadoController } from '../infrestructure/RespuestaCuestionarioEmpleadoController'
import { useAuthenticationStore } from 'stores/authentication'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { imprimirArchivo } from 'shared/utils'
import { useCargandoStore } from 'stores/cargando'

export default defineComponent({
  components: { EssentialTable, ModalEntidad },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      RespuestaCuestionarioEmpleado,
      new RespuestaCuestionarioEmpleadoController()
    )
    const {  cargarVista } =      mixin.useComportamiento()
    const listado = ref([])
    const authenticationStore = useAuthenticationStore()
    useCargandoStore().setQuasar(useQuasar())

    cargarVista(async () => {
      await reporte()
    })
    async function reporte() {
      const axiosHttpRepository = AxiosHttpRepository.getInstance()
      const url_acreditacion =        apiConfig.URL_BASE + '/api/medico/reporte-cuestionario'
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
    const btnImprimirReporte: CustomActionTable = {
      titulo: 'Imprimir',
      icono: 'bi-printer',
      color: 'primary',
      visible: () => authenticationStore.can('puede.ver.reporte_cuestionarios_pisicosocial'),
      accion: () => {
        imprimir_reporte()
      },
    }

    async function imprimir_reporte(): Promise<void> {
      console.log('generar_reporte_general')
      const axios = AxiosHttpRepository.getInstance()
      const filename = 'empleados'
      const url_pdf =
        apiConfig.URL_BASE +
       '/api/medico/reporte-cuestionario?imprimir=true'
      imprimirArchivo(url_pdf, 'GET', 'blob', 'xlsx', filename, null)
    }
    return { listado, ConfiguracionColumnasReporteCuestionarioEmpleado,btnImprimirReporte }
  },
})
