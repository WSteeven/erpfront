import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { DetalleProducto } from 'pages/bodega/detalles_productos/domain/DetalleProducto'
import { apiConfig, endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { acciones } from 'config/utils'
import { useNotificaciones } from 'shared/notificaciones'

export const useDetalleStore = defineStore('detalle', () => {
    //State
    const detalle = reactive(new DetalleProducto())
    let cantidad
    let estaInventario = true
    const idDetalle = ref()

    const accionDetalle = acciones.nuevo
    const detalleReset = new DetalleProducto()

    const statusLoading = new StatusEssentialLoading()
    const { notificarError, notificarAdvertencia } = useNotificaciones()

    async function consultarDetalle(id: number) {
        statusLoading.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.detalles) + id
        const response: AxiosResponse = await axios.get(ruta)
        statusLoading.desactivar()
        return response.data.modelo
    }

    async function anularDetalle() {
      try {
          statusLoading.activar()
          const axios = AxiosHttpRepository.getInstance()
          const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.detalles) + '/anular/' + idDetalle.value
          const response: AxiosResponse = await axios.post(url)
          return response
      } catch (error: any) {
          notificarError(error)
      } finally {
          statusLoading.desactivar()
      }
  }


    async function cargarDetalle(id: number) {
        // console.log('estas en el cargar detalle')
        const modelo = await consultarDetalle(id)
        // console.log('modelo obtenido: ',modelo)
        detalle.hydrate(modelo)
        estaInventario = true
    }

    function resetearDetalle() {
        detalle.hydrate(detalleReset)
    }
    return {
        detalle, idDetalle,
        cargarDetalle,
        resetearDetalle,
        accionDetalle,
        estaInventario,
        cantidad,
        anularDetalle,

    }
})
