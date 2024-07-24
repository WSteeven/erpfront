import { AxiosResponse } from 'axios';
import { endpoints } from 'config/api';
import { Vacante } from 'pages/recursosHumanos/SeleccionContratacionPersonal/vacantes/domain/Vacante';
import { defineStore } from 'pinia';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { reactive, ref } from 'vue';

export const useVacanteStore = defineStore('vacante', () => {
  const vacante = reactive(new Vacante())
  const idVacante = ref()
  const vacanteReset = new Vacante()

  function resetearVacante() {
    vacante.hydrate(vacanteReset)
  }

  async function showPreview() {
    const axios = AxiosHttpRepository.getInstance()
    const ruta = axios.getEndpoint(endpoints.vacantes) + '/show-preview/' + idVacante.value
    const response: AxiosResponse = await axios.get(ruta)
    vacante.hydrate(response.data.modelo)
  }


  return {
    vacante,
    idVacante,

    showPreview,
    resetearVacante,

  }
})
