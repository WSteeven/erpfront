import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export const useEmpleadoStore = defineStore('empleadoStore', () => {
  const idEmpleado = ref()
  const infoEmpleado = ref(false)
  const empleado = reactive(new Empleado())
  const cargando = new StatusEssentialLoading()
  const empleadosSubordinados = ref<number[]>([])
  async function getEmpleado() {
    const { result } = await new EmpleadoController().listar({
      id: idEmpleado.value
    })
    empleado.hydrate(result[0])
  }

  async function cargarEmpleado() {
    await getEmpleado()
  }

  async function tieneFichaSocioeconomica(): Promise<boolean> {
    cargando.activar()
    const axios = AxiosHttpRepository.getInstance()
    const ruta =
      axios.getEndpoint(endpoints.empleado_tiene_ficha_socioeconomica) +
      '/' +
      idEmpleado.value
    const response: AxiosResponse = await axios.get(ruta)
    cargando.desactivar()
    return response.data.result
  }
  async function tieneVisitaDomiciliaria(): Promise<boolean> {
    cargando.activar()
    const axios = AxiosHttpRepository.getInstance()
    const ruta =
      axios.getEndpoint(endpoints.empleado_tiene_visita_domiciliaria) +
      '/' +
      idEmpleado.value
    const response: AxiosResponse = await axios.get(ruta)
    cargando.desactivar()
    return response.data.result
  }

  async function obtenerUltimaFichaSocieconomica() {
    try {
      cargando.activar()
      const axios = AxiosHttpRepository.getInstance()
      const ruta = axios.getEndpoint(endpoints.ultima_ficha_socioeconomica_empleado) + '/' + idEmpleado.value
      const response: AxiosResponse = await axios.get(ruta)
      return response.data.modelo
    } catch (e) {
      console.error(e)
    } finally {
      cargando.desactivar()
    }
  }

  async function obtenerUltimaVisitaDomiciliaria() {
    try {
      cargando.activar()
      const axios = AxiosHttpRepository.getInstance()
      const ruta = axios.getEndpoint(endpoints.ultima_visita_domiciliaria_empleado) + '/' +idEmpleado.value
      const response: AxiosResponse = await axios.get(ruta)
      return response.data.modelo
    } catch (e) {
      console.error(e)
    } finally {
      cargando.desactivar()
    }
  }

  return {
    empleado,
    idEmpleado,
    infoEmpleado,
    cargarEmpleado,
    tieneFichaSocioeconomica,
    tieneVisitaDomiciliaria,
    obtenerUltimaFichaSocieconomica,
    obtenerUltimaVisitaDomiciliaria,
    empleadosSubordinados
  }
})
