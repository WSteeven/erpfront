import { AxiosResponse } from 'axios';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { apiConfig, endpoints } from 'config/api';
import { acciones } from 'config/utils';
import { OrdenCompra } from 'pages/comprasProveedores/ordenCompra/domain/OrdenCompra';
import { defineStore } from 'pinia';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { useNotificaciones } from 'shared/notificaciones';
import { imprimirArchivo, notificarMensajesError } from 'shared/utils';
import { reactive, ref } from 'vue';

export const useOrdenCompraStore = defineStore('ordenCompra', () => {
  //State
  const orden = reactive(new OrdenCompra())
  const ordenReset = new OrdenCompra()
  const idOrden = ref()

  const { notificarCorrecto, notificarAdvertencia, notificarError } = useNotificaciones()
  const accionOrden = acciones.nuevo
  const statusLoading = new StatusEssentialLoading()

  /*******************************************************************************************
   * Funciones
   ******************************************************************************************/
  async function imprimirPdf() {
    try {
      statusLoading.activar()
      const axios = AxiosHttpRepository.getInstance()
      const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.ordenes_compras) + '/imprimir/' + idOrden.value
      const filename = 'orden_compra_' + idOrden.value + '_' + Date.now()
      imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
      console.log('Orden de compra impreso con éxito')
    } catch (e) {
      notificarAdvertencia('Error al imprimir la orden de compra. ' + e)
    } finally {
      statusLoading.desactivar()
    }
  }

  async function enviarPdf() {
    try {
      statusLoading.activar()
      const axios = AxiosHttpRepository.getInstance()
      const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.ordenes_compras) + '/toProveedor/' + idOrden.value
      const response: AxiosResponse = await axios.get(url)
      if (response.status = 200) notificarCorrecto(response.data.mensaje)
      else notificarAdvertencia(response.data.mensaje)

    } catch (e) {
      notificarError('Error al enviar la orden de compra al proveedor.' + e)
    } finally {
      statusLoading.desactivar()
    }
  }


  async function anularOrden(data: any) {
    try {
      statusLoading.activar()
      const axios = AxiosHttpRepository.getInstance()
      const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.ordenes_compras) + '/anular/' + idOrden.value
      const response: AxiosResponse = await axios.post(url, data)
      return response
    } catch (e: any) {
      notificarError(e)
    } finally {
      statusLoading.desactivar()
    }
  }

  async function marcarRealizada(data: any) {
    try {
      statusLoading.activar()
      const axios = AxiosHttpRepository.getInstance()
      const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.ordenes_compras) + '/realizada/' + idOrden.value
      const response: AxiosResponse = await axios.post(url, data)
      if (response.status = 200) notificarCorrecto(response.data.mensaje)
      else notificarAdvertencia(response.data.mensaje)
    } catch (e) {
      notificarError('Error al marcar como realizada la orden de compra.' + e)
    } finally {
      statusLoading.desactivar()
    }
  }
  async function marcarPagada() {
    try {
      statusLoading.activar()
      const axios = AxiosHttpRepository.getInstance()
      const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.ordenes_compras) + '/pagada/' + idOrden.value
      const response: AxiosResponse = await axios.get(url)
      if (response.status = 200) notificarCorrecto(response.data.mensaje)
      else notificarAdvertencia(response.data.mensaje)
    } catch (e) {
      notificarError('Error al marcar como realizada la orden de compra.' + e)
    } finally {
      statusLoading.desactivar()
    }
  }

  async function consultarDashboard(data) {
    try {
      statusLoading.activar()
      const axios = AxiosHttpRepository.getInstance()
      const url = apiConfig.URL_BASE+'/'+axios.getEndpoint(endpoints.dashboard_compras)
      const response: AxiosResponse = await axios.post(url, data)
      console.log(response.data.results)
      return response.data.results
    } catch (error) {
      notificarError('Error al consultar el dashboard' + error)
    }finally{
      statusLoading.desactivar()
    }
  }

  function resetearOrden() {
    orden.hydrate(ordenReset)
  }

  return {
    orden,
    accionOrden,
    idOrden,

    anularOrden,
    resetearOrden,
    imprimirPdf,
    enviarPdf,
    marcarRealizada,
    marcarPagada,
    consultarDashboard,
  }
})
