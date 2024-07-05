// Dependencias
import { ConfiguracionColumnasReporteCuestionarioEmpleado } from '../../cuestionarioPsicosocial/domain/configuracionColumnasReporteCuestionarioPisicosocial'
import { opcionesPrivacidadCuestionarios, opcionesTiposCuestionarios } from 'config/utils/medico'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Ref, defineComponent, reactive, ref, watch } from 'vue'
import { useAuthenticationStore } from 'stores/authentication'
import { required, requiredIf } from 'shared/i18n-validators'
import { useCargandoStore } from 'stores/cargando'
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
import { ConfiguracionColumnasLinksCreados } from '../domain/confiuracionColumnasLinksCreados'
import { LinkCuestionarioPublicoController } from '../infraestructure/LinkCuestionarioPublicoController'
import { LinkCuestionarioPublico } from '../domain/LinkCuestionarioPublico'
import { accionesTabla, maskFecha } from 'config/utils'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useNotificaciones } from 'shared/notificaciones'
import { copiarAlPortapapeles } from 'shared/utils'
import { useNotificacionStore } from 'stores/notificacion'
import useVuelidate from '@vuelidate/core'

export default defineComponent({
  components: { EssentialTable, ModalEntidad },
  setup() {
    /********
    * Store
    ********/
    const authenticationStore = useAuthenticationStore()
    useCargandoStore().setQuasar(useQuasar())
    useNotificacionStore().setQuasar(useQuasar())

    /********
     * Mixin
     ********/
    const mixinCuestionarioPublico = new ContenedorSimpleMixin(LinkCuestionarioPublico, new LinkCuestionarioPublicoController())
    const { entidad: linkCreado, listado: linksCreados } = mixinCuestionarioPublico.useReferencias()
    const { listar: listarLinksCreados, guardar: guardarLinkCreado, editarParcial: editarParcialLinkCreado } = mixinCuestionarioPublico.useComportamiento()

    /************
     * Variables
     ************/
    const { prompt } = useNotificaciones()
    const opcionesTabLinksFiltrar = {
      links: 'Links creados',
      filtrar: 'Filtrar cuestionarios resueltos',
    }

    const tabPrivacidadCuestionario = ref(opcionesPrivacidadCuestionarios.INTERNO)
    const tabLinksFiltrar = ref(opcionesTabLinksFiltrar.filtrar)

    const listado: any = ref([])
    const filtro = reactive({
      fecha_inicio: null,
      fecha_fin: null,
      tipo_cuestionario_id: null,
      link: null,
    })

    const isYear = ref(false)
    const tiposCuestionarios: Ref<TipoCuestionario[]> = ref([])

    // Reglas de validacion
    const reglas = {
      fecha_inicio: { required },
      fecha_fin: { required },
      tipo_cuestionario_id: { required },
      link: { requiredIf: requiredIf(() => tabPrivacidadCuestionario.value === opcionesPrivacidadCuestionarios.PUBLICO) },
      // link: { required },
    }

    const v$ = useVuelidate(reglas, filtro)

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
      visible: () => filtro.tipo_cuestionario_id === opcionesTiposCuestionarios.CUESTIONARIO_PSICOSOCIAL && authenticationStore.can('puede.ver.reporte_cuestionarios_psicosocial'),
      accion: () => descargarFpsicoTxt()
    }

    const btnCrearLinkCuestionario: CustomActionTable = {
      titulo: 'Crear link de cuestionario',
      icono: 'bi-plus',
      color: 'primary',
      visible: () => authenticationStore.can('puede.ver.reporte_cuestionarios_psicosocial'),
      accion: () => {
        const data: CustomActionPrompt = {
          titulo: 'Crear link',
          mensaje: 'Ingrese un identificador para el link',
          tipo: 'text',
          accion: (data) => {
            linkCreado.link = data
            guardarLinkCreado(linkCreado)
          }
        }
        prompt(data)
      }
    }

    const btnCompartirLink: CustomActionTable<LinkCuestionarioPublico> = {
      titulo: 'Copiar link',
      icono: 'bi-link-45deg',
      color: 'primary',
      visible: () => authenticationStore.can('puede.ver.reporte_cuestionarios_psicosocial'),
      accion: ({ entidad }) => copiarAlPortapapeles(window.location.origin + '/cuestionarios-publicos/' + entidad.link)
    }

    const btnAbrirLink: CustomActionTable<LinkCuestionarioPublico> = {
      titulo: 'Abrir link',
      icono: 'bi-browser-chrome',
      color: 'secondary',
      visible: () => authenticationStore.can('puede.ver.reporte_cuestionarios_psicosocial'),
      accion: ({ entidad }) => window.open(window.location.origin + '/cuestionarios-publicos/' + entidad.link, '_blank')
    }

    const btnDeshabilitarLink: CustomActionTable<LinkCuestionarioPublico> = {
      titulo: ({ entidad }) => entidad.activo ? 'Deshabilitar' : 'Habilitar',
      icono: ({ entidad }) => entidad.activo ? 'bi-toggle2-on' : 'bi-toggle2-off',
      color: ({ entidad }) => entidad.activo ? 'negative' : 'positive',
      visible: () => authenticationStore.can('puede.ver.reporte_cuestionarios_psicosocial'),
      accion: ({ entidad }) => editarParcialLinkCreado(entidad.id, { activo: !entidad.activo })
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
      console.log(filtro)
      if (await v$.value.$validate()) {
        if (tabPrivacidadCuestionario.value === opcionesPrivacidadCuestionarios.INTERNO) {
          await consultarCuestionariosInternos()
          listado.value = listadoCuestionariosInternos.value
        } else {
          await consultarCuestionariosPublicos()
          listado.value = listadoCuestionariosPublicos.value
        }
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
    watch(tabPrivacidadCuestionario, () => {
      listado.value = []
      filtro.link = null
    })

    /*******
     * Init
     *******/
    new TipoCuestionarioController().listar().then((data) => {
      const { result } = data
      tiposCuestionarios.value = result
    })

    listarLinksCreados()
    /* new LinkCuestionarioPublicoController().listar().then((data) => {
      const { result } = data
      linksCreados.value = result
    }) */

    return {
      v$,
      listado,
      ConfiguracionColumnasReporteCuestionarioEmpleado,
      ConfiguracionColumnasLinksCreados,
      btnImprimirReporte,
      btnImprimirRespuestas,
      btnCrearLinkCuestionario,
      btnCompartirLink,
      btnDeshabilitarLink,
      btnAbrirLink,
      filtro,
      consultar,
      isYear,
      checkValue,
      tiposCuestionarios,
      tabPrivacidadCuestionario,
      opcionesPrivacidadCuestionarios,
      opcionesTabLinksFiltrar,
      tabLinksFiltrar,
      linksCreados,
      accionesTabla,
      maskFecha,
    }
  },
})
