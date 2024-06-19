import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import {  AxiosResponse } from 'axios'
import { endpoints } from 'src/config/api'

export const useRecursosHumanosStore = defineStore('fondo_rotativo', () => {
  const sueldo_basico = ref()
  const porcentajeAnticipo = ref()
  const total_descuento = ref()
  const porcentaje_endeudamiento = ref()
  const mensaje = ref()
  const axios = AxiosHttpRepository.getInstance()
const listar_familiares = ref(true)
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
  async function obtener_porcentaje_anticipo() {
    try {
      const userApi = axios.getEndpoint(endpoints.porcentaje_anticipo)
      const response = await axios.get<AxiosResponse>(userApi)
      setPorcentajeAnticipo(response.data.rubro.valor_rubro)
      return response.data.rubro.valor_rubro
    } catch (e) {
      setPorcentajeAnticipo(0)
    }
  }
  async function nivel_endeudamiento(id_empleado) {
    try {
      const userApi = axios.getEndpoint(endpoints.nivel_endeudamiento)
      const response = await axios.get<AxiosResponse>(userApi, {
        params: {
          empleado: id_empleado,
        },
      })
      setPorcentajeEndeudamiento(response.data.results.porcentaje)
      setTotalDescuento(response.data.results.total_descuento)
      setMensaje(response.data.results.mensaje)
      return response.data.results
    } catch (e) {
      setPorcentajeEndeudamiento(0)
      setTotalDescuento(0)
      setMensaje('')
      return e
    }
  }

  const getSueldoBasico = () => {
    return sueldo_basico.value
  }
  const setSueldoBasico = (sueldo: number) => {
    sueldo_basico.value = sueldo
  }
  const setTotalDescuento = (total_descuento_data: number) => {
    total_descuento.value = total_descuento_data
    console.log(total_descuento.value)
  }
  const setPorcentajeEndeudamiento = (porcentaje: number) => {
    porcentaje_endeudamiento.value = porcentaje
  }
  const setPorcentajeAnticipo = (porcentaje: number) => {
    porcentajeAnticipo.value = porcentaje
  }
  const setMensaje = (mensaje_data: string) => {
    mensaje.value = mensaje_data
  }

  return {
    getSueldoBasico,
    obtener_sueldo_basico,
    nivel_endeudamiento,
    sueldo_basico,
    total_descuento,
    porcentaje_endeudamiento,
    listar_familiares,
    obtener_porcentaje_anticipo,
    mensaje,
    porcentajeAnticipo,
  }
})
