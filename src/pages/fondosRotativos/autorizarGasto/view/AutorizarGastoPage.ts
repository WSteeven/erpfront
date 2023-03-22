// Dependencias

import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { defineComponent, ref } from 'vue'
import { accionesTabla, tabAutorizarGasto, estadosGastos } from 'config/utils'

// Componentes
import ConfirmarDialog from 'gestionTrabajos/trabajoAsignado/view/ConfirmarDialog.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Gasto } from 'pages/fondosRotativos/gasto/domain/Gasto'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { configuracionColumnasAutorizarGasto } from '../domain/configuracionColumnasAutorizarGasto'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { AutorizarGastoController } from '../infrestructure/AutorizarGastoController'
import { AprobarGastoController } from '../infrestructure/AprobarGastoController'
import { AutorizarGasto } from '../domain/AutorizarGasto'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'
import { ComportamientoModalesAutorizarGasto } from '../application/ComportamientoModalesAutorizarGasto'
import { useFondoRotativoStore } from 'stores/fondo_rotativo'
export default defineComponent({
  name: 'AutorizarGastoPage',
  components: {
    EssentialTableTabs,
    ConfirmarDialog,
    ModalEntidad,
  },
  setup() {
    const controller = new AutorizarGastoController()
    const aprobarController = new AprobarGastoController()
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
    const fondoRotativoStore = useFondoRotativoStore()
    /***************
     * Botones tabla
     ***************/
    const autorizarGastoController = new AutorizarGastoController()
    async function filtrarAutorizacionesGasto(tabSeleccionado) {
      const cargando = new StatusEssentialLoading()

      cargando.activar()

      const { result } = await autorizarGastoController.listar({
        estado: tabSeleccionado,
      })
      listado.value = result
      tabActual.value = tabSeleccionado

      cargando.desactivar()
    }
    filtrarAutorizacionesGasto(estadosGastos.PENDIENTE)

    /**Modales */
    const modales = new ComportamientoModalesAutorizarGasto()
    const botonVerModalGasto: CustomActionTable = {
      titulo: 'Consultar',
      icono: 'bi-eye',
      color: 'indigo',
      accion: ({ entidad }) => {
        fondoRotativoStore.existeFactura = entidad.factura ==null? false:true
        fondoRotativoStore.id_gasto = entidad.id
        modales.abrirModalEntidad('GastoPage')
      }
    }

    return {
      configuracionColumnasAutorizarGasto,
      listado,
      tabAutorizarGasto,
      botonVerModalGasto,
      accionesTabla,
      filtrarAutorizacionesGasto,
      authenticationStore,
      modales,
    }
  },
})
