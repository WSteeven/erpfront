import { apiConfig, endpoints } from 'config/api'
import { PreingresoMaterial } from 'pages/bodega/preingresoMateriales/domain/PreingresoMaterial'
import { defineStore } from 'pinia'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { imprimirArchivo } from 'shared/utils'

import { reactive, ref } from 'vue'

export const usePreingresoStore = defineStore('preingreso', () => {
  //State
  const preingreso = reactive(new PreingresoMaterial())
  const preingresoReset = new PreingresoMaterial()
  const idPreingreso = ref()

  async function imprimirPdf() {
    const axios = AxiosHttpRepository.getInstance()
    const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.preingresos) + '/imprimir/' + idPreingreso.value
    const filename = 'preingreso_' + idPreingreso.value + '_' + Date.now()
    await imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
  }

  return {
    preingreso, preingresoReset, idPreingreso,

    imprimirPdf,

  }

})
