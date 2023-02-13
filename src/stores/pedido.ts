import axios, { AxiosResponse } from 'axios'
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

  const { notificarAdvertencia } = useNotificaciones()
  const accionPedido = acciones.nuevo
  const statusLoading = new StatusEssentialLoading()

  async function consultar(id: number) {
    const axios = AxiosHttpRepository.getInstance()
    const ruta = axios.getEndpoint(endpoints.pedidos) + '/show-preview/' + id
    const response: AxiosResponse = await axios.get(ruta)
    console.log('Respuesta obtenida en store de pedido: ', response)
    if (response.data.modelo.autorizacion === autorizacionesTransacciones.aprobado) {
      return response.data.modelo
    }
  }

  async function cargarPedido(id: number) {
    try {
      statusLoading.activar()
      const modelo = await consultar(id)
      console.log('El modelo es: ', modelo)
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
    imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
    console.log('Pedido impreso con éxito')
  }

  /* async function imprimirPdf2() {
    const axiosHttpRepository = AxiosHttpRepository.getInstance()
    axios({
      url: apiConfig.URL_BASE + '/' + axiosHttpRepository.getEndpoint(endpoints.pedidos) + '/imprimir/' + idPedido.value,
      // url: axiosHttpRepository.getEndpoint(endpoints.pedidos)+'/imprimir/'+idPedido.value,
      method: 'GET',
      responseType: 'blob',

      headers: {
        'Authorization': AxiosHttpRepository.getInstance().getOptions().headers.Authorization
        'Authorization': axiosHttpRepository.getOptions().headers.Authorization
      }
    }).then((response) => {
      console.log(response)
      const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const fileLink = document.createElement('a')
      fileLink.href = fileURL
      fileLink.setAttribute('download', 'pedido_' + idPedido.value + '_' + Date.now() + '.pdf')
      document.body.appendChild(fileLink)
      fileLink.click()
    })
  } */

  function resetearPedido() {
    pedido.hydrate(pedidoReset)
  }

  return {
    pedido,
    accionPedido,
    cargarPedido,
    resetearPedido,
    idPedido,
    showPreview,
    imprimirPdf,
  }

})
