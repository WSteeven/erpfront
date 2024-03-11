import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTrabajoAsignadoStore = defineStore('trabajoAsignado', () => {
  const idTareaSeleccionada = ref()
  const idSubtareaSeleccionada = ref()
  const idEmergencia = ref()
  const codigoSubtarea = ref()
  const idEmpleadoResponsable = ref()
  const proyecto_id = ref()
  const etapa_id = ref()
  const cliente_id = ref()

  const subtarea = ref()

  return {
    idTareaSeleccionada,
    idSubtareaSeleccionada,
    idEmergencia,
    codigoSubtarea,
    idEmpleadoResponsable,
    subtarea,
    proyecto_id,
    etapa_id,
    cliente_id,
  }
})
