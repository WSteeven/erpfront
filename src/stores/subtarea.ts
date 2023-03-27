import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSubtareaStore = defineStore('subtarea', () => {
  const idTarea = ref()
  const codigoTarea = ref()
  const idSubtareaSeleccionada = ref()
  const posicionSubtareaSeleccionada = ref()
  const codigoTareaSeleccionada = ref()
  const codigoSubtareaSeleccionada = ref()
  const idCliente = ref()
  const tareaTieneSubtareas = ref()
  const fechaHoraSuspendido = ref()
  const motivoSuspendido = ref()
  const accion = ref()
  const observacionTarea = ref()
  // Reagendar
  const subtareaEsVentana = ref()
  const fechaInicioTrabajo = ref()
  const horaInicioTrabajo = ref()
  const horaFinTrabajo = ref()

  return {
    idTarea,
    codigoTarea,
    idSubtareaSeleccionada,
    codigoTareaSeleccionada,
    codigoSubtareaSeleccionada,
    tareaTieneSubtareas,
    idCliente,
    fechaHoraSuspendido,
    motivoSuspendido,
    posicionSubtareaSeleccionada,
    accion,
    observacionTarea,
    // Reagendar
    subtareaEsVentana,
    fechaInicioTrabajo,
    horaInicioTrabajo,
    horaFinTrabajo,
  }
})
