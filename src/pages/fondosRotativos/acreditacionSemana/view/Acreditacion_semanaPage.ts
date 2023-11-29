import { defineComponent, onMounted, reactive, ref, watchEffect } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AcreditacionSemana } from '../domain/AcreditacionSemana'
import { AcreditacionSemanaController } from '../infrestructure/AcreditacionSemanaController'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { ConfiguracionColumnasAcreditacionSemana } from '../domain/ConfiguracionColumnasAcreditacionSemana'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { accionesTabla, maskFecha } from 'config/utils'
import { useAcreditacionesStore } from 'stores/acreditaciones'
import { ComportamientoModalesAcreditacionSemanas } from '../application/ComportamientoModalesAcreditacionSemanas'
import { ValorAcreditar } from 'pages/fondosRotativos/valorAcreditar/domain/ValorAcreditar'
import { ValorAcreditarController } from 'pages/fondosRotativos/valorAcreditar/infrestructure/ValorAcreditarController'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { imprimirArchivo } from 'shared/utils'
import { AxiosResponse } from 'axios'
import { useNotificaciones } from 'shared/notificaciones'
import { useCargandoStore } from 'stores/cargando'
import { useAuthenticationStore } from 'stores/authentication'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'


export default defineComponent({
  components: { TabLayout, EssentialTable ,ModalesEntidad},
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    const acreditacionesStore = useAcreditacionesStore()
    const { notificarAdvertencia, notificarCorrecto, confirmar, promptItems } =
      useNotificaciones()
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      AcreditacionSemana,
      new AcreditacionSemanaController()
    )
    const mixinAcreditacion = new ContenedorSimpleMixin(
      ValorAcreditar,
      new ValorAcreditarController()
    )
    const { listado: roles_empleados } = mixinAcreditacion.useReferencias()

    const {
      entidad: fondo_rotativo_contabilidad,
      disabled,
      accion,
      listadosAuxiliares,
      listado,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } =
      mixin.useComportamiento()
      const store = useAuthenticationStore()
      useCargandoStore().setQuasar(useQuasar())

    /************
     * Modales
     ************/
    const modalesAcreditacionSemana = new ComportamientoModalesAcreditacionSemanas()

    /*************
     * Validaciones
     **************/
    const reglas = {
      semana: {
        required: true,
      },
    }
    const opened = ref(false)
    const v$ = useVuelidate(reglas, fondo_rotativo_contabilidad)
    setValidador(v$.value)

    cargarVista(async () => {
      listado.value = (await new AcreditacionSemanaController().listar()).result
    })
    const lista_tipo_reporte = [
      { id: 'pdf', name: 'PDF' },
      { id: 'xlsx', name: 'EXCEL' },
    ]
    /**Modales */



    const botonVerModalValorAcreditar: CustomActionTable = {
      titulo: 'Consultar',
      icono: 'bi-eye',
      color: 'primary',
      accion: ({ entidad }) => {
        acreditacionesStore.idAcreditacionSeleccionada = entidad.id
        acreditacionesStore.esta_acreditado= entidad.acreditar
        modalesAcreditacionSemana.abrirModalEntidad('ValorAcreditarPage')
      },
    }
    const botonAcreditar: CustomActionTable = {
      titulo: 'Acreditar',
      icono: 'bi-check-all',
      color: 'positive',
      visible: ({entidad}) => store.can('puede.ver.campo.acreditar_saldo_masivo')&& !entidad.acreditar,
      accion: ({ entidad }) => {
        entidad.acreditar = true;
        acreditacion_saldo(entidad)
      },
    }
    const botonCash: CustomActionTable = {
      titulo: 'Cash',
      icono: 'bi-cash-stack',
      color: 'warning',
      visible: () => store.can('puede.ver.campo.cash_acreditacion_saldo'),
      accion: ({ entidad }) => {
        cash_rol_acreditacion_saldo(entidad)
      },
    }
    async function cash_rol_acreditacion_saldo(entidad): Promise<void> {
      const filename = 'cash_rol_pago'
      const axios_repository = AxiosHttpRepository.getInstance()
      const url_pdf =
        apiConfig.URL_BASE +
        '/' +
        axios_repository.getEndpoint(endpoints.crear_cash_acreditacion_saldo) +
        entidad.id
      imprimirArchivo(url_pdf, 'GET', 'blob', 'xlsx', filename, null)
    }
    async function acreditacion_saldo(entidad): Promise<void> {
      const axios_repository = AxiosHttpRepository.getInstance()
      const url =
        apiConfig.URL_BASE +
        '/' +
        axios_repository.getEndpoint(endpoints.acreditacion_saldo_semana) +
        entidad.id
        const response: AxiosResponse = await axios_repository.get(url)
        return notificarCorrecto(
          'El rol de pago ha sido Finalizado.'
        )
    }



   const botonReporte: CustomActionTable = {
      titulo: 'Reporte General',
      icono: 'bi-printer',
      color: 'primary',
      visible: ({ entidad }) =>
       true,
      accion: ({ entidad }) => {
        const config: CustomActionPrompt = reactive({
          mensaje: 'Confirme el tipo de reporte',
          accion: (tipo) => {
            generar_reporte(entidad.id, tipo)
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
    async function generar_reporte(
      id: number,
      tipo: string
    ): Promise<void> {
      const axios = AxiosHttpRepository.getInstance()
      const filename = 'acreditacion_semana'
      const url_pdf =
        apiConfig.URL_BASE +
        '/' +
        axios.getEndpoint(endpoints.reporte_acreditacion_semanal) +
        id +
        '?tipo=' +
        tipo

      imprimirArchivo(url_pdf, 'GET', 'blob', tipo, filename, null)
    }
    return {
      mixin,
      fondo_rotativo_contabilidad,
      ConfiguracionColumnasAcreditacionSemana,
      disabled,
      accion,
      v$,
      maskFecha,
      opened,
      modalesAcreditacionSemana,
      botonReporte,
      watchEffect,
      listado,
      botonVerModalValorAcreditar,
      botonCash,
      botonAcreditar,
      accionesTabla,
    }
  },
})
