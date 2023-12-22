// Dependencias
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useListadoMaterialesDevolucionStore } from 'stores/listadoMaterialesDevolucion'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { destinosTareas } from 'config/tareas.utils'
import { UnwrapRef, reactive } from 'vue'

// Logica y controladores
import { MaterialEmpleadoTareaController } from '../infraestructure/MaterialEmpleadoTareaController'
import { ClienteMaterialTareaController } from '../infraestructure/ClienteMaterialTareaController'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { Tarea } from 'pages/gestionTrabajos/tareas/domain/Tarea'
import { FiltroMiBodega } from '../domain/FiltroMiBodega'
import { ProyectoController } from 'pages/gestionTrabajos/proyectos/infraestructure/ProyectoController'
import { EtapaController } from 'pages/gestionTrabajos/proyectos/modules/etapas/infraestructure/EtapaController'

export function useMaterialesTarea(filtro: UnwrapRef<FiltroMiBodega>, listadosAuxiliares: any) {
  // Stores
  const authenticationStore = useAuthenticationStore()
  const listadoMaterialesDevolucionStore = useListadoMaterialesDevolucionStore()

  // Controllers
  const materialEmpleadoTareaController = new MaterialEmpleadoTareaController()
  const clienteMaterialTareaController = new ClienteMaterialTareaController()
  const proyectoController = new ProyectoController()
  const tareaController = new TareaController()
  const etapaController = new EtapaController()

  // Variables
  const { notificarAdvertencia } = useNotificaciones()
  const cargando = new StatusEssentialLoading()

  // Funciones
  async function consultarTareas(paraClienteProyecto: typeof destinosTareas[keyof typeof destinosTareas], proyecto?: number, etapa?: number) {
    console.log('consultando tareas...')
    console.log(paraClienteProyecto)
    try {
      cargando.activar()
      const { result } = await tareaController.listar({ activas_empleado: 1, empleado_id: authenticationStore.user.id, para_cliente_proyecto: paraClienteProyecto, proyecto_id: proyecto, etapa_id: etapa })
      listadosAuxiliares.tareas = result
    } catch (e) {
      console.log(e)
    } finally {
      cargando.desactivar()
    }
  }

  async function obtenerMaterialesTarea() {
    try {
      cargando.activar()
      const { result } = await materialEmpleadoTareaController.listar(filtro)

      listadosAuxiliares.materialesTarea = result
      listadoMaterialesDevolucionStore.listadoMateriales = result
      listadoMaterialesDevolucionStore.tareaId = filtro.tarea_id
      listadoMaterialesDevolucionStore.cliente_id = filtro.cliente_id

      const tarea: Tarea = (listadosAuxiliares.tareas as any).find((tarea: Tarea) => tarea.id === filtro.tarea_id)

      if (!listadosAuxiliares.materialesTarea.length) {
        notificarAdvertencia('No tienes material asignado.')
      }
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
    // variables
    listadosAuxiliares,
    consultarClientesMaterialesTarea,
    // funciones
    obtenerMaterialesTarea,
    consultarTareas,
    consultarProyectos,
    consultarEtapas,
  }
}
