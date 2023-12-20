import { TareaController } from 'gestionTrabajos/tareas/infraestructure/TareaController'
import { useAuthenticationStore } from 'stores/authentication'
import { FiltroMiBodega } from '../domain/FiltroMiBodega'
import { destinosTareas } from 'config/tareas.utils'
import { UnwrapRef, reactive } from 'vue'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { MaterialEmpleadoTareaController } from '../infraestructure/MaterialEmpleadoTareaController'
import { useListadoMaterialesDevolucionStore } from 'stores/listadoMaterialesDevolucion'
import { Tarea } from 'pages/gestionTrabajos/tareas/domain/Tarea'
import { useNotificaciones } from 'shared/notificaciones'

export function useMaterialesEmpleado(filtro: UnwrapRef<FiltroMiBodega>, listadosAuxiliares) {
  // Stores
  const listadoMaterialesDevolucionStore = useListadoMaterialesDevolucionStore()
  const authenticationStore = useAuthenticationStore()

  // Controllers
  const materialEmpleadoTareaController = new MaterialEmpleadoTareaController()
  const tareaController = new TareaController()

  // Variables
  const { notificarAdvertencia } = useNotificaciones()
  const cargando = new StatusEssentialLoading()


  tareaController.listar({ activas_empleado: 1, empleado_id: authenticationStore.user.id, para_cliente_proyecto: destinosTareas.paraProyecto, campos: 'id,codigo_tarea,cliente_id' }).then((data) => listadosAuxiliares.tareas = data.result)

  async function obtenerMaterialesTarea(cliente: number) {
    try {
      cargando.activar()
      filtro.cliente_id = cliente
      const { result } = await materialEmpleadoTareaController.listar(filtro)

      listadosAuxiliares.materialesProyecto = result
      listadoMaterialesDevolucionStore.listadoMateriales = result
      listadoMaterialesDevolucionStore.tareaId = filtro.tarea_id
      listadoMaterialesDevolucionStore.cliente_id = cliente

      const tarea: Tarea = (listadosAuxiliares.tareas as any).find((tarea: Tarea) => tarea.id === filtro.tarea_id)

      if (!listadosAuxiliares.materialesProyecto.length) {
        notificarAdvertencia('No tienes material asignado.')
      }
    } catch (e) {
      console.log(e)
    } finally {
      cargando.desactivar()
    }
  }

  return {
    listadosAuxiliares,
  }
}
