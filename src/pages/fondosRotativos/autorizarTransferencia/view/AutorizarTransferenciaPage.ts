// Dependencias

import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { defineComponent, ref } from 'vue'
import { accionesTabla, tabAutorizarTransferenciaSaldo, estadosGastos, estadosTransferencias } from 'config/utils'

// Componentes
import ConfirmarDialog from 'gestionTrabajos/trabajoAsignado/view/ConfirmarDialog.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Gasto } from 'pages/fondosRotativos/gasto/domain/Gasto'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { configuracionColumnasAutorizarTransferencia } from '../domain/configuracionColumnasAutorizarTransferencia'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { AprobarTransferenciaController } from '../infrestructure/AprobarTransferenciaController'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'
import { ComportamientoModalesTransferencia } from '../application/ComportamientoModalesTransferencia'
import { AutorizarTransferenciaController } from '../infrestructure/AutorizarTransferenciaController'
import { useTransferenciaSaldoStore } from 'stores/transferenciaSaldo'
export default defineComponent({
  name: 'AutorizarGastoPage',
  components: {
    EssentialTableTabs,
    ConfirmarDialog,
    ModalEntidad,
  },
  setup() {
    const controller = new AutorizarTransferenciaController()
    const aprobarController = new AprobarTransferenciaController()
    const {
      confirmar,
      prompt,
      notificarCorrecto,
      notificarAdvertencia,
      notificarError,
    } = useNotificaciones()
    const tabActual = ref()
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(Gasto, controller)
    const { listado } = mixin.useReferencias()
    const {listar } =
    mixin.useComportamiento()
    /***********
     * Stores
     ***********/
    const authenticationStore = useAuthenticationStore()
    const transferenciaSaldoStore = useTransferenciaSaldoStore()
    /***************
     * Botones tabla
     ***************/
    const autorizarTransferenciaController = new AutorizarTransferenciaController()
    async function filtrarAutorizacionesTransferencia(tabSeleccionado) {
      const cargando = new StatusEssentialLoading()

      cargando.activar()

      const { result } = await autorizarTransferenciaController.listar({
        estado: tabSeleccionado,
      })
      listado.value = result
      tabActual.value = tabSeleccionado

      cargando.desactivar()
    }
    filtrarAutorizacionesTransferencia(estadosTransferencias.PENDIENTE)

    /**Modales */
    const modales = new ComportamientoModalesTransferencia()
    const botonVerModalTransferencia: CustomActionTable = {
      titulo: 'Consultar',
      icono: 'bi-eye',
      color: 'indigo',
      accion: ({ entidad }) => {
        transferenciaSaldoStore.id_transferencia = entidad.id
        modales.abrirModalEntidad('VisualizarTransferenciaPage')
      }
    }
    async function guardado() {
      filtrarAutorizacionesTransferencia(estadosTransferencias.PENDIENTE)
    }

    return {
      configuracionColumnasAutorizarTransferencia,
      listado,
      tabAutorizarTransferenciaSaldo,
      botonVerModalTransferencia,
      accionesTabla,
      filtrarAutorizacionesTransferencia,
      guardado,
      authenticationStore,
      modales,
    }
  },
})
