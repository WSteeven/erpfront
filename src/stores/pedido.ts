import axios from 'axios';
import { AxiosResponse } from 'axios';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { endpoints } from 'config/api';
import { acciones, autorizacionesTransacciones, estadosTransacciones } from 'config/utils';
import { time } from 'console';
import { Pedido } from 'pages/bodega/pedidos/domain/Pedido';
import { defineStore } from 'pinia';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { useNotificaciones } from 'shared/notificaciones';
import { reactive, ref } from 'vue';

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
    if (response.data.modelo.autorizacion ===autorizacionesTransacciones.aprobado) {
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

  /* async function imprimirPdf2() {
    const axios = AxiosHttpRepository.getInstance()
    const ruta = axios.getEndpoint(endpoints.pedidos)+'/imprimir/'+idPedido.value
    const response: AxiosResponse = await axios.get(ruta,{responseType: 'blob', })
    console.log(response)
    const blob = new Blob([response.data], {type: 'application/pdf'})
    const link = document.createElement('a')
    link.href=window.URL.createObjectURL(blob)
    link.download = 'pedido_'+idPedido.value+'.pdf'
    link.click()
    console.log('Pedido consultado para imprimir. Pasó todo con éxito')
  } */
  async function imprimirPdf() {
    const axiosHttpRepository =AxiosHttpRepository.getInstance()
    axios({
      url: 'http://localhost:8000/api/pedidos/imprimir/'+idPedido.value,
      // url: axiosHttpRepository.getEndpoint(endpoints.pedidos)+'/imprimir/'+idPedido.value,
      method: 'GET',
      responseType: 'blob',

      headers:{
        'Authorization':AxiosHttpRepository.getHeaderToken().headers.Authorization}
    }).then((response)=>{
      const fileURL = window.URL.createObjectURL(new Blob([response.data]))
      const fileLink = document.createElement('a')
      fileLink.href = fileURL
      fileLink.setAttribute('download', 'pedido_'+idPedido.value+'_'+Date.now()+'.pdf')
      document.body.appendChild(fileLink)
      fileLink.click()
    })
    console.log('Pedido consultado para imprimir. Pasó todo con éxito')
  }

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
