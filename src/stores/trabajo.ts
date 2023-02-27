import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTrabajoStore = defineStore('trabajo', () => {

  const idTrabajoSeleccionado = ref()
  const codigoTrabajoSeleccionado = ref()

  return {
    idTrabajoSeleccionado,
    codigoTrabajoSeleccionado,
  }
})
