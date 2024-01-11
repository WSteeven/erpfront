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
  const mes = ref()
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
async function asignarAlimentacion(data,valor_asignar) {
  try {
      statusLoading.activar()
      const axios = AxiosHttpRepository.getInstance()
      const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.asignar_alimentacion)
      data = {empleados: data,valor_minimo: valor_asignar}
      const response: AxiosResponse = await axios.post(url, data)
      console.log(response)
  } catch (e: any) {
      notificarError(e)
  } finally {
      statusLoading.desactivar()
  }
}
async function realizarCorte() {
  try {
      statusLoading.activar()
      const axios = AxiosHttpRepository.getInstance()
      const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.alimentacion)
      const response: AxiosResponse = await axios.post(url, {mes:mes})
      console.log(response)
  } catch (e: any) {
      notificarError(e)
  } finally {
      statusLoading.desactivar()
  }
}
  return {
    asignarAlimentacion,
    listarempleados,
    realizarCorte,
    listadoItems,
    valor_asignar,
    mes
}

});
