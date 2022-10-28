import { SelectorController } from '../infraestructure/SelectorController'
import { useNotificaciones } from 'shared/notificaciones'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export function useSelector(selector: any) {
  const controller = new SelectorController(selector.endpoint)
  const status = new StatusEssentialLoading()

  const listar = async (criterioBusqueda?: string | null, filtrosAdicionales?: JSON) => {
    const filtros = {
      search: criterioBusqueda,
      hjhgj: ''
    }

    const nuevoFiltro = Object.assign(filtros, filtrosAdicionales)

    if (!criterioBusqueda) delete filtros.search

    status.activar()
    const { response } = await controller.listar(nuevoFiltro)
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

  const seleccionar = async (ids: number[]) => {
    status.activar()
    // const { result: seleccionado } = await controller.consultar(id)
    const { result: seleccionado } = await controller.listar(ids)
    selector.seleccionar(seleccionado)
    status.desactivar()
  }

  return {
    listar,
    seleccionar,
  }
}
