import { AxiosResponse } from 'axios';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { apiConfig, endpoints } from 'config/api';
import { acciones } from 'config/utils';
import { Traspaso } from 'pages/bodega/traspasos/domain/Traspaso';
import { defineStore } from 'pinia';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { reactive, ref } from 'vue';
import { imprimirArchivo } from 'shared/utils';

export const useTraspasoStore = defineStore('traspaso', () => {
  //State
  const traspaso = reactive(new Traspaso())
  const traspasoReset = new Traspaso()
  const idTraspaso = ref()

  const accionTraspaso = acciones.nuevo
  const statusLoading = new StatusEssentialLoading()

  async function consultar(id: number) {
    const axios = AxiosHttpRepository.getInstance()
    const ruta = axios.getEndpoint(endpoints.traspasos) + '/show-preview/' + id
    const response: AxiosResponse = await axios.get(ruta)
    return response.data.modelo
  }

  async function cargarTraspaso(id: number) {
    try {
      statusLoading.activar()
      const modelo = await consultar(id)
      traspaso.hydrate(modelo)
    } catch (e) {
      traspaso.hydrate(traspasoReset)
    } finally {
      statusLoading.desactivar()
    }
  }

  async function showPreview() {
    const axios = AxiosHttpRepository.getInstance()
    const ruta = axios.getEndpoint(endpoints.traspasos) + '/show-preview/' + idTraspaso.value
    const response: AxiosResponse = await axios.get(ruta)
    traspaso.hydrate(response.data.modelo)
  }

  async function imprmirPdf() {
    const axios = AxiosHttpRepository.getInstance()
    const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.traspasos) + '/imprimir/' + idTraspaso.value
    const filename = 'traspaso_' + idTraspaso.value + '_' + Date.now()
    imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
    console.log('traspaso impreso con exito')
  }

  function resetearTraspaso() {
    traspaso.hydrate(traspasoReset)
  }

  return {
    traspaso,
    accionTraspaso,
    cargarTraspaso,
    resetearTraspaso,
    idTraspaso,
    showPreview,
    imprmirPdf,
  }


})
