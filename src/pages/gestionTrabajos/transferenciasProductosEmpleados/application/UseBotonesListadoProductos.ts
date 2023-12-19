import { TransferenciaProductoEmpleado } from '../domain/TransferenciaProductoEmpleado'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { acciones } from 'config/utils'
import { Ref } from 'vue'

export function useBotonesListadoProductos(transferencia: TransferenciaProductoEmpleado, accion: Ref<any>) {
  const { confirmar, prompt } = useNotificaciones()

  const botonEliminar: CustomActionTable = {
    titulo: 'Quitar',
    color: 'negative',
    icono: 'bi-x',
    accion: ({ posicion }) => {
      eliminar({ posicion })
    },
    visible: () => {
      return accion.value == acciones.consultar ? false : true
    }
  }
  const botonEditarCantidad: CustomActionTable = {
    titulo: 'Cantidad',
    icono: 'bi-pencil',
    accion: ({ posicion }) => {
      const data: CustomActionPrompt = {
        titulo: 'Modifica',
        mensaje: 'Ingresa la cantidad',
        tipo: 'number',
        defecto: transferencia.listadoProductos[posicion].cantidad,
        accion: (data) => transferencia.listadoProductos[posicion].cantidad = data,
      }
      prompt(data)
    },
    visible: () => {
      return accion.value == acciones.consultar ? false : true
    }
  }

  function eliminar({ posicion }) {
    confirmar('¿Está seguro de continuar?',
      () => transferencia.listadoProductos.splice(posicion, 1))
  }

  return {
    botonEliminar,
    botonEditarCantidad,
  }
}
