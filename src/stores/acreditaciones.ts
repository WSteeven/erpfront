import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAcreditacionesStore = defineStore('acreditaciones', () => {
  const idAcreditacion = ref()
  const idAcreditacionSeleccionada = ref()
  const posicionAcreditacionSeleccionada = ref()


  return {
    idAcreditacion,
    idAcreditacionSeleccionada,
    posicionAcreditacionSeleccionada,
  }
})
