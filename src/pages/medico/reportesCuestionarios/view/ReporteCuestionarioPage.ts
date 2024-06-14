// Dependencias
import { ConfiguracionColumnasReporteCuestionarioEmpleado } from '../../cuestionarioPsicosocial/domain/configuracionColumnasReporteCuestionarioPisicosocial'
import { opcionesPrivacidadCuestionarios, opcionesTiposCuestionarios } from 'config/utils/medico'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Ref, defineComponent, reactive, ref, watch } from 'vue'
import { useAuthenticationStore } from 'stores/authentication'
import { useCargandoStore } from 'stores/cargando'
import { imprimirArchivo } from 'shared/utils'
import { apiConfig } from 'config/api'
import { useQuasar } from 'quasar'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { TipoCuestionarioController } from '../../cuestionarioPsicosocial/infrestructure/TipoCuestionarioController'
import { RespuestaCuestionarioEmpleado } from '../../cuestionarioPsicosocial/domain/RespuestaCuestionarioEmpleado'
import { ReporteCuestionarioPublicoController } from '../infraestructure/ReporteCuestionarioPublicoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useReportesCuestionariosPublicos } from '../application/UseReportesCuestionariosPublicos'
import { ReporteCuestionarioController } from '../infraestructure/ReporteCuestionarioController'
import { TipoCuestionario } from '../../cuestionarioPsicosocial/domain/TipoCuestionario'
import { ReporteCuestionarioEmpleado } from '../domain/ReporteCuestionarioEmpleado'

export default defineComponent({
  components: { EssentialTable, ModalEntidad },
  setup() {
    /********
    * Store
    ********/
    const authenticationStore = useAuthenticationStore()
    useCargandoStore().setQuasar(useQuasar())

    /************
     * Variables
     ************/
    const tabPrivacidadCuestionario = ref(opcionesPrivacidadCuestionarios.INTERNO)
    const listado: any = ref([])
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
      accion: () => descargarReporteXlsx()
    }

    const btnImprimirRespuestas: CustomActionTable = {
      titulo: 'Exportar txt (FPSICO 4.0)',
      icono: 'bi-printer',
      color: 'primary',
      visible: () => filtro.tipo_cuestionario === opcionesTiposCuestionarios.CUESTIONARIO_PSICOSOCIAL && authenticationStore.can('puede.ver.reporte_cuestionarios_psicosocial'),
      accion: () => descargarFpsicoTxt()
    }

    /************
     * Funciones
     ************/
    const {
      consultar: consultarCuestionariosInternos,
      listado: listadoCuestionariosInternos,
      descagarReporte: descagarReporteCuestionariosInternos,
      descargarFpsico: descargarFpsicoCuestionariosInternos,
    } = useReportesCuestionariosPublicos(new ContenedorSimpleMixin(RespuestaCuestionarioEmpleado, new ReporteCuestionarioController()), filtro)

    const {
      consultar: consultarCuestionariosPublicos,
      listado: listadoCuestionariosPublicos,
      descagarReporte: descagarReporteCuestionariosPublicos,
      descargarFpsico: descargarFpsicoCuestionariosPublicos,
    } = useReportesCuestionariosPublicos(new ContenedorSimpleMixin(ReporteCuestionarioEmpleado, new ReporteCuestionarioPublicoController()), filtro)

    async function consultar() {
      if (tabPrivacidadCuestionario.value === opcionesPrivacidadCuestionarios.INTERNO) {
        await consultarCuestionariosInternos()
        listado.value = listadoCuestionariosInternos.value
      } else {
        await consultarCuestionariosPublicos()
        listado.value = listadoCuestionariosPublicos.value
      }
    }

    async function descargarReporteXlsx(): Promise<void> {
      if (tabPrivacidadCuestionario.value === opcionesPrivacidadCuestionarios.INTERNO) {
        await descagarReporteCuestionariosInternos()
      } else {
        await descagarReporteCuestionariosPublicos()
      }
    }

    async function descargarFpsicoTxt(): Promise<void> {
      if (tabPrivacidadCuestionario.value === opcionesPrivacidadCuestionarios.INTERNO) {
        await descargarFpsicoCuestionariosInternos()
      } else {
        await descargarFpsicoCuestionariosPublicos()
      }
    }

    function checkValue(val, reason, details) {
      isYear.value = reason === 'year' ? false : true
    }

    /************
     * Observer
     ************/
    watch(filtro, () => listado.value = [])

    /*******
     * Init
     *******/
    tipoCuestionarioController.listar().then((data) => {
      const { result } = data
      tiposCuestionarios.value = result
    })

    return {
      listado,
      ConfiguracionColumnasReporteCuestionarioEmpleado,
      btnImprimirReporte,
      btnImprimirRespuestas,
      filtro,
      consultar,
      isYear,
      checkValue,
      tiposCuestionarios,
      tabPrivacidadCuestionario,
      opcionesPrivacidadCuestionarios,
    }
  },
})
