import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { useAuthenticationStore } from 'stores/authentication'
import { useDevolucionStore } from 'stores/devolucion'
import { useRouter } from 'vue-router'
import { CambiarEstadoDevolucion } from './CambiarEstadoDevolucion'
import { Ref } from 'vue'

export function useBotonesTransferenciaProductoEmpleado(listado, tabSeleccionado: Ref<string>) {
  const store = useAuthenticationStore()
  const devolucionStore = useDevolucionStore()
  const { notificarError, confirmar, notificarCorrecto, prompt } = useNotificaciones()
  const router = useRouter()

  const botonAnular: CustomActionTable = {
    titulo: 'Anular',
    color: 'negative',
    icono: 'bi-x',
    accion: ({ entidad, posicion }) => {
      confirmar('¿Está seguro de anular la devolución?', () => {
        const data: CustomActionPrompt = {
          titulo: 'Motivo',
          mensaje: 'Ingresa el motivo de la anulación',
          accion: async (data) => {
            try {
              // const { result } = await new CambiarEstadoDevolucion().anular(entidad.id, data)
              await new CambiarEstadoDevolucion().anular(entidad.id, data)
              notificarCorrecto('Devolución anulada exitosamente!')
              if (posicion >= 0) {
                listado.value.splice(posicion, 1,)
                listado.value = [...listado.value]
              }
            } catch (e: any) {
              notificarError('No se pudo anular, debes ingresar un motivo para la anulación')
            }
          }
        }

        prompt(data)
      })
    },
    visible: ({ entidad }) => entidad.estado_bodega == 'PENDIENTE' && (entidad.solicitante_id == store.user.id || entidad.per_autoriza_id == store.user.id || store.esAdministrador)
  }

  const botonDevolverASinCliente: CustomActionTable = {
    titulo: 'Devolver a sin cliente',
    color: 'negative',
    icono: 'bi-arrow-return-left',
    accion: ({ entidad, posicion }) => {
      confirmar('¿Está seguro de devolver a sin cliente? Todo el listado de productos será movido a SIN CLIENTE, esta operación no es reversible.', () => {
        const data: CustomActionPrompt = {
          titulo: 'Motivo',
          mensaje: 'Ingresa el motivo de la devolución a SIN CLIENTE',
          accion: async (data) => {
            try {
              const { response } = await new CambiarEstadoDevolucion().devolverASinCliente(entidad.id, data)
              notificarCorrecto(response.data.mensaje)
              if (posicion >= 0) {
                listado.value.splice(posicion, 1,)
                listado.value = [...listado.value]
              }
            } catch (e: any) {
              notificarError('No se pudo anular, debes ingresar un motivo para la anulación')
            }
          }
        }

        prompt(data)
      })
    },
    visible: ({ entidad }) => entidad.autorizacion == 'APROBADO' && (store.esAdministrador || store.esCoordinadorBodega)
  }

  const botonImprimir: CustomActionTable = {
    titulo: 'Imprimir',
    color: 'secondary',
    icono: 'bi-printer',
    accion: async ({ entidad }) => {
      devolucionStore.idDevolucion = entidad.id
      await devolucionStore.imprimirPdf()
    },
    visible: () => tabSeleccionado.value == 'CREADA' ? true : false
  }

  const botonDespachar: CustomActionTable = {
    titulo: 'Gestionar',
    color: 'primary',
    icono: 'bi-pencil-square',
    accion: ({ entidad }) => {
      devolucionStore.devolucion = entidad
      console.log('Devolución a ingresar a bodega es: ', devolucionStore.devolucion)
      router.push('transacciones-ingresos')
    },
    visible: () => (tabSeleccionado.value == 'APROBADO' || tabSeleccionado.value == 'PARCIAL') && store.esBodeguero ? true : false
  }

  return {
    botonAnular,
    botonImprimir,
    botonDespachar,
    botonDevolverASinCliente,
  }
}
