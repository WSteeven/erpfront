import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSubtareaStore = defineStore('subtarea', () => {
  const idTarea = ref()
  const codigoTarea = ref()
  const idSubtareaSeleccionada = ref()
  const posicionSubtareaSeleccionada = ref()
  const codigoTrabajoSeleccionado = ref()
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
    codigoTrabajoSeleccionado,
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
