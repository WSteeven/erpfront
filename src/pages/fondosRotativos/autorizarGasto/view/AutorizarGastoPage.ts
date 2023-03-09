// Dependencias

import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { defineComponent, ref } from 'vue'
import {  accionesTabla, tabAutorizarGasto,estadosGastos } from 'config/utils'

// Componentes
import ConfirmarDialog from 'gestionTrabajos/trabajoAsignado/view/ConfirmarDialog.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Gasto } from 'pages/fondosRotativos/gasto/domain/Gasto'
import { GastoController } from 'pages/fondosRotativos/gasto/infrestructure/GastoController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { configuracionColumnasAutorizarGasto } from '../domain/configuracionColumnasAutorizarGasto'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { AutorizarGastoController } from '../infrestructure/AutorizarGastoController'
export default defineComponent({
  name: 'AutorizarGastoPage',
  components: {
    EssentialTableTabs,
    ConfirmarDialog,
  },
  setup() {
    const controller = new GastoController()
    const { confirmar, prompt, notificarCorrecto, notificarAdvertencia } =
      useNotificaciones()
    const tabActual = ref()
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(Gasto, controller)
    const { listado } = mixin.useReferencias()
    /***********
     * Stores
     ***********/
    const authenticationStore = useAuthenticationStore()
    /***************
     * Botones tabla
     ***************/
    const botonAprobar: CustomActionTable = {
      titulo: 'Aprobar',
      icono: ' bi-check-circle',
      accion: async ({ entidad }) => {
        //await controller.aprobarGasto(entidad)
        // await listado.value.refrescar()
      },
    }

    const botonRechazar: CustomActionTable = {
      titulo: 'Rechazar',
      icono: 'bi-x-circle',
      accion: async ({ entidad }) => {
        //await controller.aprobarGasto(entidad)
        // await listado.value.refrescar()
      },
    }
    const autorizarGastoController = new AutorizarGastoController()
    async function filtrarAutorizacionesGasto(tabSeleccionado) {
      const cargando = new StatusEssentialLoading()

      cargando.activar()

      const { result } = await autorizarGastoController.listar({ estado: tabSeleccionado })
      listado.value = result
      tabActual.value = tabSeleccionado

      cargando.desactivar()
    }
    filtrarAutorizacionesGasto(estadosGastos.PENDIENTE);
    return {
      configuracionColumnasAutorizarGasto,
      listado,
      tabAutorizarGasto,
      accionesTabla,
      botonAprobar,
      botonRechazar,
      filtrarAutorizacionesGasto,
      authenticationStore,
    }
  },
})
