import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTrabajoAsignadoStore = defineStore('trabajoAsignado', () => {
  const idSubtareaSeleccionada = ref()

  return {
    idSubtareaSeleccionada,
  }
})
