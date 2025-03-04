import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { SelectorController } from '../infraestructure/SelectorController'
import { useNotificaciones } from 'shared/notificaciones'
import { AxiosError, isAxiosError } from 'axios'
import { ref } from 'vue'
import { notificarMensajesError } from 'shared/utils'

export function useSelector(selector: any) {
  const controller = new SelectorController(selector.endpoint)
  const status = new StatusEssentialLoading()
  const notificaciones = useNotificaciones()
  const existenCoincidencias = ref(true) // 

  const listar = async (criterioBusqueda?: string | null, params?: any) => {
    /* const filtros = {
      search: criterioBusqueda,
    } */
    let result
    existenCoincidencias.value = true
    // if (!criterioBusqueda) delete filtros.search
    try {
      status.activar()
      const { response } = await controller.listar({ search: criterioBusqueda, ...params })
      if (response.data.mensaje) notificaciones.notificarAdvertencia(response.data.mensaje)
      result = response.data.data ?? response.data.results
      status.desactivar()
      /* if (params) {
        status.activar()
        const { response } = await controller.listar(params)
        if (response.data.mensaje) notificaciones.notificarAdvertencia(response.data.mensaje)
        result = response.data.data ?? response.data.results
        status.desactivar()
      } else {
        status.activar()
        const { response } = await controller.listar(filtros)
        if (response.data.mensaje) notificaciones.notificarAdvertencia(response.data.mensaje)
        result = response.data.data ?? response.data.results
        status.desactivar()
      } */
    } catch (error: unknown) {
      // notificaciones.notificarError(axiosError + '')
      // console.log(e)
      
      // if (isAxiosError(error)) {
        // const axiosError = e as AxiosError
        const mensajes: string[] = (error as any).erroresValidacion
        console.log(mensajes)
        await notificarMensajesError(mensajes, notificaciones)
      // }
    } finally {
      status.desactivar()
    }

    if (result) {
      if (result.length === 0) {
        const { notificarAdvertencia } = useNotificaciones()
        existenCoincidencias.value = false
        return notificarAdvertencia('No se encontraron coincidencias')
      }

      // si se obtiene un solo elemento, se auto selecciona
      if (result.length === 1) {
        selector.refListadoSeleccionable.value.seleccionar(result) // seleccion multiple verificar si funciona para seleccion simple
        existenCoincidencias.value = true
        return
      }

      // si se obtienen mas, mostrar el listado
      if (result.length > 1) {
        selector.listadoSeleccionable.value = [...result]
        selector.refListadoSeleccionable.value.mostrar()
        existenCoincidencias.value = true
      }
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
    existenCoincidencias,
  }
}
