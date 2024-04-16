import { apiConfig, endpoints } from 'config/api'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { imprimirArchivo } from 'shared/utils'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    /************
     * Funciones
     ************/
    const descargarPdf = async () => {
      const axios = AxiosHttpRepository.getInstance()
      const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.fichas_retiros_imprimir)
      const filename = 'ficha_retiro_' + '_' + Date.now()
      imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
    }

    return {
      descargarPdf,
    }
  }
})
