import { ClienteMaterialEmpleadoController } from '../infraestructure/ClienteMaterialEmpleadoController'
import { MaterialEmpleadoTareaController } from '../infraestructure/MaterialEmpleadoTareaController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useListadoMaterialesDevolucionStore } from 'stores/listadoMaterialesDevolucion'
import { FiltroMiBodegaProyecto } from '../domain/FiltroMiBodegaProyecto'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { UnwrapRef } from 'vue'

export function useMaterialesProyecto(filtro: UnwrapRef<FiltroMiBodegaProyecto>, listadosAuxiliares: any) {
  // Stores
  const listadoMaterialesDevolucionStore = useListadoMaterialesDevolucionStore()
  const authenticationStore = useAuthenticationStore()

  // Controllers
  const clienteMaterialEmpleadoController = new ClienteMaterialEmpleadoController()
  const materialEmpleadoTareaController = new MaterialEmpleadoTareaController()

  // Variables
  const { notificarAdvertencia } = useNotificaciones()
  const cargando = new StatusEssentialLoading()

  async function consultarMaterialesProyecto() {
    try {
      cargando.activar()
      const { result } = await materialEmpleadoTareaController.listar(filtro)

      listadosAuxiliares.materialesTarea = result
      listadoMaterialesDevolucionStore.listadoMateriales = result
      // listadoMaterialesDevolucionStore.tareaId = filtro.tarea_id
      listadoMaterialesDevolucionStore.cliente_id = filtro.cliente_id

      // const tarea: Tarea = (listadosAuxiliares.tareas as any).find((tarea: Tarea) => tarea.id === filtro.tarea_id)

      if (!listadosAuxiliares.materialesTarea.length) {
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
