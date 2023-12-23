import { ClienteMaterialEmpleadoController } from '../infraestructure/ClienteMaterialEmpleadoController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { MaterialEmpleadoController } from '../infraestructure/MaterialEmpleadoController'
import { useListadoMaterialesDevolucionStore } from 'stores/listadoMaterialesDevolucion'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'

export function useMaterialesEmpleado(listadosAuxiliares) {
  // Stores
  const listadoMaterialesDevolucionStore = useListadoMaterialesDevolucionStore()
  const authenticationStore = useAuthenticationStore()

  // Controllers
  const clienteMaterialEmpleadoController = new ClienteMaterialEmpleadoController()
  const materialEmpleadoController = new MaterialEmpleadoController()

  // Variables
  const { notificarAdvertencia } = useNotificaciones()
  const cargando = new StatusEssentialLoading()

  async function consultarMaterialEmpleado(cliente: number) {
    try {
      cargando.activar()
      const { result } = await materialEmpleadoController.listar({ empleado_id: authenticationStore.user.id, cliente_id: cliente })
      listadosAuxiliares.materialesTarea = result
      listadoMaterialesDevolucionStore.listadoMateriales = result
      listadoMaterialesDevolucionStore.tareaId = null
      listadoMaterialesDevolucionStore.cliente_id = cliente
      if (!result.length) {
        notificarAdvertencia('No tienes material asignado.')
      }
    } catch (e) {
      console.log(e)
    } finally {
      cargando.desactivar()
    }
  }

  async function consultarClientesMaterialesEmpleado() {
    try {
      cargando.activar()
      const { result } = await clienteMaterialEmpleadoController.listar({ empleado_id: authenticationStore.user.id })
      listadosAuxiliares.clientesMaterialesEmpleado = result
    } catch (e) {
      console.log(e)
    } finally {
      cargando.desactivar()
    }
  }

  return {
    consultarMaterialEmpleado,
    consultarClientesMaterialesEmpleado,
  }
}
