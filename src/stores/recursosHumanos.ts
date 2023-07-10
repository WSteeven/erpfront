import { defineStore } from "pinia";
import { ref } from "vue";
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { AxiosError, AxiosResponse } from 'axios'
import { endpoints } from 'src/config/api'


export const useRecursosHumanosStore = defineStore('fondo_rotativo', ()=>{
  const sueldo_basico = ref()

  const axios = AxiosHttpRepository.getInstance()

  async function obtener_sueldo_basico() {
    try {
      const userApi = axios.getEndpoint(endpoints.sueldo_basico)
      const response = await axios.get<AxiosResponse>(userApi)
      setSueldoBasico(response.data.rubro.valor_rubro)
      return response.data.rubro.valor_rubro
    } catch (e) {
      setSueldoBasico(0)
    }

  }
  const getSueldoBasico = () => {
    return sueldo_basico.value
  }
  const setSueldoBasico = (sueldo: number) => {
    sueldo_basico.value = sueldo
  }

  return {
    getSueldoBasico,
    obtener_sueldo_basico,
    sueldo_basico
  }
})
