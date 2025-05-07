import { useNotificaciones } from 'shared/notificaciones'
import { apiConfig, endpoints } from 'config/api'
import { imprimirArchivo } from 'shared/utils'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'

export const useFunctionsBitacoraVehicular = () => {
  const { notificarAdvertencia } = useNotificaciones()

  async function imprimirPdf(id: number) {
    try {
      const axios = AxiosHttpRepository.getInstance()
      const url =
        apiConfig.URL_BASE +
        '/' +
        axios.getEndpoint(endpoints.bitacoras_vehiculos) +
        '/imprimir/' +
        id
      const filename = 'bitacora_vehicular_' + id + '_' + Date.now()
      await imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
      // console.log('Bitácora vehicular con éxito')
    } catch (e) {
      notificarAdvertencia('Error al imprimir la bitácora. ' + e)
    }
  }

  return {
    imprimirPdf
  }
}
