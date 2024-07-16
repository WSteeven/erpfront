import { apiConfig, endpoints } from 'config/api';
import { defineStore } from 'pinia';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { imprimirArchivo } from 'shared/utils';
import { ref } from 'vue';

export const useActivoFijoStore = defineStore('activo_fijo', () => {
  const idActivo = ref()

  async function imprimirPdf() {
    const axios = AxiosHttpRepository.getInstance()
    const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.activos_fijos) + '/imprimir/' + idActivo.value
    const filename = 'activo_' + idActivo.value + '_' + Date.now()
    imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
    console.log('Activo impreso con éxito')
  }

  return {
    idActivo,
    imprimirPdf,
  }
})
