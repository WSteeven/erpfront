import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMovilizacionSubtareaStore = defineStore('movilizacionSubtarea', () => {
  const subtareaDestino = ref()
  const motivo = ref()

  const axios = AxiosHttpRepository.getInstance()

  async function getSubtareaDestino(idEmpleado: number) {
    const ruta = axios.getEndpoint(endpoints.movilizacion_subtarea_destino_actual, { empleado_id: idEmpleado })
    const response: AxiosResponse = await axios.get(ruta)
    const results = response.data.results
    if (results.length) {
      subtareaDestino.value = results[0].subtarea
      motivo.value = results[0].motivo
    } else {
      subtareaDestino.value = null
      motivo.value = null
    }
  }

  return {
    subtareaDestino,
    motivo,
    getSubtareaDestino,
  }
})
