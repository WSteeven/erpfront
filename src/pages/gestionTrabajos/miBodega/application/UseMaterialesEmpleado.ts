import { TareaController } from 'gestionTrabajos/tareas/infraestructure/TareaController'
import { useAuthenticationStore } from 'stores/authentication'
import { FiltroMiBodega } from '../domain/FiltroMiBodega'
import { destinosTareas } from 'config/tareas.utils'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useListadoMaterialesDevolucionStore } from 'stores/listadoMaterialesDevolucion'
import { useNotificaciones } from 'shared/notificaciones'
import { MaterialEmpleadoController } from '../infraestructure/MaterialEmpleadoController'
import { UnwrapRef } from 'vue'

export function useMaterialesEmpleado(filtro: UnwrapRef<FiltroMiBodega>, listadosAuxiliares) {
  // Stores
  const listadoMaterialesDevolucionStore = useListadoMaterialesDevolucionStore()
  const authenticationStore = useAuthenticationStore()

  // Controllers
  const materialEmpleadoController = new MaterialEmpleadoController()
  const tareaController = new TareaController()

  // Variables
  const { notificarAdvertencia } = useNotificaciones()
  const cargando = new StatusEssentialLoading()


  // tareaController.listar({ activas_empleado: 1, empleado_id: authenticationStore.user.id, para_cliente_proyecto: destinosTareas.paraProyecto, campos: 'id,codigo_tarea,cliente_id' }).then((data) => listadosAuxiliares.tareas = data.result)

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

  return {
    consultarMaterialEmpleado,
  }
}
