import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { AxiosResponse } from 'axios';
import { apiConfig, endpoints } from 'config/api';

import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';

import { defineStore } from "pinia";
import { ref } from "vue";
import { useNotificaciones } from "shared/notificaciones";

export const useAsignacionAlimentacionStore = defineStore('preorden', () => {
  const listadoItems = ref([])
  const valor_asignar = ref(0)
  const statusLoading = new StatusEssentialLoading()
  const { notificarAdvertencia, notificarError } = useNotificaciones()

  async function listarempleados() {
    try {
        statusLoading.activar()
        const axios = AxiosHttpRepository.getInstance()
        const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.empleados)
        const response: AxiosResponse = await axios.get(url,{params:{estado:1}})
        listadoItems.value = response.data.results
    } catch (e: any) {
        notificarError(e)
    } finally {
        statusLoading.desactivar()
    }
}
  return {
    listarempleados,
    listadoItems,
    valor_asignar,
}

});
