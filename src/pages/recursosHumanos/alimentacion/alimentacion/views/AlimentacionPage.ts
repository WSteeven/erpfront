// Dependencias
import { configuracionColumnasAlimentacion } from '../domain/configuracionColumnasAlimentacion'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, reactive, ref } from 'vue'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { acciones, accionesTabla, maskFecha } from 'config/utils'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AlimentacionController } from '../infraestructure/AlimentacionController'
import { Alimentacion } from '../domain/Alimentacion'
import {
  tabOptionsEstadosAlimentacion,
  estadosAlimentacion,
} from 'config/recursosHumanos.utils'
import { useAuthenticationStore } from 'stores/authentication'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { imprimirArchivo } from 'shared/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useNotificaciones } from 'shared/notificaciones'
import { useCargandoStore } from 'stores/cargando'
import { useQuasar } from 'quasar'
import { useBotonesTablaAlimentacion } from '../aplication/BotonesTablaAlimentacion'

export default defineComponent({
  components: { TabLayoutFilterTabs2 },
  setup() {
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      Alimentacion,
      new AlimentacionController()
    )
    const { btnFinalizar } = useBotonesTablaAlimentacion(mixin)

    const {
      entidad: alimentacion,
      disabled,
      accion,
      listado,
    } = mixin.useReferencias()
    const { setValidador, listar } = mixin.useComportamiento()
    useCargandoStore().setQuasar(useQuasar())
    const {  promptItems } =
      useNotificaciones()
    const is_month = ref(false)

    //Reglas de validacion
    const reglas = {
      mes: { required },
      nombre: { required },
    }
    const lista_tipo_reporte = [
      { id: 'pdf', name: 'PDF' },
      { id: 'xlsx', name: 'EXCEL' },
    ]
    const v$ = useVuelidate(reglas, alimentacion)
    setValidador(v$.value)
    const authenticationStore = useAuthenticationStore()

    /**Verifica si es un mes */
    function checkValue (val, reason, details) {
      console.log(val, reason, details)
      is_month.value = reason === 'month' ? false : true
            obtenerNombreMes()
    }
    function obtenerNombreMes() {
      const meses = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ]
      const [mes, anio] = alimentacion.mes!.split('-')
      alimentacion.nombre = `Asignacion de Alimentación de ${
        alimentacion.es_quincena ? 'QUINCENA DEL MES DE ' : ''
      }  ${meses[parseInt(mes, 10) - 1]} de ${anio}`
    }
    let tabActualGasto = '0'
    function filtrarAlimentacion(tabSeleccionado: string) {
      listar({ finalizado: tabSeleccionado }, false)
      tabActualGasto = tabSeleccionado
    }
    const btnImprimirReporteAlimentacion: CustomActionTable = {
      titulo: 'Reporte General',
      icono: 'bi-printer',
      color: 'positive',
      visible: ({ entidad }) =>
        authenticationStore.can('puede.acceder.alimentaciones'),
      accion: ({ entidad }) => {
        const config: CustomActionPrompt = reactive({
          mensaje: 'Confirme el tipo de reporte',
          accion: (tipo) => {
            generar_reporte_general_mes(entidad.id, tipo)
          },
          requerido: false,
          defecto: 'EXCEL',
          tipo: 'radio',
          items: lista_tipo_reporte.map((tipo) => {
            return {
              label: tipo.name,
              value: tipo.id,
            }
          }),
        })
        promptItems(config)
      },
    }
    const btnCashAlimentacion: CustomActionTable = {
      titulo: 'Cash de Alimentacion',
      icono: 'bi-cash-stack',
      color: 'primary',
      visible: () =>
        authenticationStore.can('puede.ver.campo.cash_alimentacion'),
      accion: ({ entidad }) => {
        cash_alimentacion(entidad)
      },
    }
    async function cash_alimentacion(entidad): Promise<void> {
      const filename = 'cash_alimentacion'
      const axios_repository = AxiosHttpRepository.getInstance()
      const url_pdf =
        apiConfig.URL_BASE +
        '/' +
        axios_repository.getEndpoint(endpoints.crear_cash_alimentacion) +
        entidad.id
      imprimirArchivo(url_pdf, 'GET', 'blob', 'xlsx', filename, null)
    }
    async function generar_reporte_general_mes(
      id: number,
      tipo: string
    ): Promise<void> {
      const axios = AxiosHttpRepository.getInstance()
      const filename = 'rol_pago'
      const url_pdf =
        apiConfig.URL_BASE +
        '/' +
        axios.getEndpoint(endpoints.imprimir_reporte_general_alimentacion) +
        id +
        '?tipo=' +
        tipo

      imprimirArchivo(url_pdf, 'GET', 'blob', tipo, filename, null)
    }

    return {
      listado,
      configuracionColumnas: configuracionColumnasAlimentacion,
      tabOptionsEstadosAlimentacion,
      btnCashAlimentacion,
      btnImprimirReporteAlimentacion,
      btnFinalizar,
      estadosAlimentacion,
      filtrarAlimentacion,
      accionesTabla,
      accion,
      alimentacion,
      maskFecha,
      is_month,
      checkValue,
      mixin,
      v$,
    }
  },
})
