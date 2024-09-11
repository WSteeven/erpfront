import { ClienteMaterialEmpleadoController } from '../infraestructure/ClienteMaterialEmpleadoController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { MaterialEmpleadoController } from '../infraestructure/MaterialEmpleadoController'
import { useListadoMaterialesDevolucionStore } from 'stores/listadoMaterialesDevolucion'
import { FiltroMiBodegaEmpleado } from '../domain/FiltroMiBodegaEmpleado'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { Ref, ref, UnwrapRef } from 'vue'
import { useTransferenciaProductoEmpleadoStore } from 'stores/transferenciaProductoEmpleado'
import { MaterialOcupadoFormulario } from 'pages/gestionTrabajos/formulariosTrabajos/emergencias/domain/MaterialOcupadoFormulario'
import { ActivoFijoAsignadoController } from 'pages/activosFijos/controlActivosFijos/infraestructure/ActivoFijoAsignadoController'

export function useMaterialesEmpleado(filtro: UnwrapRef<FiltroMiBodegaEmpleado>, listadosAuxiliares?: any, inactivo:Ref<boolean>=ref(false)) {
  // Stores
  const listadoMaterialesDevolucionStore = useListadoMaterialesDevolucionStore()
  const transferenciaProductoEmpleadoStore = useTransferenciaProductoEmpleadoStore()
  const authenticationStore = useAuthenticationStore()

  // Controllers
  const clienteMaterialEmpleadoController = new ClienteMaterialEmpleadoController()
  const materialEmpleadoController = new MaterialEmpleadoController()
  const activoFijoAsignadoController = new ActivoFijoAsignadoController()

  // Variables
  const { notificarAdvertencia } = useNotificaciones()
  const cargando = new StatusEssentialLoading()
  const todosProductosEmpleado: Ref<MaterialOcupadoFormulario[]> = ref([])
  const activosFijosAsignados: Ref<MaterialOcupadoFormulario[]> = ref([])
  const clientesMaterialesStock = ref()

  /**
   * Esta función se utiliza únicamente en Mi Bodega e interactúa con las
   * tiendas de devolucion y de transferencias.
   */
  async function consultarProductosEmpleado() {
    try {
      cargando.activar()
      console.log(filtro, inactivo.value)
      const { result } = await materialEmpleadoController.listar(filtro)

      listadosAuxiliares.productosStock = result
      listadosAuxiliares.productos = result

      listadoMaterialesDevolucionStore.listadoMateriales = result
      listadoMaterialesDevolucionStore.inactivo= inactivo.value
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

  /**
   * Esta es una funcion directa para consultar los productos del stock del empleado
   */
  async function consultarTodosProductosEmpleado() {
    cargando.activar()
    const { result } = await materialEmpleadoController.listar(filtro)
    todosProductosEmpleado.value = result
    cargando.desactivar()
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

  /**
   * Esta funcion maneja directamente la consulta a partir de filtro y no recibe nada por param
   */
  async function consultarClientesMaterialesStock() {
    try {
      cargando.activar()
      const { result } = await clienteMaterialEmpleadoController.listar(filtro)
      clientesMaterialesStock.value = result
    } catch (e) {
      console.log(e)
    } finally {
      cargando.desactivar()
    }
  }

  async function consultarActivosFijosAsignados() {
    cargando.activar()
    const { result } = await activoFijoAsignadoController.listar(filtro)
    activosFijosAsignados.value = result
    cargando.desactivar()
  }

  return {
    // Variables
    todosProductosEmpleado,
    clientesMaterialesStock,
    activosFijosAsignados,
    // Funciones
    consultarProductosEmpleado,
    consultarTodosProductosEmpleado,
    consultarClientesMaterialesEmpleado,
    consultarClientesMaterialesStock,
    consultarActivosFijosAsignados,
  }
}
