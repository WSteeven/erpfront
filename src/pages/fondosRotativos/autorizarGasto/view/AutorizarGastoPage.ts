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
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
export default defineComponent({
  name: 'AutorizarGastoPage',
  components: {
    EssentialTableTabs,
    ConfirmarDialog,
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
        const data: CustomActionPrompt = {
          titulo: 'Aprobar gasto',
          mensaje: 'Ingrese motivo de aprobación',
          accion: async (data) => {
            try {
              entidad.detalle_estado = data
              await aprobarController.aprobarGasto(entidad)
              notificarCorrecto('Se aprobado Gasto Exitosamente')
              filtrarAutorizacionesGasto(tabActual.value)
            } catch (e: any) {
              notificarError(
                'No se pudo aprobar, debes ingresar un motivo para la anulación'
              )
            }
          },
        }
        prompt(data)
      },
    }

    const botonRechazar: CustomActionTable = {
      titulo: 'Rechazar',
      icono: 'bi-x-circle',
      accion: async ({ entidad }) => {
        confirmar('¿Está seguro de rechazar el gasto?', () => {
          const data: CustomActionPrompt = {
            titulo: 'Rechazar gasto',
            mensaje: 'Ingrese motivo de aprobación',
            accion: async (data) => {
              try {
                entidad.detalle_estado = data
                await aprobarController.rechazarGasto(entidad)
                notificarAdvertencia('Se rechazado Gasto Exitosamente')
                filtrarAutorizacionesGasto(tabActual.value)
              } catch (e: any) {
                notificarError(
                  'No se pudo rechazar, debes ingresar un motivo para la anulación'
                )
              }
            },
          }
          prompt(data)
        })
      },
    }
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
