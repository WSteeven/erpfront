import { EtapaController } from 'pages/gestionTrabajos/proyectos/modules/etapas/infraestructure/EtapaController'
import { ClienteMaterialEmpleadoController } from '../infraestructure/ClienteMaterialEmpleadoController'
import { ProyectoController } from 'pages/gestionTrabajos/proyectos/infraestructure/ProyectoController'
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
  const proyectoController = new ProyectoController()
  const etapaController = new EtapaController()

  // Variables
  const { notificarAdvertencia } = useNotificaciones()
  const cargando = new StatusEssentialLoading()

  async function consultarProductosProyecto() {
    try {
      cargando.activar()

      const { result } = await materialEmpleadoTareaController.listar(filtro)

      listadosAuxiliares.productosProyectosEtapas = result
      listadosAuxiliares.productos = result

      listadoMaterialesDevolucionStore.listadoMateriales = result
      listadoMaterialesDevolucionStore.cliente_id = filtro.cliente_id

      if (!result.length) notificarAdvertencia('No tienes material asignado.')

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

  async function consultarProyectos() {
    const params = {
      campos: 'id,nombre,codigo_proyecto,cliente_id,etapas',
      finalizado: 0,
      empleado_id: authenticationStore.user.id,
    }

    try {
      cargando.activar()
      const { result } = await proyectoController.listar(params)
      listadosAuxiliares.proyectos = result
    } catch (e) {
      console.log(e)
    } finally {
      cargando.desactivar()
    }
  }

  async function consultarEtapas(idProyecto: number) {
    const params = {
      campos: 'id,nombre',
      activo: 1,
      empleado_id: authenticationStore.user.id,
      proyecto_id: idProyecto,
      etapas_empleado: 1,
    }

    try {
      cargando.activar()
      const { result } = await etapaController.listar(params)
      listadosAuxiliares.etapas = result
      console.log(listadosAuxiliares.etapas)
    } catch (e) {
      console.log(e)
    } finally {
      cargando.desactivar()
    }
  }

  return {
    consultarProductosProyecto,
    consultarClientesMaterialesEmpleado,
    consultarProyectos,
    consultarEtapas,
  }
}
