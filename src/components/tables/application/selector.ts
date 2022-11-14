import { SelectorController } from '../infraestructure/SelectorController'
import { useNotificaciones } from 'shared/notificaciones'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export function useSelector(selector: any) {
  const controller = new SelectorController(selector.endpoint)
  const status = new StatusEssentialLoading()

  const listar = async (criterioBusqueda?: string | null, params?:any) => {
    const filtros = {
      search: criterioBusqueda,
    }

    if (!criterioBusqueda) delete filtros.search
    if(params){
      // Object.assign(filtros, params)
      status.activar()
      const {response} =await controller.listar(params)
      const result=response.data.results
      status.desactivar()
    }

    status.activar()
    const { response } = await controller.listar(filtros)
    const result = response.data.results
    status.desactivar()

    if (result.length === 0) {
      const { notificarAdvertencia } = useNotificaciones()
      // await sleep(0)
      notificarAdvertencia('No se encontraron coincidencias')
      return
    }

    // si se obtiene un solo elemento, se auto selecciona
    if (result.length === 1) {
      selector.refListadoSeleccionable.value.seleccionar(result[0])
      return
    }

    // si se obtienen mas, mostrar el listado
    if (result.length > 1) {
      selector.listadoSeleccionable.value = [...result]
      selector.refListadoSeleccionable.value.mostrar()
    }
  }

  const seleccionar = async (id: number) => {
    status.activar()
    const { result: seleccionado } = await controller.consultar(id)
    selector.seleccionar(seleccionado)
    status.desactivar()
  }

  

  return {
    listar,
    seleccionar,
  }
}
