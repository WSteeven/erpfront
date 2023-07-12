import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTrabajoAsignadoStore = defineStore('trabajoAsignado', () => {
  const idTareaSeleccionada = ref()
  const idSubtareaSeleccionada = ref()
  const idEmergencia = ref()
  const codigoSubtarea = ref()
  const idEmpleadoResponsable = ref()

  const subtarea = ref()

  return {
    idTareaSeleccionada,
    idSubtareaSeleccionada,
    idEmergencia,
    codigoSubtarea,
    idEmpleadoResponsable,
    subtarea,
  }
})
