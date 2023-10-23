import { defineComponent, reactive, ref, watchEffect } from 'vue'

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


export default defineComponent({
  components: { TabLayout, EssentialTable ,ModalesEntidad},
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    const acreditacionesStore = useAcreditacionesStore()
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
      const { confirmar, prompt, notificarAdvertencia, notificarCorrecto } = useNotificaciones()
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

    /**Modales */

    const botonVerModalGasto: CustomActionTable = {
      titulo: 'Consultar',
      icono: 'bi-eye',
      color: 'primary',
      accion: ({ entidad }) => {
        acreditacionesStore.idAcreditacionSeleccionada = entidad.id
        modalesAcreditacionSemana.abrirModalEntidad('ValorAcreditarPage')
      },
    }
    const botonAcreditar: CustomActionTable = {
      titulo: 'Acreditar',
      icono: 'bi-check-all',
      color: 'positive',
      accion: ({ entidad }) => {
        acreditacion_saldo(entidad)
      },
    }
    const botonCash: CustomActionTable = {
      titulo: 'Cash',
      icono: 'bi-cash-stack',
      color: 'primary',
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
      watchEffect,
      listado,
      botonVerModalGasto,
      botonCash,
      botonAcreditar,
      accionesTabla,
    }
  },
})
