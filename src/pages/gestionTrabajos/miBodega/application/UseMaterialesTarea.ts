// Dependencias
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useListadoMaterialesDevolucionStore } from 'stores/listadoMaterialesDevolucion'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { destinosTareas } from 'config/tareas.utils'
import { UnwrapRef } from 'vue'

// Logica y controladores
import { MaterialEmpleadoTareaController } from '../infraestructure/MaterialEmpleadoTareaController'
import { ClienteMaterialTareaController } from '../infraestructure/ClienteMaterialTareaController'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { FiltroMiBodega } from '../domain/FiltroMiBodega'

export function useMaterialesTarea(filtro: UnwrapRef<FiltroMiBodega>, listadosAuxiliares: any) {
  // Stores
  const authenticationStore = useAuthenticationStore()
  const listadoMaterialesDevolucionStore = useListadoMaterialesDevolucionStore()

  // Controllers
  const materialEmpleadoTareaController = new MaterialEmpleadoTareaController()
  const clienteMaterialTareaController = new ClienteMaterialTareaController()
  const tareaController = new TareaController()

  // Variables
  const { notificarAdvertencia } = useNotificaciones()
  const cargando = new StatusEssentialLoading()

  // Funciones
  async function consultarTareasClienteFinalMantenimiento() { //paraClienteProyecto: typeof destinosTareas[keyof typeof destinosTareas], proyecto?: number, etapa?: number) {
    try {
      cargando.activar()
      const { result } = await tareaController.listar({ activas_empleado: 1, empleado_id: authenticationStore.user.id, para_cliente_proyecto: destinosTareas.paraClienteFinal })
      listadosAuxiliares.tareas = result
    } catch (e) {
      console.log(e)
    } finally {
      cargando.desactivar()
    }
  }

  async function consultarProductosTarea() {
    try {
      cargando.activar()
      const { result } = await materialEmpleadoTareaController.listar(filtro)

      listadosAuxiliares.productosTarea = result
      listadosAuxiliares.productos = result
      listadoMaterialesDevolucionStore.listadoMateriales = result
      listadoMaterialesDevolucionStore.tareaId = filtro.tarea_id
      listadoMaterialesDevolucionStore.cliente_id = filtro.cliente_id

      if (!result.length) notificarAdvertencia('No tienes material asignado.')

    } catch (e) {
      console.log(e)
    } finally {
      cargando.desactivar()
    }
  }

  async function consultarClientesMaterialesTarea() {
    try {
      cargando.activar()
      const { result } = await clienteMaterialTareaController.listar({ empleado_id: authenticationStore.user.id })
      listadosAuxiliares.clientesMaterialesTarea = result
    } catch (e) {
      console.log(e)
    } finally {
      cargando.desactivar()
    }
  }

  return {
    // variables
    listadosAuxiliares,
    consultarClientesMaterialesTarea,
    // funciones
    consultarProductosTarea,
    consultarTareasClienteFinalMantenimiento,
  }
}
