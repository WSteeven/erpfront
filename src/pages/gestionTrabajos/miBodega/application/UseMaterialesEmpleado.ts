import { ClienteMaterialEmpleadoController } from '../infraestructure/ClienteMaterialEmpleadoController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { MaterialEmpleadoController } from '../infraestructure/MaterialEmpleadoController'
import { useListadoMaterialesDevolucionStore } from 'stores/listadoMaterialesDevolucion'
import { FiltroMiBodegaEmpleado } from '../domain/FiltroMiBodegaEmpleado'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { UnwrapRef } from 'vue'
import { useTransferenciaProductoEmpleadoStore } from 'stores/transferenciaProductoEmpleado'

export function useMaterialesEmpleado(filtro: UnwrapRef<FiltroMiBodegaEmpleado>, listadosAuxiliares: any) {
  // Stores
  const listadoMaterialesDevolucionStore = useListadoMaterialesDevolucionStore()
  const transferenciaProductoEmpleadoStore = useTransferenciaProductoEmpleadoStore()
  const authenticationStore = useAuthenticationStore()

  // Controllers
  const clienteMaterialEmpleadoController = new ClienteMaterialEmpleadoController()
  const materialEmpleadoController = new MaterialEmpleadoController()

  // Variables
  const { notificarAdvertencia } = useNotificaciones()
  const cargando = new StatusEssentialLoading()

  async function consultarProductosEmpleado() {
    try {
      cargando.activar()
      console.log(filtro)
      const { result } = await materialEmpleadoController.listar(filtro)

      listadosAuxiliares.productosStock = result
      listadosAuxiliares.productos = result

      listadoMaterialesDevolucionStore.listadoMateriales = result
      // listadoMaterialesDevolucionStore.origenProductos = 'personal'
      listadoMaterialesDevolucionStore.tareaId = null
      listadoMaterialesDevolucionStore.cliente_id = filtro.cliente_id
      listadoMaterialesDevolucionStore.empleado_id = filtro.empleado_id

      transferenciaProductoEmpleadoStore.listadoMateriales = result
      transferenciaProductoEmpleadoStore.cliente_id = filtro.cliente_id
      transferenciaProductoEmpleadoStore.idEmpleado = filtro.empleado_id
      transferenciaProductoEmpleadoStore.tareaId = null

      if (!result.length) notificarAdvertencia('No tienes material asignado.')
    } catch (e) {
      console.log(e)
    } finally {
      cargando.desactivar()
    }
  }

  async function consultarClientesMaterialesEmpleado(params?: any) {
    try {
      cargando.activar()

      // if(!params && !params.empleado_id)
      const { result } = await clienteMaterialEmpleadoController.listar({ empleado_id: params ? params.empleado_id : authenticationStore.user.id })
      listadosAuxiliares.clientesMaterialesEmpleado = result
    } catch (e) {
      console.log(e)
    } finally {
      cargando.desactivar()
    }
  }

  return {
    consultarProductosEmpleado,
    consultarClientesMaterialesEmpleado,
  }
}
