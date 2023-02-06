import { AxiosResponse } from "axios";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { endpoints } from "config/api";
import { acciones, autorizacionesTransacciones, estadosTransacciones } from "config/utils";
import { Pedido } from "pages/bodega/pedidos/domain/Pedido";
import { defineStore } from "pinia";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { useNotificaciones } from "shared/notificaciones";
import { reactive, ref } from "vue";

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
    const ruta = axios.getEndpoint(endpoints.pedidos) + 'show-preview/' + id
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
    const ruta = axios.getEndpoint(endpoints.pedidos) + 'show-preview/' + idPedido.value
    const response: AxiosResponse = await axios.get(ruta)
    pedido.hydrate(response.data.modelo)
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
    showPreview
  }

})
