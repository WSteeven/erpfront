import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { Subtarea } from 'pages/tareas/subtareas/domain/Subtarea'
import { Tarea } from 'pages/tareas/controlTareas/domain/Tarea'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { acciones } from 'config/utils'

export const useTareaStore = defineStore('tarea', () => {
  // State - Coordinador
  const tarea = reactive(new Tarea())
  const subtarea = reactive(new Subtarea())
  const idCliente = ref() // al guardar show retorna string pero necesito id

  // Tecnico
  const subtareaAsignada = reactive(new Subtarea())
  const idSubtareaAsignada = ref()

  const subtareaReset = new Subtarea()
  const accionTarea = acciones.nuevo
  const accionSubtarea = acciones.nuevo

  const statusLoading = new StatusEssentialLoading()

  async function consultarSubtarea(id: number) {
    statusLoading.activar()
    const axios = AxiosHttpRepository.getInstance()
    const ruta = axios.getEndpoint(endpoints.subtareas) + id
    const response: AxiosResponse = await axios.get(ruta)
    statusLoading.desactivar()
    return response.data.modelo
  }

  async function consultarSubtareaCoordinador(id: number) {
    const modelo = await consultarSubtarea(id)
    subtarea.hydrate(modelo)
  }

  async function consultarSubtareaTecnico(id: number) {
    const modelo = await consultarSubtarea(id)
    subtareaAsignada.hydrate(modelo)
    console.log(modelo)
  }

  function resetearSubtarea() {
    subtarea.hydrate(subtareaReset)
  }

  return {
    // State
    tarea,
    subtarea,
    subtareaAsignada,
    accionTarea,
    accionSubtarea,
    consultarSubtareaCoordinador,
    consultarSubtareaTecnico,
    idSubtareaAsignada,
    idCliente,
    // accion,
    resetearSubtarea,
    // mostrarFormulario,
  }
})
