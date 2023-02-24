import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTrabajoAsignadoStore = defineStore('trabajoAsignado', () => {
  const idTrabajoSeleccionado = ref()
  // const idTipoTrabajoSubtarea = ref()

  return {
    idTrabajoSeleccionado,
    // idTipoTrabajoSubtarea,
  }
})
