import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { AxiosResponse } from 'axios'
import { apiConfig, endpoints } from 'config/api'

import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNotificaciones } from 'shared/notificaciones'
import { Alimentacion } from 'pages/recursosHumanos/alimentacion/alimentacion/domain/Alimentacion'

export const useAsignacionAlimentacionStore = defineStore('preorden', () => {
  const listadoItems = ref([])
  const alimentaciones = ref([])
  const valor_asignar = ref(0)
  const mes = ref()
  const alimentacion = new Alimentacion()
  const statusLoading = new StatusEssentialLoading()
  const { notificarError } = useNotificaciones()

  async function listarempleados() {
    try {
      statusLoading.activar()
      const axios = AxiosHttpRepository.getInstance()
      const url =
        apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.empleados)
      const response: AxiosResponse = await axios.get(url, {
        params: { estado: 1 },
      })
      listadoItems.value = response.data.results
    } catch (e: any) {
      notificarError(e)
    } finally {
      statusLoading.desactivar()
    }
  }
  async function obtenerAlimentacion() {
    try {
      statusLoading.activar()
      const axios = AxiosHttpRepository.getInstance()
      const url =
        apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.alimentacion)
      const response: AxiosResponse = await axios.get(url, {
        params: {mes: alimentacion.mes,es_quincena:alimentacion.es_quincena?1:0, finalizado: 0 },
      })
      alimentaciones.value = response.data.results
      alimentacion.hydrate(alimentaciones.value[0])
    } catch (e: any) {
      notificarError(e)
    } finally {
      statusLoading.desactivar()
    }
  }


  async function asignarAlimentacion(data, valor_asignar) {
    try {
      statusLoading.activar()
      const axios = AxiosHttpRepository.getInstance()
      const url =
        apiConfig.URL_BASE +
        '/' +
        axios.getEndpoint(endpoints.asignar_alimentacion)
      data = { empleados: data, valor_minimo: valor_asignar }
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
      obtenerNombreMes()
      const axios = AxiosHttpRepository.getInstance()
      const url =
        apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.alimentacion)
      const response: AxiosResponse = await axios.post(url, alimentacion)
      alimentacion.id = response.data.modelo.id

    } catch (e: any) {
      notificarError(e)
    } finally {
      statusLoading.desactivar()
    }
  }
  function obtenerNombreMes() {
    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ]
    const [anio,mes] = alimentacion.mes!.split('-')
    alimentacion.nombre = `ASIGNACION DE ALIMENTACION ${alimentacion.es_quincena ? 'QUINCENA DEL MES DE ' : ''
      }  ${meses[parseInt(mes, 10) - 1]} de ${anio}`
  }
  return {
    asignarAlimentacion,
    listarempleados,
    realizarCorte,
    obtenerAlimentacion,
    alimentaciones,
    listadoItems,
    valor_asignar,
    mes,
    alimentacion,
  }
})
