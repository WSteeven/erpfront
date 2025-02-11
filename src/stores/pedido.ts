import { AxiosResponse } from 'axios'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { apiConfig, endpoints } from 'config/api'
import { acciones, autorizacionesTransacciones, estadosTransacciones } from 'config/utils'
import { Pedido } from 'pages/bodega/pedidos/domain/Pedido'
import { defineStore } from 'pinia'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useNotificaciones } from 'shared/notificaciones'
import { imprimirArchivo } from 'shared/utils'
import { reactive, ref } from 'vue'

export const usePedidoStore = defineStore('pedido', () => {
  //State
  const pedido = reactive(new Pedido())
  const pedidoReset = new Pedido()
  const idPedido = ref()

  const { notificarAdvertencia, notificarError } = useNotificaciones()
  const accionPedido = acciones.nuevo
  const statusLoading = new StatusEssentialLoading()

  async function consultar(id: number) {
    const axios = AxiosHttpRepository.getInstance()
    const ruta = axios.getEndpoint(endpoints.pedidos) + '/show-preview/' + id
    const response: AxiosResponse = await axios.get(ruta)
    // cons ole.log('Respuesta obtenida en store de pedido: ', response)
    if (response.data.modelo.autorizacion === autorizacionesTransacciones.aprobado) {
      return response.data.modelo
    }
  }

  async function cargarPedido(id: number) {
    try {
      statusLoading.activar()
      const modelo = await consultar(id)
      // console.log('El modelo es: ', modelo)
      if (modelo.estado === estadosTransacciones.completa) {
        notificarAdvertencia('El pedido ya ha sido completado!')
      } else {
        pedido.hydrate(modelo)
      }
    } catch (e) {
      notificarAdvertencia('Pedido no encontrado')
      pedido.hydrate(pedidoReset)
    } finally {
      statusLoading.desactivar()
    }
  }

  async function showPreview() {
    const axios = AxiosHttpRepository.getInstance()
    const ruta = axios.getEndpoint(endpoints.pedidos) + '/show-preview/' + idPedido.value
    const response: AxiosResponse = await axios.get(ruta)
    pedido.hydrate(response.data.modelo)
  }

  async function imprimirPdf() {
    const axios = AxiosHttpRepository.getInstance()
    const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.pedidos) + '/imprimir/' + idPedido.value
    const filename = 'pedido_' + idPedido.value + '_' + Date.now()
    await imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
    console.log('Pedido impreso con éxito')
  }

  /**
   * La función `modificarPedido` es una función asíncrona que utiliza Axios para enviar una solicitud
   * PUT a un punto final específico para corregir una orden específica.
   * @param data - El parámetro `data` es la carga útil o los datos que desea enviar en el cuerpo de la
   * solicitud al realizar una solicitud PUT para modificar un pedido. Puede ser un objeto que contenga
   * la información actualizada del pedido.
   * @returns un objeto AxiosResponse.
   */
  async function modificarPedido(data) {
    const axios = AxiosHttpRepository.getInstance()
    const ruta = axios.getEndpoint(endpoints.pedidos) + '/corregir-pedido/' + idPedido.value
    const response: AxiosResponse = await axios.put(ruta, data)
    return response
  }


  /**
   * La función `eliminarDetalle` es una función asíncrona que utiliza Axios para enviar una solicitud
   * POST a un punto final específico para eliminar un artículo de un pedido.
   * @param detalle_id - El parámetro `detalle_id` es el ID del elemento de detalle que desea eliminar de
   * un pedido.
   * @param pedido_id - El parámetro `pedido_id` representa el ID del pedido del que se quiere dar de
   * baja un artículo.
   * @returns un objeto AxiosResponse.
   */
  async function eliminarDetalle(detalle_id, pedido_id) {
    const axios = AxiosHttpRepository.getInstance()
    const ruta = axios.getEndpoint(endpoints.pedidos) + '/eliminar-item'
    const response: AxiosResponse = await axios.post(ruta, { pedido_id, detalle_id })
    return response
  }

  function resetearPedido() {
    pedido.hydrate(pedidoReset)
  }

  async function buscarReporte(accion: string, data, listado) {
    try {
      statusLoading.activar()
      const axios = AxiosHttpRepository.getInstance()
      // let url = axios.getEndpoint(endpoints.proveedores) + '/reportes'
      const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.pedidos) + '/reportes'
      const filename = 'reporte_pedidos'
      switch (accion) {
        case 'excel':
          data.accion = 'excel'
          await imprimirArchivo(url, 'POST', 'blob', 'xlsx', filename, data)
          return listado
        case 'pdf':
          data.accion = 'pdf'
          await imprimirArchivo(url, 'POST', 'blob', 'pdf', filename, data)
          return listado
        default:
          data.accion = ''
          const response: AxiosResponse = await axios.post(url, data)
          // console.log(response)
          if (response.data.results) {
            if (response.data.results.length < 1) notificarAdvertencia('No se obtuvieron resultados')
            return response.data.results
          } else return listado
      }
    } catch (error) {
      console.log(error)
      notificarError('Error al obtener el reporte')
    } finally {
      statusLoading.desactivar()
    }
  }

  return {
    pedido,
    accionPedido,
    cargarPedido,
    resetearPedido,
    idPedido,
    showPreview,
    imprimirPdf,
    modificarPedido,
    eliminarDetalle,
    buscarReporte,
  }

})
